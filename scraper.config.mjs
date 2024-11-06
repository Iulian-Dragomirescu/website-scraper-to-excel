export const options = {
  cron: "0 0 * * *", // Once a day at midnight
  executeOnStart: false,
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
