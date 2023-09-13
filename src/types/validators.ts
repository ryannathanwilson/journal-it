import { z } from 'zod'

export const blockTypeValidator = z.enum([
  'bullet',
  'check',
  'checked',
  'paragraph',
])

export const createBlockValidator = z.object({
  content: z.string(),
  type: blockTypeValidator,
  indent: z.number().gte(0).lte(8),
})

export const blockValidator = createBlockValidator.extend({
  id: z.string(),
})

export type BlockType = z.infer<typeof blockValidator>
export type BlockTypes = z.infer<typeof blockTypeValidator>
