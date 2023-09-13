'use client'
import { Block } from '@/types/types'
import { blockValidator } from '@/types/validators'
import { PropsWithChildren, createContext, useContext, useReducer } from 'react'
import { z } from 'zod'

type State = {
  blocks: Map<string, Block>
  lastBlock?: HTMLDivElement | undefined
}
type Action =
  | { type: 'initialize' }
  | { type: 'upsert'; payload: Block }
  | { type: 'delete'; payload: { id: string } }
  | { type: 'reference-last-block'; payload: { blockRef: HTMLDivElement } }
  | { type: 'focus-last-block' }

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

const writeToStorage = (state: State): State => {
  if (typeof window === 'undefined') throw new Error()
  window.localStorage.setItem(
    'home-blocks',
    JSON.stringify(Array.from(state.blocks.entries()))
  )
  return state
}

const readFromStorage = (): State => {
  if (typeof window === 'undefined') throw new Error()
  const item = window.localStorage.getItem('home-blocks')
  const fromStorage = typeof item === 'string' ? JSON.parse(item) : null
  const validatedState = validBlock.safeParse(fromStorage)
  return {
    blocks: validatedState.success ? new Map(validatedState.data) : new Map(),
  }
}

const reducer = (previousState: State, action: Action): State => {
  const updatedState = {
    blocks: new Map(previousState.blocks),
    lastBlock: previousState.lastBlock,
  }
  switch (action.type) {
    case 'initialize':
      return readFromStorage()
    case 'upsert':
      updatedState.blocks.set(action.payload.id, action.payload)
      writeToStorage(updatedState)
      return updatedState
    case 'delete':
      updatedState.blocks.delete(action.payload.id)
      writeToStorage(updatedState)
      return updatedState
    case 'reference-last-block':
      updatedState.lastBlock = action.payload.blockRef
      return updatedState
    case 'focus-last-block':
      if (updatedState.lastBlock) {
        updatedState.lastBlock.focus()
      }
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

  return (
    <GlobalState.Provider value={{ state, dispatch }}>
      {children}
    </GlobalState.Provider>
  )
}

export { GlobalStateProvider, useGlobalState }
