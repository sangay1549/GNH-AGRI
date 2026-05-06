import { z } from "zod";

export const MarketPriceSchema = z.object({
  // Ensure these names match your SQL columns EXACTLY
  crop_name: z.string(),
  price_nu: z.number(),
  unit: z.string().optional(),
  location: z.string().optional(),
  recorded_at: z.string() // Supabase returns timestamptz as a string
});