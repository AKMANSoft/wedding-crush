import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import { Card, CardContent } from "~/components/ui/card";
import Image from 'next/image'
import Typewriter from 'typewriter-effect';
import { motion } from 'framer-motion'
import { BottomReveal, PopupReveal, TopLeftReveal, TopRightReveal } from "~/components/framer-components";
import { useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from "react";
import path from 'path';
import fs from 'fs/promises'
import { Button } from '~/components/ui/button';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';



export const getStaticProps: GetStaticProps<{
  groomBrideImage: string,
}> = async (ctx) => {
  // const session = await getServerAuth(ctx)
  // if (session) {
  //   return {
  //     redirect: {
  //       destination: "/gallery",
  //       permanent: false,
  //     }
  //   }
  // }

  const groomBrideImagePath = path.join(process.cwd(), `/public/images/groom-bride-compressed.svg`)
  let groomBrideImage: string;

  try {
    groomBrideImage = 'data:image/svg+xml;base64,' + Buffer.from(await fs.readFile(groomBrideImagePath)).toString('base64')
  } catch {
    groomBrideImage = "/images/groom-bride-compressed.svg"
  }

  return {
    props: {
      groomBrideImage,
    }
  }
}



export default function Page({ groomBrideImage }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()


  useEffect(() => {
    router.prefetch("/welcome/pool-of-singles")
  }, [router])


  const handleNextClick = () => {
    router.push("/welcome/pool-of-singles")
  }


  return (
    <main className="flex flex-col min-h-screen items-center justify-center py-16 md:py-20 px-4 bg-primary">
      <WelcomeCard groomBrideImage={groomBrideImage} />
      <div className='flex items-center justify-center mt-2 w-full max-w-[600px]'>
        <Button type='button' onClick={handleNextClick} variant="light" className='gap-3 w-full h-[39px]'>
          <span>Next</span>
          <ArrowRightIcon className='w-4 h-4' />
        </Button>
      </div>
    </main>
  );
}




type WelcomeCardProps = {
  onFinish?: () => void;
  groomBrideImage: string;
}

function WelcomeCard({ onFinish, groomBrideImage }: WelcomeCardProps) {
  return (
    <Card className="w-full max-w-[600px] h-fit rounded-md -mt-8 overflow-hidden bg-white">
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
            <PopupReveal className="w-[80%] mt-5" bounce={0.5}>
              <Image
                width={600} height={300} loading='eager'
                priority fetchPriority='high'
                src={groomBrideImage} alt=""
                className="w-full h-auto" />
            </PopupReveal>
            <h1 className="font-brittany text-4xl pb-2 h-[52px] will-change-transform text-primary">
              <Typewriter
                options={{
                  strings: "Sharon & Ori's",
                  wrapperClassName: "flex items-center h-[65px]",
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

