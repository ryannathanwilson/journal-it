import { z } from 'zod'
import { blockTypeValidator, blockValidator } from './validators'

export type Block = z.infer<typeof blockValidator>
export type BlockTypes = z.infer<typeof blockTypeValidator>
