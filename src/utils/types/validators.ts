import { z } from 'zod'

export const blockValidator = z.object({
  content: z.string(),
  id: z.string(),
  type: z.enum(['bullet', 'check', 'checked', 'paragraph']),
  indent: z.number().gte(0).lte(8),
})
