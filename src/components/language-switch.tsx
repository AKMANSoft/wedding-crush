import { useLocale, useTranslations } from 'next-intl'
import Link from "next/link";
import { cn } from '~/utils/common';
import { usePathname } from 'next/navigation'



export default function LanguageSwitchComponent() {
    const locale = useLocale()
    const t = useTranslations()
    const pathname = usePathname()

    return (
        <div className='fixed top-5 right-5'>
            <div className='flex items-center rounded bg-white  p-1'>
                <Link href={pathname} locale={'en'} className={cn(
                    "px-3 text-center text-sm h-full font-solway",
                    locale === "he" ? "text-secondary" : "text-primary"
                )}>
                    en
                </Link>
                <span className={cn(
                    "block h-[16px] w-[1px] opacity-70 rounded-full bg-secondary"
                )} />
                <Link href={pathname} locale={'he'} className={cn(
                    "px-3 text-center text-sm h-full font-solway",
                    locale === "he" ? "text-primary" : "text-secondary"
                )}>
                    עב
                </Link>
            </div>
        </div>
    )
}