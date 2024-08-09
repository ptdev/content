import { z } from 'zod'
import type { ParsedContentInternalMeta } from '../types/content'
import { ContentFileExtension, ContentFileType } from '../types/content'
import { getEnumValues } from './zod'

export const pageSchema = z.object({
  stem: z.string(),
  path: z.string(),
  title: z.string(),
  description: z.string(),
  body: z.object({}),
  navigation: z.boolean().default(true),
  raw: z.string(),
})

export const contentSchema = z.object({
  _id: z.string(),
  _path: z.string(),
  _dir: z.string(),
  _draft: z.boolean().default(false),
  _partial: z.boolean().default(false),
  _locale: z.string(),
  title: z.string(),
  description: z.string(),
  navigation: z.boolean().default(true),
  body: z.object({
    type: z.string(),
    children: z.any(),
    toc: z.any(),
  }),
  _type: z.enum(getEnumValues(ContentFileType)),
  _source: z.string(),
  _file: z.string(),
  _stem: z.string(),
  _extension: z.enum(getEnumValues(ContentFileExtension)),
}) satisfies z.ZodSchema<ParsedContentInternalMeta>
