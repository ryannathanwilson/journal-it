import { z } from 'zod'

export const createBlockValidator = z.object({
  content: z.string(),
  type: z.enum(['bullet', 'check', 'checked', 'paragraph']),
  indent: z.number().gte(0).lte(8),
})
export const blockValidator = createBlockValidator.extend({
  id: z.string(),
})
