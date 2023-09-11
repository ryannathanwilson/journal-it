export type BlockTypes = 'bullet' | 'check' | 'checked' | 'paragraph'
export type Block = {
  id: string
  content: string
  type: BlockTypes
  indent: number
}
