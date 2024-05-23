import { createCallerFactory, publicProcedure, router } from '../trpc';
import { monkeyPictureRouter } from './monkey-picture';

export const appRouter = router({
  healthcheck: publicProcedure.query(() => 'yay!'),
  monkeyPicture: monkeyPictureRouter,
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;
