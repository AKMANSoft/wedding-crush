import { getAuthUser } from "~/server/auth";
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from "../trpc";


const usersPaginationInput = z.object({
    page: z.number(),
    perPage: z.number(),
}).optional().default({ page: 1, perPage: 20 })


const usersRouter = createTRPCRouter({
    getByInterest: protectedProcedure
        .input(usersPaginationInput)
        .query(async ({ ctx }) => {
            const { db, session } = ctx;
            const authUser = await getAuthUser(session)
            if (!authUser) return []
            return await db.user.findMany({
                where: {
                    ...(authUser.interest !== "BOTH" && {
                        interest: authUser.interest
                    })
                }
            })
        }),
    me: protectedProcedure.query(async ({ ctx }) => {
        const { db, session } = ctx;
        if (!session) return null
        return await db.user.findUnique({
            where: {
                id: session.user.id
            }
        })
    }),
    getById: protectedProcedure
        .input(
            z.object({
                id: z.string()
            })
        )
        .query(async ({ input, ctx }) => {
            const { db, session } = ctx;
            if (!session) return null
            return await db.user.findUnique({
                where: {
                    id: input.id
                }
            })
        })
});

export default usersRouter