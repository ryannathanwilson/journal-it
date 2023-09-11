'use client'
import Block from '@/components/block/Block'
import { useGlobalState } from '@/state'
import { useEffect } from 'react'

export default function HomePage() {
  const { state, dispatch } = useGlobalState()

  useEffect(() => {
    if (state.size === 0) {
      dispatch({ type: 'initialize' })
    }
  }, [state, dispatch])

  return (
    <>
      {Array.from(state.values()).map((block) => (
        <Block key={block.id} block={block} />
      ))}
    </>
  )
}
