'use client'
import { PropsWithChildren, createContext, useContext, useReducer } from "react";

const GlobalState = createContext({});
const useGlobalState = () => useContext(GlobalState);

type Block = {
  id: string;
  content: string;
}

type State = Block[];
type Action =
  | { type: 'save', block: Block }
  | { type: 'delete', id: string }

const reducer = (previousState: State, action: Action): State => {
  switch (action.type) {
    case 'save':
      return [...previousState, action.block];
    case 'delete':
      return previousState.filter(block => block.id !== action.id);
  }
}
const initializer = (initialArgs: State) => {
  return initialArgs;
}

function GlobalStateProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(reducer, [], initializer);
  return (
    <GlobalState.Provider value={[state, dispatch]}>{children}</GlobalState.Provider>
  )
}


export { GlobalStateProvider, useGlobalState };
