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
  block?: Block
  text: string
  indent: number
  type: BlockTypes
}) {
  const newBlock = !block
  const { dispatch } = useGlobalState()
  const createBlock = trpc.createBlock.useMutation({
    onSuccess: (data) => {
      console.log('CREATE')
      return dispatch({
        type: 'upsert',
        payload: data,
      })
    },
  })
  const updateBlock = trpc.updateBlock.useMutation({
    onSuccess: (data) => {
      console.log('CREATE')
      return dispatch({
        type: 'upsert',
        payload: data,
      })
    },
  })

  const saveBlock = newBlock
    ? async () => createBlock.mutateAsync({ content: text, type, indent })
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
    deleteBlock: async () => {
      if (block?.id) {
        deleteBlock.mutateAsync({ id: block.id })
      }
    },
    loading:
      deleteBlock.isLoading || createBlock.isLoading || updateBlock.isLoading,
  }
}
