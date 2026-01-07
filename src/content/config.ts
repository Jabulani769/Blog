// src/content/config.ts
import { z, defineCollection } from 'astro:content';

const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    pubDate: z.coerce.date(), 
    image: z.string().optional(), 
    draft: z.boolean().optional().default(false),
  }),
});

export const collections = {
  blog: blogCollection,
};