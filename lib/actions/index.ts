"use server";

import { revalidatePath } from "next/cache";
import Product from "../models/product.model";
import { connectToDB } from "../mongoose";
import { scrapeAmazonProduct } from "../scraper";
import { getAveragePrice, getHighestPrice, getLowestPrice } from "../utils";

export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;

  try {
    connectToDB();

    const scrapedProduct = await scrapeAmazonProduct(productUrl);

    if (!scrapedProduct) return;

    let updatedPriceHistory = [{ price: scrapedProduct.currentPrice }];

    const existingProduct = await Product.findOne({ url: scrapedProduct.url });

    if (existingProduct) {
      updatedPriceHistory = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice },
      ];
    }

    const product = {
      ...scrapedProduct,
      priceHistory: updatedPriceHistory,
      lowestPrice: getLowestPrice(updatedPriceHistory),
      highestPrice: getHighestPrice(updatedPriceHistory),
      averagePrice: getAveragePrice(updatedPriceHistory),
    };

    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { upsert: true, new: true }
    );

    revalidatePath(`/products/${newProduct._id}`);
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`);
  }
}

export async function getProductById(productId: string) {
  try {
    connectToDB();

    const product = await Product.findOne({ _id: productId });
    if (!product) return null;
    return product;
  } catch (error) {
    console.log(error);
  }
}

export async function getAllProducts() {
  try {
    connectToDB();

    const allProducts = await Product.find();
    return allProducts;
  } catch (error) {
    console.log(error);
  }
}
