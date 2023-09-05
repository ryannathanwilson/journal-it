import sleep from './utils/sleep'
import { v4 as uuidv4 } from 'uuid'
import { Block } from './utils/types'

export async function persistBlockData({
  content,
  id,
}: {
  content: string
  id?: string
}): Promise<Block> {
  await sleep(300)
  return {
    content: content,
    id: id || uuidv4(),
  }
}
