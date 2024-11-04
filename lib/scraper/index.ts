import axios from "axios";
import * as cheerio from "cheerio";

export async function scrapeAmazonProduct(url: string) {
  if (!url) return;

  // curl -i --proxy brd.superproxy.io:22225 --proxy-user
  // brd-customer-hl_ffc6b9f3-zone-priceanalyst:uy88rifnm4pa -k "https://
  // geo.brdtest.com/welcome.txt"

  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);
  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;
  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: "brd.superproxy.io",
    port,
    rejectUnauthorized: false,
  };
  try {
    const response = await axios.get(url, options);
    const $ = cheerio.load(response.data);
    const title = $("#productTitle").first().text().trim();
    const currentPrice = $("span.a-price-whole")
      .first()
      .text()
      .trim()
      .replace(",", "");
    const priceAsnumber = $(".a-price.a-text-price span.a-offscreen")
      .first()
      .text()
      .trim();
    const originalPrice = priceAsnumber
      .replace(/[^\d,\.]/g, "")
      .replace(",", ".");

    const outOfStock =
      $("#availability span").text().trim().toLowerCase() === "em estoque";

    const productImages =
      $("#landingImage").attr("data-a-dynamic-image") || "{}";
    const imagesUrl = Object.keys(JSON.parse(productImages));

    const priceSymbol = $(".a-price-symbol").first().text().trim();

    const discountRate = $("span.savingsPercentage")
      .text()
      .trim()
      .replace(/[-%]/g, "");

    const data = {
      url,
      priceSymbol,
      imagesUrl,
      title,
      currentPrice: Number(currentPrice),
      originalPrice: Number(originalPrice),
      priceHistory: [],
      discountRate: Number(discountRate),
      category: "category",
      reviewsCount: 100,
      stars: 4.5,
      isOutOfStock: outOfStock,
    };

    console.log(data);
  } catch (error: any) {
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}
