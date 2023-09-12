'use client'
import Block from '@/components/block/Block'
import Header from '@/components/header/Header'
import LoadingMask from '@/components/loadingMask/LoadingMask'
import { useGlobalState } from '@/state'
import { useEffect, useState } from 'react'

export default function HomePage() {
  const { state, dispatch } = useGlobalState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (state.blocks.size === 0) {
      dispatch({ type: 'initialize' })
      setTimeout(() => setLoading(false), 500)
    }
  }, [state, dispatch])

  return (
    <>
      <Header loading={loading} />
      <LoadingMask loading={loading} />
      {Array.from(state.blocks.values()).map((block, index) => {
        return <Block key={block.id} block={block} />
      })}
      <Block isLastBlock />
    </>
  )
}
