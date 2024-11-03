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
    const title = $("#productTitle").text().trim();
    console.log({ title });
  } catch (error: any) {
    throw new Error(`Failed to scrape product: ${error.message}`);
  }
}
