import { signIn, signOut, useSession } from "next-auth/react";
import Link from 'next/link'

export default function Page() {

  return (
    <main className=" flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight text-center text-white sm:text-[4.5rem]">
          Welcome to <br className="lg:hidden" /> <span className="text-yellow-500">Sharon & Ori's</span> <br className="lg:hidden" /> Wedding
        </h1>
        <Link href='/join' className="text-yellow-500 underline text-xl lg:text-2xl text-center">
          Join the pool of singles at this wedding
        </Link>
      </div>
    </main>
  );
}
