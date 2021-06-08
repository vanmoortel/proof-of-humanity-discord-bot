import Transport from 'winston-transport';
import net from 'net';
import os from 'os';
import fs from 'fs';
import tls from 'tls';
import util from 'util';

class LogstashTransport extends Transport {
  constructor(options = {}) {
    super(options);

    this.name = options.name || 'log';
    this.version = options.version || '1.0';

    this.localhost = options.localhost || os.hostname();
    this.host = options.host || '127.0.0.1';
    this.port = options.port || 28777;
    this.pid = options.pid || process.pid;
    this.max_connect_retries = (typeof options.max_connect_retries === 'number') ? options.max_connect_retries : -1;
    this.timeout_connect_retries = (typeof options.timeout_connect_retries === 'number') ? options.timeout_connect_retries : 10000;
    this.retries = -1;

    // Support for winston build in logstash format
    // https://github.com/flatiron/winston/blob/master/lib/winston/common.js#L149
    this.logstash = options.logstash || false;

    // SSL Settings
    this.ssl_enable = options.ssl_enable || false;
    this.ssl_key = options.ssl_key || '';
    this.ssl_cert = options.ssl_cert || '';
    this.ca = options.ca || '';
    this.ssl_passphrase = options.ssl_passphrase || '';
    this.rejectUnauthorized = options.rejectUnauthorized === true;

    // Connection state
    this.log_queue = [];
    this.connected = false;
    this.socket = null;

    this.readFile = util.promisify(fs.readFile);

    this.connect();
  }

  async connect() {
    let options = {};
    const self = this;
    this.retries += 1;
    this.connecting = true;
    this.terminating = false;
    if (this.ssl_enable) {
      options = {
        key: this.ssl_key ? await self.readFile(this.ssl_key) : null,
        cert: this.ssl_cert ? await self.readFile(this.ssl_cert) : null,
        passphrase: this.ssl_passphrase ? this.ssl_passphrase : null,
        rejectUnauthorized: this.rejectUnauthorized === true,
        ca: this.ca ? await Promise.all(this.ca.map((filePath) => self.readFile(filePath))) : null,
      };
      this.socket = tls.connect(this.port, this.host, options, (() => {
        self.socket.setEncoding('UTF-8');
        self.announce();
        self.connecting = false;
      }));
    } else {
      this.socket = new net.Socket();
    }

    this.socket.on('error', (err) => {
      self.connecting = false;
      self.connected = false;

      if (self.socket) {
        self.socket.destroy();
      }

      self.socket = null;

      if (!err.message.includes('ECONNREFUSED')) {
        self.emit('error', err);
      }
    });

    this.socket.on('timeout', () => {
      if (self.socket) {
        self.socket.destroy();
      }
    });

    this.socket.on('connect', () => {
      self.retries = 0;
    });

    this.socket.on('close', () => {
      self.connected = false;

      if (self.terminating) {
        return;
      }

      if (self.max_connect_retries < 0 || self.retries < self.max_connect_retries) {
        if (!self.connecting) {
          setTimeout(() => {
            self.connect();
          }, self.timeout_connect_retries);
        }
      } else {
        self.log_queue = [];
        self.silent = true;
        self.emit('error', new Error('Max retries reached, transport in silent mode, OFFLINE'));
      }
    });

    if (!this.ssl_enable) {
      this.socket.connect(self.port, self.host, () => {
        self.announce();
        self.connecting = false;
        self.socket.setKeepAlive(true, 60 * 1000);
      });
    }
  }

  log(info, callback) {
    const self = this;
    if (info.skip || self.silent) {
      callback();
    }
    const log = typeof info === 'object' ? info : { message: JSON.stringify(info).slice(0, 999999) };

    const message = JSON.stringify({
      '@metadata': {
        beat: self.name,
        version: self.version,
      },
      beat: {
        name: this.name,
        hostname: this.localhost,
      },
      ...log,
    });

    if (!self.connected) {
      self.log_queue.push({
        message,
        callback() {
          self.emit('logged');
          callback();
        },
      });
    } else {
      self.sendLog(message, () => {
        self.emit('logged');
        callback();
      });
    }
  }

  close() {
    const self = this;
    self.terminating = true;
    if (self.connected && self.socket) {
      self.connected = false;
      self.socket.end();
      self.socket.destroy();
      self.socket = null;
    }
  }

  flush() {
    const self = this;
    self.log_queue.forEach((l) => self.sendLog(l.message, l.callback));
    self.log_queue = [];
  }

  sendLog(message, callback = () => {}) {
    const self = this;

    self.socket.write(`${message}\n`);
    callback();
  }

  announce() {
    const self = this;
    self.connected = true;
    self.flush();
    if (self.terminating) {
      self.close();
    }
  }
}

export default LogstashTransport;
