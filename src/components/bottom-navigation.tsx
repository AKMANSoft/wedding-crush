import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl';
import Link from "next/link";
import { cn } from '~/utils/common';


export default function BottomNavigation() {
    const pathname = usePathname()
    const t = useTranslations();

    return (
        <div className={cn(
            "w-full flex items-center fixed bottom-0 rounded-t-[20px] h-[44px] overflow-hidden rtl:flex-row-reverse",
            pathname.startsWith("/profile") ? "bg-white" : "bg-primary"
        )}>
            <Link href="/gallery" className={cn(
                "w-1/2 flex items-center justify-center text-center h-full font-solway rtl:font-noto-hebrew",
                pathname.startsWith("/profile") ? "text-secondary" : "text-white"
            )}>
                {t("gallery")}
            </Link>
            <span className={cn(
                "block h-[33px] w-[3px] rounded-full",
                pathname.startsWith("/profile") ? "bg-primary" : "bg-white"
            )} />
            <Link href="/profile" className={cn(
                "w-1/2 flex items-center justify-center text-center h-full font-solway rtl:font-noto-hebrew",
                pathname.startsWith("/profile") ? "text-secondary" : "text-white"
            )}>
                {t("profile")}
            </Link>
        </div>
    )
}