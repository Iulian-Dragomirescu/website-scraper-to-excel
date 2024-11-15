const scraper = {
  id: "__schema-org__",
  fn: ($) => {
    const data = [];
    let product;

    // Collect and parse all JSON-LD data from the page
    $("script[type='application/ld+json']").each(function () {
      const scriptContent = $(this).text();
      try {
        data.push(JSON.parse(scriptContent));
      } catch (error) {
        throw new Error("Error parsing JSON-LD data:", error);
      }
    });

    // Search for the product in the parsed data
    for (let i = 0; i < data.length; i++) {
      const element = data[i];

      if (element["@graph"]) {
        product = element["@graph"].find((e) => e["@type"] === "Product");
      }

      if (element["@type"] === "Product" && !product) {
        product = element;
      }

      if (product) break;
    }

    // If no product is found, throw an error
    if (!product) {
      throw new Error("Product data not found.");
    }

    const offers = product.offers;

    // If offers is an array, use the first offer
    const offer = Array.isArray(offers) ? offers[0] : offers;

    if (!offer) {
      throw new Error("No offer found.");
    }

    // Check availability and price
    const isInStock = offer?.availability?.includes("InStock");
    if (!isInStock) {
      return {
        price: "Out of Stock",
      };
    }

    const price = offer.price || 0;

    return {
      price,
    };
  },
};

export default scraper;
