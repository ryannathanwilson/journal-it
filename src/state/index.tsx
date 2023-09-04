'use client'
import { PropsWithChildren, createContext, useContext, useReducer } from "react";
import { v4 } from "uuid";

export type Block = {
  id: string;
  content: string;
}

type State = Map<string, Block>;
type Action =
  | { type: 'create', payload: Block }
  | { type: 'update', payload: Block }
  | { type: 'delete', payload: { id: string } }
  | { type: 'add-empty' }
const initialState: State = new Map();

const GlobalState = createContext<{
  state: State,
  dispatch: React.Dispatch<Action>
}>({
  state: initialState,
  dispatch: () => null,
});
const useGlobalState = () => useContext(GlobalState);


const reducer = (previousState: State, action: Action): State => {
  const updatedState = new Map(previousState);
  switch (action.type) {
    case 'create':
      console.log('CREATE');
      updatedState.set(action.payload.id, action.payload);
      const id = v4()
      updatedState.set(id, { content: '', id })
      return updatedState;
    case 'update':
      console.log('UPDATE');
      updatedState.set(action.payload.id, action.payload);
      return updatedState;
    case 'delete':
      console.log('DELETE');
      updatedState.delete(action.payload.id);
      return updatedState;
    case 'add-empty':
      console.log('ADD EMPTY');
      const emptyId = v4()
      updatedState.set(emptyId, { content: '', id: emptyId })
      return updatedState;
  }
}
const initializer = (initialArgs: State) => {
  return reducer(initialArgs, { type: 'add-empty' });
}

function GlobalStateProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, new Map(), initializer);
  return (
    <GlobalState.Provider value={{ state, dispatch }}>{children}</GlobalState.Provider>
  )
}


export { GlobalStateProvider, useGlobalState };
