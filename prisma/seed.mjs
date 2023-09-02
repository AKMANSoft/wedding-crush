import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
import bcrypt from 'bcryptjs'

async function main() {
    await prisma.user.upsert({
        create: {
            username: "admin",
            name: "Admin",
            password: await bcrypt.hash("12345678", 10),
            type: "ADMIN",
            gender: "MALE",
            image: "",
            interest: "BOTH",
            side: "GROOM"
        },
        where: {
            username: "admin"
        },
        update: {}
    })
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
