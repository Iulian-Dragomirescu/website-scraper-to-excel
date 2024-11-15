module.exports = {
  apps: [
    {
      name: "Web Scraper",
      script: "index.mjs",
      autorestart: true,
      time: true,
      log_date_format: "YYYY-MM-DD HH:mm Z",
    },
  ],
};
