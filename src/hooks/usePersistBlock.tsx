'use client'

import { persistBlockData } from "@/requests";
import { Block, useGlobalState } from "@/state"
import sleep from "@/utils/sleep";
import { useState } from "react"

export default function usePersistBlock({ block, text }: { block: Block, text: string }) {
  const newBlock = block.content === ''
  const { dispatch } = useGlobalState();
  const [loading, setLoading] = useState(false);

  const saveBlock = async () => {
    setLoading(true);
    const updatedBlock = await persistBlockData({ ...block, content: text });
    dispatch({
      type: newBlock ? 'create' : 'update',
      payload: updatedBlock,
    })
    setLoading(false);
  }

  const deleteBlock = async () => {
    setLoading(true);
    await sleep(150)
    dispatch({
      type: 'delete',
      payload: { id: block.id }
    })
    setLoading(false);
  }

  return {
    saveBlock: async () => saveBlock(),
    deleteBlock: async () => deleteBlock(),
    loading,
  }

}
