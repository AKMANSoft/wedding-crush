import { useLocale } from 'next-intl'
import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'


export default function I18nLayout({ children }: { children?: ReactNode }) {
    const locale = useLocale()
    const pathname = usePathname()

    return (
        <div dir={(locale === "he" && !pathname.startsWith("/welcome")) ? "rtl" : "ltr"}>
            {children}
        </div>
    )
}