import { useLocale } from 'next-intl'
import { ReactNode, useEffect } from 'react'
import { usePathname } from 'next/navigation'


export default function I18nLayout({ children }: { children?: ReactNode }) {
    const locale = useLocale()
    const pathname = usePathname()

    useEffect(() => {
        // window.onresize = () => {
        //     document.body.style.maxHeight = `${window.innerHeight}px`;
        // }
    }, [])


    return (
        <div dir={(locale === "he" && !pathname.startsWith("/welcome") && !pathname.startsWith("/login")) ? "rtl" : "ltr"}>
            {children}
        </div>
    )
}