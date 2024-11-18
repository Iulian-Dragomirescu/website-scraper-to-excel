export const options = {
  cron: "0 0 * * *", // Once a day at midnight
  executeOnStart: false,

  email: {
    enabled: false,
    from: 'DevCodes"<noreply@devcodes.ro>',
    to: "user@example.com",
    nodemailer: {
      host: "smtp.example.com",
      port: 587,
      tls: {
        rejectUnauthorized: true,
        minVersion: "TLSv1.2",
      },
    },
  },

  products: [
    {
      name: "TEST",
      fileName: "test-01", // public/*.json
    },
    {
      name: "Apple",
      fileName: "products-01", // public/*.json
    },
  ],
};
