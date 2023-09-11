'use client'
import Block from '@/components/block/Block'
import { useGlobalState } from '@/state'
import { useEffect } from 'react'

export default function HomePage() {
  const { state, dispatch } = useGlobalState()

  useEffect(() => {
    if (state.blocks.size === 0) {
      dispatch({ type: 'initialize' })
    }
  }, [state, dispatch])

  return (
    <>
      {Array.from(state.blocks.values()).map((block, index) => {
        const isLastBlock = index + 1 === state.blocks.size
        return <Block key={block.id} block={block} isLastBlock={isLastBlock} />
      })}
    </>
  )
}
