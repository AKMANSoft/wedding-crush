import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import "~/styles/tailwind.css";
import Head from "next/head";
import Link from "next/link";
import { trpcClient } from "~/utils/api";
import { useEffect } from "react";
import { GallerySvgIcon, ProfileSvgIcon } from "~/utils/icons";
import { usePathname } from 'next/navigation'
import { cn } from "~/utils/common";


const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  const pathname = usePathname()

  useEffect(() => {
    localStorage.theme = 'light'
  }, [])


  const showBottomNavigation = (pathname.startsWith("/gallery") || pathname.startsWith("/profile"))

  return (
    <div>
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
              "w-full flex fixed bottom-0 rounded-t-[20px] h-[44px] py-2",
              pathname.startsWith("/profile") ? "bg-white" : "bg-primary"
            )}>
              <Link href="/gallery" className="flex items-center h-full justify-center w-1/2">
                {GallerySvgIcon(pathname.startsWith("/profile"))}
              </Link>
              <span className={cn(
                "block h-full w-[3px] rounded-full",
                pathname.startsWith("/profile") ? "bg-primary" : "bg-white"
              )} />
              <Link href="/profile" className="flex items-center h-full justify-center w-1/2">
                {ProfileSvgIcon(pathname.startsWith("/profile"))}
              </Link>
            </div>
          )
        }
      </SessionProvider >
    </div >
  );
};

export default trpcClient.withTRPC(MyApp);
