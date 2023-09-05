'use client'
import Block from '@/components/block/Block'
import { useGlobalState } from '@/state'
import { useEffect } from 'react'

export default function HomePage() {
  const { state, dispatch } = useGlobalState()

  useEffect(() => {
    console.log('HOME USE_EFFECT')
    if (state.size === 0) {
      console.log('INITIALIZE USE_EFFECT')
      dispatch({ type: 'initialize' })
    }
  }, [state, dispatch])

  console.log('STATE:', state)

  return (
    <>
      {Array.from(state.values()).map((block) => (
        <Block key={block.id} block={block} />
      ))}
    </>
  )
}
