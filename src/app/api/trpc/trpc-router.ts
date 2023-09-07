import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import SuperJSON from 'superjson'
import sleep from '@/utils/sleep'
import { TrpcContext } from '@/utils/trpc/context'

const t = initTRPC.context<TrpcContext>().create({
  transformer: SuperJSON,
})

const block = z.object({
  id: z.string(),
  content: z.string(),
})

export const appRouter = t.router({
  createBlock: t.procedure.input(block).mutation(async (opts) => {
    console.log('CREATE ON BACKEND', opts.input)
    await sleep(200)
    return opts.input
  }),
  updateBlock: t.procedure.input(block).mutation(async (opts) => {
    console.log('UPDATE ON BACKEND', opts.input)
    await sleep(200)
    return opts.input
  }),
  deleteBlock: t.procedure
    .input(z.object({ id: z.string() }))
    .mutation(async (opts) => {
      console.log('DELETE ON BACKEND', opts.input.id)
      await sleep(200)
      return opts.input
    }),
})

export type AppRouter = typeof appRouter
