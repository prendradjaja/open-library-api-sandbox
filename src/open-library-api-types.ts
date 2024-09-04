import { z } from 'zod';

export const Book = z.object({
  title: z.string(),
  author_name: z.array(z.string()).nullish(),
  cover_edition_key: z.string().nullish(),
}).passthrough();
export type Book = z.infer<typeof Book>;

export const BookSearchResponse = z.object({
  num_found: z.number(),
  docs: z.array(Book),
}).passthrough();
export type BookSearchResponse = z.infer<typeof BookSearchResponse>;
