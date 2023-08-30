import { getAuthUser } from "~/server/auth";
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { joinFormSchema } from "~/pages/join";


const usersPaginationInput = z.object({
    page: z.number(),
    perPage: z.number(),
}).optional().default({ page: 1, perPage: 20 })




const usersRouter = createTRPCRouter({
    getByInterest: protectedProcedure
        .input(usersPaginationInput)
        .query(async ({ ctx, input }) => {
            const { db, session } = ctx;
            const authUser = await getAuthUser(session)
            if (!authUser) return []
            const { perPage, page } = input;
            return await db.user.findMany({
                where: {
                    ...(authUser.interest !== "BOTH" && {
                        gender: authUser.interest
                    }),
                    id: { not: authUser.id }
                },
                orderBy: {
                    "name": "asc"
                },
                ...(perPage !== -1 && {
                    take: perPage,
                    skip: page <= 1 ? 0 : ((page - 1) * perPage),
                }),
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
        }),
    addNew: publicProcedure
        .input(joinFormSchema)
        .mutation(async ({ ctx, input }) => {
            const { db } = ctx;
            try {
                const user = await db.user.create({
                    data: {
                        gender: input.gender,
                        image: input.image,
                        interest: input.interest,
                        name: input.name,
                        password: input.password,
                        username: (`${input.name.toLowerCase().replaceAll(" ", "_")}${Math.random() * 99999}`)
                    }
                })
                if (!user) throw new Error();
                return user;
            } catch (error) {
                console.log(error)
                return null
            }
        })
});

export default usersRouter