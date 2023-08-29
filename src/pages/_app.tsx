import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import "~/styles/tailwind.css";
import Head from "next/head";
import { trpcClient } from "~/utils/api";


const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <div className="bg-gradient-to-l from-pink-500 to-red-500">
      <Head>
        <title>Wedding Crush</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <SessionProvider session={session}>
          <Component {...pageProps} />
        </SessionProvider>
      </div>
    </div>
  );
};

export default trpcClient.withTRPC(MyApp);
