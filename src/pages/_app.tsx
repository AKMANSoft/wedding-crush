import { NextIntlClientProvider } from 'next-intl';
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { type AppType } from "next/app";
import "~/styles/tailwind.css";
import Head from "next/head";
import { trpcClient } from "~/utils/api";
import { useEffect } from "react";
import { usePathname } from 'next/navigation'
import { cn } from "~/utils/common";
import LanguageSwitchComponent from '~/components/language-switch';
import I18nLayout from '~/components/i18n-layout';
import BottomNavigation from '~/components/bottom-navigation';



const App: AppType<{ session: Session | null, messages?: any }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  const pathname = usePathname()

  useEffect(() => {
    localStorage.theme = 'light'
  }, [])


  const showBottomNavigation = (pathname.startsWith("/gallery") || pathname.startsWith("/profile"))

  return (
    <NextIntlClientProvider messages={pageProps.messages ?? {}}>
      <Head>
        <title>Wedding Crush</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='' />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;700&family=Solway:wght@300;400&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Hebrew:wght@300&display=swap" rel="stylesheet" />
      </Head>
      <SessionProvider session={session}>
        <I18nLayout>
          <Component {...pageProps} />
          <LanguageSwitchComponent />
          {
            showBottomNavigation && (
              <BottomNavigation />
            )
          }
        </I18nLayout>
      </SessionProvider >
    </NextIntlClientProvider >
  );
};

export default trpcClient.withTRPC(App);
