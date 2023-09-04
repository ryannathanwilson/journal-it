'use client'
import { Block } from '@/utils/types'
import { PropsWithChildren, createContext, useContext, useReducer } from 'react'
import { v4 } from 'uuid'
import { z } from 'zod'

type State = Map<string, Block>
type Action =
  | { type: 'create'; payload: Block }
  | { type: 'update'; payload: Block }
  | { type: 'delete'; payload: { id: string } }
  | { type: 'add-empty' }
const initialState: State = new Map()

const GlobalState = createContext<{
  state: State
  dispatch: React.Dispatch<Action>
}>({
  state: initialState,
  dispatch: () => null,
})
const useGlobalState = () => useContext(GlobalState)

const validBlock = z.array(
  z.tuple([z.string(), z.object({ content: z.string(), id: z.string() })])
)
const syncWithStorage = (state: State) => {
  if (typeof window === 'undefined') throw new Error('Cant sync on server')
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
    case 'create':
      console.log('CREATE')
      updatedState.set(action.payload.id, action.payload)
      const id = v4()
      updatedState.set(id, { content: '', id })
      syncWithStorage(updatedState)
      return updatedState
    case 'update':
      console.log('UPDATE')
      updatedState.set(action.payload.id, action.payload)
      syncWithStorage(updatedState)
      return updatedState
    case 'delete':
      console.log('DELETE')
      updatedState.delete(action.payload.id)
      syncWithStorage(updatedState)
      return updatedState
    case 'add-empty':
      console.log('ADD EMPTY')
      const emptyId = v4()
      updatedState.set(emptyId, { content: '', id: emptyId })
      syncWithStorage(updatedState)
      return updatedState
  }
}
const initializer = (initialArgs: State) => {
  return syncWithStorage(initialArgs)
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
