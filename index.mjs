import { scheduleJob } from "node-schedule";
import { options } from "./scraper.config.mjs";
import { toExcel } from "./utils/excel.mjs";
import { logger } from "./utils/logger.mjs";
import { useProduct } from "./utils/useProduct.mjs";
import { useScraper } from "./utils/useScraper.mjs";

const init = async () => {
  try {
    const { cron, products, executeOnStart } = options;

    const job = scheduleJob(cron, async () => {
      const result = [];

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

      for (let x = 0; x < result.length; x++) {
        const { name, items } = result[x];

        await toExcel({
          data: items,
          options: {
            fileName: name,
          },
        });
      }
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
