import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import type { Prisma } from '@prisma/client';
import { router, publicProcedure } from '../trpc';
import { prisma } from '../prisma';

const defaultMonkeyPictureSelect = {
  id: true,
  description: true,
  url: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.MonkeyPictureSelect;

export const monkeyPictureRouter = router({
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().nullish(),
        page: z.number().nullish(),
      }),
    )
    .query(async ({ input }) => {
      const limit = input.limit ?? 2;
      const page = input.page ?? 0;

      const result = await prisma.$transaction([
        prisma.monkeyPicture.count(),
        prisma.monkeyPicture.findMany({
          select: defaultMonkeyPictureSelect,
          take: limit,
          skip: page * limit,
          orderBy: {
            createdAt: 'desc',
          },
        }),
      ]);

      return {
        count: result[0],
        items: result[1],
      };
    }),
  byId: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .query(async ({ input }) => {
      const { id } = input;
      const monkeyPicture = await prisma.monkeyPicture.findUnique({
        where: { id },
        select: defaultMonkeyPictureSelect,
      });
      if (!monkeyPicture) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: `No monkey picture with id '${id}'`,
        });
      }
      return monkeyPicture;
    }),
  add: publicProcedure
    .input(
      z.object({
        id: z.string().uuid().optional(),
        url: z.string().min(3).max(300),
        description: z.string().min(3).max(2000),
      }),
    )
    .mutation(async ({ input }) => {
      const monkeyPicture = await prisma.monkeyPicture.create({
        data: input,
        select: defaultMonkeyPictureSelect,
      });
      return monkeyPicture;
    }),
  removeById: publicProcedure
    .input(
      z.object({
        id: z.string().uuid(),
      }),
    )
    .mutation(async ({ input }) => {
      const monkeyPicture = await prisma.monkeyPicture.delete({
        where: {
          id: input.id,
        },
      });
      return monkeyPicture;
    }),
});
