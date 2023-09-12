import { initTRPC } from '@trpc/server'
import { z } from 'zod'
import SuperJSON from 'superjson'
import sleep from '@/utils/sleep'
import { TrpcContext } from '@/utils/trpc/context'
import { blockValidator, createBlockValidator } from '@/utils/types/validators'
import { v4 } from 'uuid'

const t = initTRPC.context<TrpcContext>().create({
  transformer: SuperJSON,
})

export const appRouter = t.router({
  createBlock: t.procedure
    .input(createBlockValidator)
    .mutation(async (opts) => {
      const newId = v4()
      console.log('CREATE ON BACKEND', opts.input)
      await sleep(200)
      return {
        ...opts.input,
        id: newId,
      }
    }),
  updateBlock: t.procedure.input(blockValidator).mutation(async (opts) => {
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
