# E-commerce Price Scraper to Excel (Cheerio + Node.js)

This is an open-source web scraper built with Node.js and Cheerio, specifically designed to scrape e-commerce pricing data from websites and export it to Excel files. Ideal for developers with basic programming and web scraping knowledge, this project allows you to automate price monitoring. You can schedule the scraper with cron jobs, and it's customizable to support a variety of e-commerce sites with [Built-In *Schema.org* Scraper].

## Features

- Scrapes data from websites using Cheerio.
- Outputs the scraped data to Excel files.
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

6. Run `npm run start`. Enjoy your scraper!

## Project Structure

```bash
/website-scraper-to-excel
├── /public
│   ├── /input
│   │   └── products.json    # Input data for the scraper
│   └── /export
│       └── test-01.json     # Output data after scraping
├── /scrapers
│   └── __schema-org__.mjs    # Example scraper for scraping data
├── scraper.config.mjs        # Configuration file for scraper
├── index.mjs                 # Main entry point to start the scraping process
└── package.json              # Project dependencies and scripts
```

## Configuration: `scraper.config.mjs`

```javascript
export const options = {
  cron: "0 0 * * *", // Run the scraper once a day at midnight
  executeOnStart: true, // Execute the scraper immediately when the app starts // @default = false
  products: [
    {
      name: "Apple", // Name for Excel file
      fileName: "products-01", // /public/input/products-01.json
    },
  ],
};
```
