import { NextIntlClientProvider } from 'next-intl';
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import "~/styles/tailwind.css";
import Head from "next/head";
import Link from "next/link";
import { trpcClient } from "~/utils/api";
import { useEffect } from "react";
import { usePathname } from 'next/navigation'
import { cn } from "~/utils/common";


const App: AppType<{ session: Session | null, messages: any }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  const pathname = usePathname()

  useEffect(() => {
    localStorage.theme = 'light'
  }, [])


  const showBottomNavigation = (pathname.startsWith("/gallery") || pathname.startsWith("/profile"))

  return (
    <NextIntlClientProvider messages={pageProps.messages}>
      <Head>
        <title>Wedding Crush</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionProvider session={session}>
        <div>
          <Component {...pageProps} />
        </div>
        {
          showBottomNavigation && (
            <div className={cn(
              "w-full flex items-center fixed bottom-0 rounded-t-[20px] h-[44px] overflow-hidden",
              pathname.startsWith("/profile") ? "bg-white" : "bg-primary"
            )}>
              <Link href="/gallery" className={cn(
                "w-1/2 flex items-center justify-center text-center h-full font-solway",
                pathname.startsWith("/profile") ? "text-secondary" : "text-white"
              )}>
                Gallery
              </Link>
              <span className={cn(
                "block h-[33px] w-[3px] rounded-full",
                pathname.startsWith("/profile") ? "bg-primary" : "bg-white"
              )} />
              <Link href="/profile" className={cn(
                "w-1/2 flex items-center justify-center text-center h-full font-solway",
                pathname.startsWith("/profile") ? "text-secondary" : "text-white"
              )}>
                Profile
              </Link>
            </div>
          )
        }
      </SessionProvider >
    </NextIntlClientProvider >
  );
};

export default trpcClient.withTRPC(App);
