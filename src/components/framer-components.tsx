import { motion } from 'framer-motion'
import { cn } from '~/utils/common';

type DefaultRevealProps = {
    className?: string,
    duration?: number,
    delay?: number,
    bounce?: number,
    children: React.ReactNode,
    once?: boolean,
    onAnimationEnd?: () => void
}


export function PopupReveal({
    className, children,
    duration = 1, delay = 0,
    bounce = 0.4,
    once = true
}: DefaultRevealProps
) {
    return (
        <motion.div
            initial={{ scale: 0 }}
            whileInView={{
                scale: 1,
                transition: {
                    type: "spring",
                    bounce: bounce,
                    duration: duration,
                    delay: delay,
                }
            }}
            viewport={{ once: once, amount: 0 }}
            className={cn(
                "w-full h-full",
                className
            )}
        >
            {children}
        </motion.div>
    );
}

export function TopRightReveal({
    className, children,
    duration = 1, delay = 0,
    bounce = 0.4,
    once = true
}: DefaultRevealProps
) {
    return (
        <motion.div
            initial={{ y: "-100%", x: "100%" }}
            whileInView={{
                y: 0,
                x: 0,
                transition: {
                    type: "spring",
                    bounce: bounce,
                    duration: duration,
                    delay: delay,
                }
            }}
            viewport={{ once: once, amount: 0 }}
            className={cn(
                "w-full h-full",
                className
            )}
        >
            {children}
        </motion.div>
    );
}

export function TopLeftReveal({
    className, children,
    duration = 1, delay = 0,
    bounce = 0.4,
    once = true
}: DefaultRevealProps
) {
    return (
        <motion.div
            initial={{ y: "-100%", x: "-100%" }}
            whileInView={{
                y: 0,
                x: 0,
                transition: {
                    type: "spring",
                    bounce: bounce,
                    duration: duration,
                    delay: delay,
                }
            }}
            viewport={{ once: once, amount: 0 }}
            className={cn(
                "w-full h-full",
                className
            )}
        >
            {children}
        </motion.div>
    );
}

export function BottomReveal({
    className, children,
    duration = 1, delay = 0,
    bounce = 0.4,
    once = true,
    onAnimationEnd
}: DefaultRevealProps
) {
    return (
        <motion.div
            initial={{ y: "200%" }}
            animate={{
                y: 0,
                transition: {
                    type: "spring",
                    bounce: bounce,
                    duration: duration,
                    delay: delay,
                },
            }}
            viewport={{ once: once, amount: 0 }}
            onAnimationComplete={onAnimationEnd}
            className={cn(
                "w-full h-full",
                className
            )}
        >
            {children}
        </motion.div>
    );
}
