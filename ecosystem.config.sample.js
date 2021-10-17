module.exports = {
  /**
   * Application configuration section
   * http://pm2.keymetrics.io/docs/usage/application-declaration/
   */
  apps : [

    // First application
    {
      name      : 'My Banano Ninja',
      script    : 'bin/www',
      "log_date_format" : "YYYY-MM-DD HH:mm:ss",
      env: {
        NODE_ENV: 'production',
        DOMAIN: 'https://mybanano.ninja',
        NODE_RPC: 'http://[::1]:7072',
        NODE_INTERNAL: '12000',
        MONGO_URL: 'mongodb://localhost:27017/mybananoninja',
        MONGO_SESSIONURL: 'mongodb://localhost:27017/mybananoninja-session',
        SESSION_SECRET: 'ohyeahbananoisgreat',
        SENTRY_URL: '',
        FACEBOOK_CLIENTID: '',
        FACEBOOK_CLIENTSECRET: '',
        TWITTER_CONSUMERKEY: '',
        TWITTER_CONSUMERSECRET: '',
        GOOGLE_CLIENTID: '',
        GOOGLE_CLIENTSECRET: '',
        GITHUB_CLIENTID: '',
        GITHUB_CLIENTSECRET: '',
        REDDIT_CLIENTID: '',
        REDDIT_CLIENTSECRET: '',
        DISCORD_CLIENTID: '',
        DISCORD_CLIENTSECRET: '',
        EMAIL_HOST: 'smtp.myhost.com',
        EMAIL_USER: 'alert@mybanano.ninja',
        EMAIL_PASS: 'mypassword',
        DPOW_USER: 'user',
        DPOW_KEY: 'longhash',
        DRPC_REPSONLINE: '[]',
        VERIFICATION_AMOUNT: '1',
        MATOMO_URL: "https://piwik.org/piwik.php",
        MATOMO_TOKEN: "yourtoken",
        MATOMO_SITE: "1",
        PORT: 4000
      }
    },
    {
      name      : 'My Banano Ninja - CRON',
      script    : 'cron',
      "log_date_format" : "YYYY-MM-DD HH:mm:ss",
      env: {
        NODE_ENV: 'production',
        DOMAIN: 'https://mybanano.ninja',
        NODE_RPC: 'http://[::1]:7072',
        NODE_WS: 'ws://[::1]:7074',
        MONGO_URL: 'mongodb://localhost:27017/mybananoninja',
        SENTRY_URL: '',
        EMAIL_HOST: 'smtp.myhost.com',
        EMAIL_USER: 'alert@mybanano.ninja',
        EMAIL_PASS: 'mypassword',
        DISCORD_HOOK: 'https://webhook.url',
        DRPC_REPSONLINE: '[]'
      }
    }
  ]
};
