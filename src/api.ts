import { z } from "zod";

const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  price: z.number(),
  description: z.string(),
  category: z.string(),
  image: z.string(),
  rating: z.object({
    rate: z.number(),
    count: z.number(),
  }),
});

//Response noch nötig, da oben nur ein enzelnes Produkt definiert ist-->die Response ist aber ein Array aus allen Produkt-Objekten
const productResponseSchema = productSchema.array();

export type Product = z.infer<typeof productSchema>;

//Daten fetchen
//Promise
export async function getShopProducts() {
  try {
    const productResponse = await fetch("https://fakestoreapi.com/products");
    const productData = await productResponse.json();

    const validatedProductData = productResponseSchema.parse(productData);
    return validatedProductData;
  } catch (error) {
    console.log(error);
  }
}
