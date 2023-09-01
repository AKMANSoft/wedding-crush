import type { GetServerSideProps } from 'next'
import { getServerAuth } from "~/server/auth";
import { Card, CardContent } from "~/components/ui/card";
import Image from 'next/image'
import Typewriter from 'typewriter-effect';
import { motion } from 'framer-motion'
import { BottomReveal, PopupReveal, TopLeftReveal, TopRightReveal } from "~/components/framer-components";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import groomBrideImage from '../../public/images/groom-bride-compressed.svg'
import boyGirlImage from '../../public/images/boy-girl-compressed.svg'


export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getServerAuth(ctx)
  if (session) {
    return {
      redirect: {
        destination: "/listing",
        permanent: false,
      }
    }
  }
  return { props: {} }
}



export default function Page() {
  const [state, setState] = useState<"WELCOME" | "JOIN_POOL">("WELCOME")
  const router = useRouter()



  const handlePageClick = (e: MouseEvent) => {
    if (state === "JOIN_POOL") router.push("/join")
    if (state === "WELCOME") setState("JOIN_POOL")
  }

  useEffect(() => {
    document.addEventListener("click", handlePageClick, true)
    return () => {
      document.removeEventListener('click', handlePageClick, true);
    };
  }, [state])

  return (
    <main className=" flex min-h-screen flex-col items-center justify-center py-20 px-4 bg-primary">
      {
        state === "JOIN_POOL" ?
          <JoinPool />
          :
          <WelcomeCard />
      }
    </main>
  );
}




type WelcomeCardProps = {
  onFinish?: () => void
}

function WelcomeCard({ onFinish }: WelcomeCardProps) {
  return (
    <Card className="w-full max-w-[600px] h-fit rounded-md overflow-hidden bg-white">
      <CardContent className="p-0 h-auto">
        <motion.div className="relative w-full h-auto">
          <motion.div className="sticky top-0 flex items-start justify-between w-full z-0">
            <TopLeftReveal bounce={0} className="w-auto h-auto" duration={1}>
              <Image
                width={200} height={200}
                src="/images/flower-top-left.jpg" alt=""
                loading="eager"
                className="w-[200px] h-auto aspect-square " />
            </TopLeftReveal>
            <TopRightReveal bounce={0} className="w-auto h-auto" duration={1}>
              <Image
                width={200} height={200}
                src="/images/flower-top-right.jpg" alt=""
                loading="eager"
                className="w-[200px] h-auto aspect-square" />
            </TopRightReveal>
          </motion.div>
          <motion.div className="-mt-28 flex flex-col text-center transition-all items-center justify-center relative z-[2]">
            <h4 className="text-secondary font-solway transition-all h-9 font-light text-xl mt-3">
              <Typewriter
                options={{
                  strings: "Welcome to",
                  autoStart: true,
                  loop: false,
                  cursorClassName: "hidden"
                }}
              />
            </h4>
            <PopupReveal className="w-[80%]" bounce={0.5}>
              <Image
                width={600} height={300}
                priority 
                src={groomBrideImage} alt=""
                className="w-full h-auto mt-10" />
            </PopupReveal>
            <h1 className="font-brittany text-4xl h-[40px] text-primary">
              <Typewriter
                options={{
                  strings: "Sharon & Ori's",
                  autoStart: true,
                  loop: false,
                  cursorClassName: "hidden"
                }}
              />
            </h1>
            <motion.h4 className="text-secondary font-solway h-9 font-light text-xl mt-3">
              <Typewriter
                options={{
                  strings: "Wedding",
                  autoStart: true,
                  loop: false,
                  cursorClassName: "hidden"
                }}
              />
            </motion.h4>
          </motion.div>
          <BottomReveal onAnimationEnd={onFinish} duration={4} className="sticky bottom-0 w-full h-auto z-0">
            <Image
              width={600} height={200}
              src="/images/flowers-bottom.jpg" alt=""
              loading="eager"
              className="w-full h-auto" />
          </BottomReveal>
        </motion.div>
      </CardContent>
    </Card>
  )
}


type JoinPoolProps = {
  onFinish?: () => void
}

function JoinPool({ onFinish }: JoinPoolProps) {
  return (
    <Card className="w-full max-w-[600px] h-fit rounded-md overflow-hidden bg-white">
      <CardContent className="p-0 h-auto">
        <motion.div className="relative w-full h-auto">
          <motion.div className="sticky top-0 flex items-start justify-between w-full z-0">
            <TopLeftReveal bounce={0} className="w-auto h-auto" duration={1}>
              <Image
                width={200} height={200}
                src="/images/flower-top-left.jpg" alt=""
                loading="eager"
                className="w-[200px] h-auto aspect-square " />
            </TopLeftReveal>
            <TopRightReveal bounce={0} className="w-auto h-auto" duration={1}>
              <Image
                width={200} height={200}
                src="/images/flower-top-right.jpg" alt=""
                loading="eager"
                className="w-[200px] h-auto aspect-square" />
            </TopRightReveal>
          </motion.div>
          <motion.div className="-mt-32 flex flex-col text-center transition-all items-center justify-center relative z-[2]">
            <h4 className="text-secondary font-solway transition-all h-9 font-light text-xl mt-3">
              <Typewriter
                options={{
                  strings: "Join the Pool of",
                  autoStart: true,
                  loop: false,
                  cursorClassName: "hidden"
                }}
              />
            </h4>
            <PopupReveal className="w-[80%]" bounce={0.5}>
              <Image
                width={600} height={300}
                src={boyGirlImage} alt=""
                priority
                className="w-full h-auto mt-10" />
            </PopupReveal>
            <h1 className="font-brittany text-4xl h-[40px] text-primary">
              <Typewriter
                options={{
                  strings: "Singles",
                  autoStart: true,
                  loop: false,
                  cursorClassName: "hidden"
                }}
              />
            </h1>
            <motion.h4 className="text-secondary font-solway h-9 font-light text-xl mt-3">
              <Typewriter
                options={{
                  strings: "at Wedding",
                  autoStart: true,
                  loop: false,
                  cursorClassName: "hidden"
                }}
              />
            </motion.h4>
          </motion.div>
          <BottomReveal onAnimationEnd={onFinish} duration={4} className="sticky bottom-0 w-full h-auto z-0">
            <Image
              width={600} height={200}
              src="/images/flowers-bottom.jpg" alt=""
              loading="eager"
              className="w-full h-auto" />
          </BottomReveal>
        </motion.div>
      </CardContent>
    </Card>
  )
}
