import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch'

export type TrpcContext = {
  myContext: 'RNW'
}

export const createContext = async (
  opts: FetchCreateContextFnOptions
): Promise<TrpcContext> => {
  return {
    ...opts,
    myContext: 'RNW',
  }
}
