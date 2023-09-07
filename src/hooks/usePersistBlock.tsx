'use client'

import { useGlobalState } from '@/state'
import { trpc } from '@/utils/trpc/trpc'
import { Block } from '@/utils/types'

export default function usePersistBlock({
  block,
  text,
}: {
  block: Block
  text: string
}) {
  const newBlock = block.content === ''
  const { dispatch } = useGlobalState()
  const createBlock = trpc.createBlock.useMutation({
    onSuccess: (data) =>
      dispatch({
        type: 'create',
        payload: data,
      }),
  })
  const updateBlock = trpc.updateBlock.useMutation({
    onSuccess: (data) =>
      dispatch({
        type: 'update',
        payload: data,
      }),
  })

  const saveBlock = newBlock
    ? async () => createBlock.mutateAsync({ ...block, content: text })
    : async () => updateBlock.mutateAsync({ ...block, content: text })

  const deleteBlock = trpc.deleteBlock.useMutation({
    onSuccess: (data) =>
      dispatch({
        type: 'delete',
        payload: data,
      }),
  })

  return {
    saveBlock: saveBlock,
    deleteBlock: async () => deleteBlock.mutateAsync({ id: block.id }),
    loading:
      deleteBlock.isLoading || createBlock.isLoading || updateBlock.isLoading,
  }
}
