# **Discord Bot Proof Of Humanity**

## **Config**
Environment variables
```
DAL_FS_DB_PATH: Path to database JSON containing registered users
DAL_FS_DB_NAME: Filename Database JSON containing registered users
DAL_ETH_PROVIDER: URL for RPC ETH

SERVICE_DISCORD_TOKEN: Discord Bot Token
SERVICE_DISCORD_GUILD: Guild ID
SERVICE_DISCORD_REGISTERED_ROLE: Role ID to set when user is registered
REACT_APP_BACKEND_URL: Backend URL
```

## **Installation**
`npm install`
(+in production`npm install -g pm2`)
## **Development**
`npm run start:dev`
## **Production**
```
npm run build
npm run start:prod
```