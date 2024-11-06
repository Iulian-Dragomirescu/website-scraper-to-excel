import * as cheerio from "cheerio";
import fs from "node:fs";
import path from "node:path";
import { dirname } from "./__dirname.mjs";
import axiosCall from "./axios.mjs";
import { logger } from "./logger.mjs";

const scraperPath = path.join(dirname, "../scrapers");
const scraperFiles = fs.readdirSync(scraperPath);

const scrapers = [];

// Register all scrapers
await Promise.all(
  scraperFiles.map(async (file) => {
    try {
      const module = await import("file://" + scraperPath + "/" + file);

      if (file.endsWith(".mjs")) {
        scrapers.push(module.default);
        logger.success(`Successfully registered scraper: "${file}"`);
      } else {
        logger.warn(`Skipping file: "${file}" because it is not an .mjs file.`);
      }
    } catch (error) {
      logger.error(`Error loading scraper file: "${file}". | ${error} |`);
    }
  })
);

export const defaultScraperResponse = {
  price: 0,
};

export const useScraper = async ({ id, url }) => {
  try {
    if (!id) {
      throw new Error(`For this URL: ${url} scraperId is not defined.`);
    }

    if (!url) {
      logger.warn(`URL is missing for scraper: "${id}". Skipping!`);

      return defaultScraperResponse;
    }

    const scraper = scrapers.find((e) => e.id === id);

    if (!scraper) {
      throw new Error(`Scraper with ID "${id}" not found.`);
    }

    const data = await axiosCall(url);

    if (!data) {
      throw new Error(
        `Failed to retrieve data from URL: "${url}". Scraper ID: "${id}"`
      );
    }

    const $ = cheerio.load(data);

    try {
      return await scraper.fn($);
    } catch (error) {
      logger.error(`Scraper error: "${id}". `, error);
      return defaultScraperResponse;
    }
  } catch (error) {
    logger.error(error);

    return defaultScraperResponse;
  }
};
