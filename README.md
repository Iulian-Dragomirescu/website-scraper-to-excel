# E-commerce Price Scraper to Excel (Cheerio + Node.js)

This is an open-source web scraper built with Node.js and Cheerio, specifically designed to scrape e-commerce pricing data from websites and export it to Excel files. Ideal for developers with basic programming and web scraping knowledge, this project allows you to automate price monitoring. You can schedule the scraper with cron jobs, and it's customizable to support a variety of e-commerce sites with [Built-In *Schema.org* Scraper].

## Features

- Scrape prices from websites using Cheerio.
- Exports the scraped data to Excel files and delivers it via email for seamless access and analysis.
- Configurable with a cron schedule (e.g., run once a day).
- Modular scrapers: Write a new scraper for any website.
- Simple configuration file to specify what to scrape and where to store the data.
- [Built-In *Schema.org* Scraper] A modular scraper designed to work with multiple websites by default.

## Installation

### Prerequisites

- Node.js (version 14.x or higher)
- npm (Node package manager)

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/Iulian-Dragomirescu/website-scraper-to-excel
   cd website-scraper-to-excel
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Add your custom scrapers in the `scrapers/*.mjs` directory.

4. Add your custom products in the `public/input/*.json` directory.

5. Edit the `scraper.config.mjs` with file name from each `public/input/*.json` in `products[]`

6. Run scraper. Enjoy your scraper!
   ```bash
   npm run start
   ```

### Alternative ways to Start the Scraper

1. With `PM2 Process Management:`

   ```bash
   npm i -g pm2

   pm2 start ecosystem.config.cjs
   ```

2. With `Docker:`

   **2.1** Update the Volume Path

   In the `docker-compose.yml` file, update the volumes section to specify the local path where the Excel files will be saved. Replace `/your_path` with the desired directory on your machine:

   **2.2**. Build and Run the Docker Container

   Execute the following command to build and start the Docker container:

   ```bash
   docker compose -f "docker-compose.yml" up -d --build
   ```

## Project Structure

```bash
/website-scraper-to-excel
├── /public
│   ├── /input
│   │   └── products-01.json    # Input data for the scraper
│   └── /export
│       └── Apple-06.11.2024-47mrCu.xlsx     # Output data after scraping
├── /scrapers
│   └── __schema-org.mjs    # Example scraper for scraping data
├── scraper.config.mjs        # Configuration file for scraper
├── index.mjs                 # Main entry point to start the scraping process
└── package.json              # Project dependencies and scripts
```

## Configuration: `scraper.config.mjs`

```javascript
export const options = {
  cron: "0 0 * * *", // Run the scraper once a day at midnight
  executeOnStart: true, // Execute the scraper immediately when the app starts // @default = false

  email: {
    enabled: true,
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
      name: "Apple", // Name for Excel file
      fileName: "products-01", // /public/input/products-01.json
    },
  ],
};
```

## Make Your Custom Scraper

1. **Create a New Scraper File**

   - In the `/scrapers` directory, create a new file with a `.mjs` extension.

2. **Implement Your Custom Scraper Logic**

   - Add your custom integration logic to the following template:

   ```javascript
   const scraper = {
     id: "unique-scraper-id", // Replace with a unique identifier
     fn: ($) => {
       // Your custom scraping logic here
       // ...

       const price = offer.price || 0;

       return {
         price,
       };
     },
   };

   export default scraper;
   ```

   @error: You can use `throw new Error()` inside the `fn()` when scraper don't find anythning and will receive `price: 0`

3. Add `id` in each product you want to use this custom scraper. (`/public/input/products-01.json`)

   ```json
   [
     {
       "scraperId": "unique-scraper-id",
       "url": "https://www.exemple.com/product/MU9D3RC"
     }
   ]
   ```

## Enable Email Notifications

1.  Add `email` object in `scraper.config.mjs` with your email configuration.

    ```javascript
      email: {
        enabled: true,
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
    ```

2.  Rename `.env.exemple` to `.env` and add your USER and PASS. (You can use Amazon SES).

3.  Run `npm run start` to start the application and receive email notifications when the scraping process is completed.

## Contributing

Feel free to fork the repository, submit pull requests, and contribute to the project. If you find any bugs or have ideas for improvements, please open an issue on the GitHub page.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
