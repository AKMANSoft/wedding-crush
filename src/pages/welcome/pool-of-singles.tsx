import type { GetStaticProps, InferGetStaticPropsType } from 'next'
import { Card, CardContent } from "~/components/ui/card";
import Image from 'next/image'
import Typewriter from 'typewriter-effect';
import { motion } from 'framer-motion'
import { BottomReveal, PopupReveal, TopLeftReveal, TopRightReveal } from "~/components/framer-components";
import { useRouter } from 'next/navigation'
import { useEffect, useState } from "react";
import path from 'path';
import fs from 'fs/promises'
import { Button } from '~/components/ui/button';
import { ArrowRightIcon } from '@radix-ui/react-icons';
import { useTranslations } from 'next-intl';



export const getStaticProps: GetStaticProps<{
  boyGirlImage: string
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

  const boyGirlImagePath = path.join(process.cwd(), `/public/images/boy-girl-compressed.svg`)
  let boyGirlImage: string;

  try {
    boyGirlImage = 'data:image/svg+xml;base64,' + Buffer.from(await fs.readFile(boyGirlImagePath)).toString('base64')
  } catch {
    boyGirlImage = "/images/boy-girl-compressed.svg"
  }

  return {
    props: {
      boyGirlImage,
    }
  }
}



export default function Page({ boyGirlImage }: InferGetStaticPropsType<typeof getStaticProps>) {
  const router = useRouter()
  const t = useTranslations()


  const handleNextClick = () => {
    router.push("/join")
  }

  return (
    <main className=" flex min-h-screen flex-col items-center justify-center py-16 md:py-20 px-4 bg-primary">
      <JoinPool boyGirlImage={boyGirlImage} />
      <div className='flex items-center justify-center mt-2 w-full max-w-[600px]'>
        <Button type='button' onClick={handleNextClick} variant="light" className='gap-3 w-full h-[39px]'>
          <span>Next</span>
          <ArrowRightIcon className='w-4 h-4' />
        </Button>
      </div>
    </main>
  );
}


type JoinPoolProps = {
  onFinish?: () => void;
  boyGirlImage: string;
}

function JoinPool({ onFinish, boyGirlImage }: JoinPoolProps) {
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
            <PopupReveal className="w-[80%] mt-8" bounce={0.5}>
              <Image
                width={600} height={300}
                src={boyGirlImage} alt="" loading='eager'
                priority fetchPriority='high'
                className="w-full h-auto" />
            </PopupReveal>
            <h1 className="font-brittany text-4xl h-auto pb-2 text-primary">
              <Typewriter
                options={{
                  strings: "Singles",
                  autoStart: true,
                  loop: false,
                  cursorClassName: "hidden",
                  wrapperClassName: "flex items-center h-[65px]",
                }}
              />
            </h1>
            <motion.h4 className="text-secondary font-solway h-9 font-light text-xl mt-3">
              <Typewriter
                options={{
                  strings: "at the Wedding",
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




