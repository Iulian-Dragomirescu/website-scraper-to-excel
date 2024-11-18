import "dotenv/config";
import { scheduleJob } from "node-schedule";
import { options } from "./scraper.config.mjs";
import { toExcel } from "./utils/excel.mjs";
import { logger } from "./utils/logger.mjs";
import { sendMail } from "./utils/nodemailer.mjs";
import { useProduct } from "./utils/useProduct.mjs";
import { useScraper } from "./utils/useScraper.mjs";

const init = async () => {
  try {
    const { cron, products, executeOnStart } = options;

    const job = scheduleJob(cron, async () => {
      const result = [];
      const excelResults = [];

      // Process scrapers
      for (let x = 0; x < products.length; x++) {
        const productsListResult = [];
        const element = products[x];
        logger.start(
          `==> Scraping for products: "${element.name}" is started!`
        );

        const product = await useProduct({ fileName: element.fileName });

        for (let y = 0; y < product.length; y++) {
          const { scraperId, url, ...rest } = product[y];

          const scraperResult = await useScraper({
            id: scraperId,
            url: url,
          });

          productsListResult.push({
            price: scraperResult.price,
            ...rest,
          });

          logger.info(`${y + 1}/${product.length} | ${element.name}`);
        }

        result.push({
          name: element.name,
          items: productsListResult,
        });
      }

      // Process Excel
      for (let x = 0; x < result.length; x++) {
        const { name, items } = result[x];

        const res = await toExcel({
          data: items,
          options: {
            fileName: name,
          },
        });

        excelResults.push(res);
      }

      // Send file to email
      await sendMail({
        subject: "Scraper Report",
        attachments: excelResults.map((e) => {
          return {
            filename: e.fileName,
            content: e.fileBuffer,
          };
        }),
      });
    });

    logger.info(
      `Next scraper run scheduled for: ${job.nextInvocation().toISOString()}`
    );

    executeOnStart && job.invoke();
  } catch (error) {
    logger.error(error);
  }
};

init();
