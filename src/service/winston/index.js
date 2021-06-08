import { createLogger, format, transports } from 'winston';
import fs from 'fs';
import path from 'path';
import config from 'config';
import Moment from 'moment';
import expressWinston from 'express-winston';
import jsome from 'jsome';
import LogstashTransport from './logstashTransport';

let transportList = [];

if (config.get('NODE_ENV') !== 'production') {
  transportList = [
    ...transportList,
    new transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(
          (info) => `${info.timestamp} ${info.level} : ${info.message}`,
        ),
      ),
    }),
  ];
}

if (config.get('SERVICE.WINSTON.LOG_DIR')) {
  // Create the log directory if it does not exist
  if (!fs.existsSync(config.get('SERVICE.WINSTON.LOG_DIR'))) {
    fs.mkdirSync(config.get('SERVICE.WINSTON.LOG_DIR'));
  }

  const filename = path.join(config.get('SERVICE.WINSTON.LOG_DIR'), `${Moment().format('YYYY-MM-DD')}.log`);
  transportList = [
    ...transportList,
    new transports.File({
      filename,
      format: format.combine(
        format.json(
          (info) => ({
            timestamp: info.timestamp, level: info.level, message: info.message,
          }),
        ),
      ),
    }),
  ];
}

if (config.get('SERVICE.WINSTON.LOG_LOGSTASH.HOST')) {
  transportList = [
    ...transportList,
    new LogstashTransport({
      level: config.get('SERVICE.WINSTON.LOG_LEVEL'),
      format: format.combine(
        format.json(
          (info) => ({
            timestamp: info.timestamp, level: info.level, message: info.message,
          }),
        ),
      ),
      name: config.get('SERVICE.WINSTON.LOG_LOGSTASH.NAME'),
      version: config.get('SERVICE.WINSTON.LOG_LOGSTASH.VERSION'),
      host: config.get('SERVICE.WINSTON.LOG_LOGSTASH.HOST'),
      port: parseInt(config.get('SERVICE.WINSTON.LOG_LOGSTASH.PORT'), 10),
      ssl_enable: config.get('SERVICE.WINSTON.LOG_LOGSTASH.SSL'),
      ssl_key: `${__dirname}/logstashTransport/private.key`,
      ssl_cert: `${__dirname}/logstashTransport/cert.crt`,
      ca: [`${__dirname}/logstashTransport/ca.crt`],
    }),
  ];
}

const logger = createLogger({
  level: config.get('SERVICE.WINSTON.LOG_LEVEL'),
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  ),
  transports: transportList,
});

export const answer = (status, result, req, res) => {
  if (config.get('SERVICE.WINSTON.PRINT_REQUEST')) {
    if (result.code) {
      res.locals.errorCode = result.code;
      res.locals.errorMessage = result.message;
    }
    req.app = {
      ...req.app,
      answer: result,
    };
  }
  return res.status(status).json(result);
};

export const requestLogger = (app) => {
  app.use(expressWinston.logger({
    winstonInstance: logger,
    meta: true,
    dynamicMeta: (req, res) => ({
      res: {
        statusCode: res.statusCode,
        responseTime: res.responseTime,
        errorCode: res.locals.errorCode || undefined,
        errorMessage: res.locals.errorMessage || undefined,
      },
      req: {
        ip: req.ip,
        hostname: req.hostname,
        instanceName: config.get('INSTANCE_NAME'),
        method: req.method,
        originalUrl: req.originalUrl,
        protocol: req.protocol,
      },
    }),
  }));
  if (config.get('SERVICE.WINSTON.PRINT_REQUEST')) {
    app.use(expressWinston.logger({
      format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      ),
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(
              (info) => `${info.timestamp} ${info.level}: ${info.message}`,
            ),
          ),
        }),
      ],
      msg: (req, res) => `Request: ${req.method} ${req.url} \nRequest Body: \n${jsome.getColoredString(req.body || '/').substring(0, 3000)} \nResponse Body: \n${jsome.getColoredString(req.app.answer || '/').substring(0, 3000)} \nResponse: ${res.statusCode} in ${res.responseTime}ms`,
    }));
  }
};

export default logger;
