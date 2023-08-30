import { getAuthUser } from "~/server/auth";
import { z } from 'zod'
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { joinFormSchema } from "~/pages/join";
import AWS from 'aws-sdk'
import { env } from "~/env.mjs";

const usersPaginationInput = z.object({
    page: z.number(),
    perPage: z.number(),
}).optional().default({ page: 1, perPage: 20 })



const uploadImageToS3 = async (image: string, key: string) => {
    AWS.config.update({
        accessKeyId: env.AWS_KEY,
        secretAccessKey: env.AWS_SECRET,
        region: env.AWS_REGION
    })
    const s3 = new AWS.S3();
    const imageBuffer = Buffer.from(image, 'base64');
    const imageBlob = await fetch(image).then(res => res.blob())


    const params = {
        Bucket: env.AWS_BUCKET,
        Key: key + ".jpg",
        Body: Buffer.from(await imageBlob.arrayBuffer()),
        ContentType: "image/jpeg",
        // ACL: 'public-read',
        Metadata: { 'Content-Type': "image/jpeg" }
    };

    const res = await s3.upload(params).promise();
    return res.Location
}



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
                const username = (`${input.name.toLowerCase().replaceAll(" ", "_")}${Math.random() * 9838493489384}`)
                const imageS3Path = await uploadImageToS3(input.image, username)
                console.log("Image Upload Res = ", imageS3Path)
                const user = await db.user.create({
                    data: {
                        gender: input.gender,
                        image: imageS3Path ?? "",
                        interest: input.interest,
                        name: input.name,
                        password: input.password,
                        username: username
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