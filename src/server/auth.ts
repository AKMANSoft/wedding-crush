import { type GetServerSidePropsContext } from "next";
import { randomBytes, randomUUID } from "crypto"
import {
  getServerSession,
  AuthOptions,
  Session,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials"
import { env } from "~/env.mjs";
import { User } from '@prisma/client'
import db from "./db";
import bcrypt from 'bcryptjs'


export type SessionUser = Omit<User, "password"> & {

}




declare module 'next-auth' {
  interface Session {
    user: SessionUser
  }
}


type AuthCredentials = { username: string, password: string, adminLogin?: boolean; }

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        username: {
          type: "text",
          label: "Username",
        },
        password: {
          type: "password",
          label: "Password",
        },
      },
      async authorize(credentials, req) {
        const { username, password } = credentials as AuthCredentials
        const user = await db.user.findFirst({
          where: {
            username: username,
          },
        })
        if (!user) throw new Error("ACCOUNT_NOT_FOUND")
        if (user.type === "ADMIN") {
          if (!(await comparePassword(password, user.password)))
            throw new Error("WRONG_PASSWORD")
        }
        return { ...user, password: "" }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
    generateSessionToken: () => {
      return randomUUID?.() ?? randomBytes(32).toString("hex")
    },
  },
  pages: {
    signIn: "/join",
    signOut: "/join",
    error: "/join",
  },
  secret: process.env.NEXTAUTH_SECRET as string,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = user
      }
      return token
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user as SessionUser
      }
      return session
    },
  },
}



export const getServerAuth = (ctx?: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  if (ctx) return getServerSession(ctx.req, ctx.res, authOptions)
  else return getServerSession(authOptions);
};



export const getAuthUser = async (session?: Session | null) => {
  const currentSession = session !== undefined ? session : await getServerAuth()
  if (!currentSession) return null
  return await db.user.findUnique({
    where: {
      id: currentSession.user.id
    }
  })
}



export async function hashPassword(password: string) {
  try {
    return bcrypt.hash(password, 10)
  } catch (error) {
    return null
  }
}
export async function comparePassword(plainPassword: string, hashedPassword: string) {
  try {
    return bcrypt.compare(plainPassword, hashedPassword)
  } catch (error) {
    return false
  }
}