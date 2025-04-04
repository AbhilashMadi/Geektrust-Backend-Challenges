import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().positive()
})

const parsedEvn = envSchema.safeParse(process.env);

if (!parsedEvn.success) {
  console.error(parsedEvn.error);
  process.exit(1);
}

export const env = parsedEvn.data;
export type Env = z.infer<typeof envSchema>;
