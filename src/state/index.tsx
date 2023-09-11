'use client'
import { Block } from '@/utils/types'
import { blockValidator } from '@/utils/types/validators'
import { PropsWithChildren, createContext, useContext, useReducer } from 'react'
import { v4 } from 'uuid'
import { z } from 'zod'

type State = Map<string, Block>
type Action =
  | { type: 'initialize' }
  | { type: 'create'; payload: Block }
  | { type: 'update'; payload: Block }
  | { type: 'delete'; payload: { id: string } }
const initialState: State = new Map()

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
  if (state.size) {
    window.localStorage.setItem(
      'home-blocks',
      JSON.stringify(Array.from(state.entries()))
    )
    return state
  } else {
    const item = window.localStorage.getItem('home-blocks')
    const fromStorage = typeof item === 'string' ? JSON.parse(item) : null
    const validatedState = validBlock.safeParse(fromStorage)
    return validatedState.success ? new Map(validatedState.data) : new Map()
  }
}

const reducer = (previousState: State, action: Action): State => {
  const updatedState = new Map(previousState)
  switch (action.type) {
    case 'initialize':
      let syncedState = syncWithStorage(updatedState)
      if (syncedState.size === 0) {
        const newId = v4()
        syncedState.set(newId, {
          content: '',
          id: newId,
          indent: 0,
          type: 'paragraph',
        })
        syncedState = syncWithStorage(syncedState)
      }
      return syncedState
    case 'create':
      updatedState.set(action.payload.id, action.payload)
      const id = v4()
      updatedState.set(id, {
        content: '',
        id,
        type: 'paragraph',
        indent: 0,
      })
      syncWithStorage(updatedState)
      return updatedState
    case 'update':
      updatedState.set(action.payload.id, action.payload)
      syncWithStorage(updatedState)
      return updatedState
    case 'delete':
      updatedState.delete(action.payload.id)
      syncWithStorage(updatedState)
      return updatedState
  }
}
const initializer = (initialArgs: State) => {
  return initialArgs
}

function GlobalStateProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, new Map(), initializer)
  return (
    <GlobalState.Provider value={{ state, dispatch }}>
      {children}
    </GlobalState.Provider>
  )
}

export { GlobalStateProvider, useGlobalState }
