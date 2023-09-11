'use client'
import { Block } from '@/utils/types'
import { blockValidator } from '@/utils/types/validators'
import {
  PropsWithChildren,
  createContext,
  useContext,
  useEffect,
  useReducer,
} from 'react'
import { v4 } from 'uuid'
import { z } from 'zod'

type State = {
  blocks: Map<string, Block>
  lastBlock?: HTMLDivElement | undefined
}
type Action =
  | { type: 'initialize' }
  | { type: 'create'; payload: Block }
  | { type: 'update'; payload: Block }
  | { type: 'delete'; payload: { id: string } }
  | { type: 'reference-last-block'; payload: { blockRef: HTMLDivElement } }

const initialState: State = {
  blocks: new Map(),
}

const GlobalState = createContext<{
  state: State
  dispatch: React.Dispatch<Action>
}>({
  state: initialState,
  dispatch: () => null,
})
const useGlobalState = () => useContext(GlobalState)

const validBlock = z.array(z.tuple([z.string(), blockValidator]))

const syncWithStorage = (state: State): State => {
  if (typeof window === 'undefined') throw new Error()
  if (state.blocks.size) {
    window.localStorage.setItem(
      'home-blocks',
      JSON.stringify(Array.from(state.blocks.entries()))
    )
    return state
  } else {
    const item = window.localStorage.getItem('home-blocks')
    const fromStorage = typeof item === 'string' ? JSON.parse(item) : null
    const validatedState = validBlock.safeParse(fromStorage)
    return {
      blocks: validatedState.success ? new Map(validatedState.data) : new Map(),
    }
  }
}

const reducer = (previousState: State, action: Action): State => {
  const updatedState = {
    blocks: new Map(previousState.blocks),
    lastBlock: previousState.lastBlock,
  }
  switch (action.type) {
    case 'initialize':
      let syncedState = syncWithStorage(updatedState)
      if (syncedState.blocks.size === 0) {
        const newId = v4()
        syncedState.blocks.set(newId, {
          content: '',
          id: newId,
          indent: 0,
          type: 'paragraph',
        })
        syncedState = syncWithStorage(syncedState)
      }
      return syncedState
    case 'create':
      updatedState.blocks.set(action.payload.id, action.payload)
      const id = v4()
      updatedState.blocks.set(id, {
        content: '',
        id,
        type: 'paragraph',
        indent: 0,
      })
      syncWithStorage(updatedState)
      // if (updatedState.lastBlock) {
      //   updatedState.lastBlock.focus()
      // }
      return updatedState
    case 'update':
      updatedState.blocks.set(action.payload.id, action.payload)
      syncWithStorage(updatedState)
      if (updatedState.lastBlock) {
        updatedState.lastBlock.focus()
      }
      return updatedState
    case 'delete':
      updatedState.blocks.delete(action.payload.id)
      syncWithStorage(updatedState)
      return updatedState
    case 'reference-last-block':
      updatedState.lastBlock = action.payload.blockRef
      return updatedState
  }
}
const initializer = (initialArgs: State) => {
  return initialArgs
}

function GlobalStateProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(
    reducer,
    { blocks: new Map() },
    initializer
  )

  useEffect(() => {
    if (state.lastBlock) {
      state.lastBlock.focus()
    }
  }, [state.lastBlock])
  return (
    <GlobalState.Provider value={{ state, dispatch }}>
      {children}
    </GlobalState.Provider>
  )
}

export { GlobalStateProvider, useGlobalState }
