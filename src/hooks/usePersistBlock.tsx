'use client'

import { useGlobalState } from '@/state'
import { trpc } from '@/utils/trpc/trpc'
import { Block, BlockTypes } from '@/utils/types'

export default function usePersistBlock({
  block,
  text,
  indent,
  type,
}: {
  block: Block
  text: string
  indent: number
  type: BlockTypes
}) {
  const newBlock = block.content === ''
  const { dispatch } = useGlobalState()
  const createBlock = trpc.createBlock.useMutation({
    onSuccess: (data) => {
      console.log('CREATE')
      return dispatch({
        type: 'create',
        payload: data,
      })
    },
  })
  const updateBlock = trpc.updateBlock.useMutation({
    onSuccess: (data) =>
      dispatch({
        type: 'update',
        payload: data,
      }),
  })

  const saveBlock = newBlock
    ? async () =>
        createBlock.mutateAsync({ ...block, content: text, type, indent })
    : async () =>
        updateBlock.mutateAsync({ ...block, content: text, type, indent })

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
