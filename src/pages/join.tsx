import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "~/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Gender, UserInterest } from "@prisma/client";
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from "~/components/ui/input";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import { cn } from "~/utils/common";
import ChipsGroup from "~/components/ui/chips-group";
import { AvatarIcon } from "@radix-ui/react-icons";
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { trpcClient } from "~/utils/api";
import { signIn } from 'next-auth/react'



// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//     const session = await getServerAuth(ctx)
//     if (session) {
//         return {
//             redirect: {
//                 destination: "/listing",
//                 permanent: false,
//             }
//         }
//     }
//     return { props: {} }
// }





export const joinFormSchema = z.object({
    name: z.string({ required_error: "This field is required." }),
    image: z.string({ required_error: "Photo required." }),
    gender: z.enum([Gender.MALE, Gender.FEMALE], { required_error: "This field is required." }),
    interest: z.enum([UserInterest.MALE, UserInterest.FEMALE, UserInterest.BOTH], { required_error: "This field is required." }),
    password: z.string({ required_error: "This field is required." }).optional().default("")
})

type JoinFormSchema = z.infer<typeof joinFormSchema>


export default function Page() {
    const router = useRouter();
    const form = useForm<JoinFormSchema>({
        resolver: zodResolver(joinFormSchema),
        mode: "onSubmit",
        shouldFocusError: false
    })
    const { mutateAsync } = trpcClient.users.addNew.useMutation()


    const handleFormSubmit = async (data: JoinFormSchema) => {
        const res = await mutateAsync({
            ...data,
            image: ""
        })

        if (res) {
            const loginRes = await signIn("credentials", {
                callbackUrl: "/listing",
                redirect: true,
                username: res.username,
                password: res.password,
            })
            router.push("/listing")
        }
    }

    return (
        <main className=" flex min-h-screen flex-col items-center justify-center py-10">
            <Card className="w-full max-w-screen-md rounded-md bg-white">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                        <CardHeader>
                            <CardTitle className="text-xl text-center font-bold text-pink-500">
                                Join the pool of singles at this wedding.
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-5">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormLabel>Your Name</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            {fieldState.error && <FormMessage />}
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="gender"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormLabel>Gender</FormLabel>
                                            <FormControl>
                                                <ChipsGroup
                                                    value={field.value}
                                                    onChange={(value) => {
                                                        form.setValue("interest", (value as Gender) === "MALE" ? "FEMALE" : "MALE")
                                                        field.onChange(value)
                                                    }}
                                                    options={[Gender.MALE, Gender.FEMALE]} />
                                            </FormControl>
                                            {fieldState.error && <FormMessage />}
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="interest"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormLabel>Interested in</FormLabel>
                                            <FormControl>
                                                <ChipsGroup
                                                    value={field.value}
                                                    onChange={(value) => field.onChange(value)}
                                                    options={[UserInterest.MALE, UserInterest.FEMALE, UserInterest.BOTH]} />
                                            </FormControl>
                                            {fieldState.error && <FormMessage />}
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormLabel>Photo</FormLabel>
                                            <FormControl>
                                                <PhotoInputComponent
                                                    value={field.value}
                                                    onChange={(value) => field.onChange(value)}
                                                />
                                            </FormControl>
                                            {fieldState.error && <FormMessage />}
                                        </FormItem>
                                    )}
                                />
                                {/* <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            {fieldState.error && <FormMessage />}
                                        </FormItem>
                                    )}
                                /> */}
                            </div>
                        </CardContent>
                        <CardFooter className="flex items-center justify-between">
                            <div></div>
                            <Button type="submit" className="bg-opacity-90">
                                {
                                    form.formState.isSubmitting ?
                                        <span className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                                        :
                                        "Continue"
                                }
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </main >
    );
}




function blobToBase64(blob: File): Promise<string> {
    return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result?.toString() ?? "");
        reader.readAsDataURL(blob);
    });
}


type PhotoInputComponentProps = {
    value?: string | null;
    onChange?: (value: string) => void;
}

function PhotoInputComponent({ value, onChange }: PhotoInputComponentProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>();

    const filesChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        const firstFile = files?.[0]
        if (!firstFile) return;
        const imageB64 = await blobToBase64(firstFile)
        onChange?.(imageB64)
    }


    useEffect(() => {
        setCapturedPhoto(value)
    }, [value])





    return (
        <div>
            <input
                type="file"
                ref={inputRef}
                onChange={filesChangeHandler}
                hidden
                accept="image/*"
                className="hidden"
                capture="user" />
            <button type="button"
                onClick={() => inputRef.current?.click()}
                className={cn(
                    "rounded-full border aspect-square h-32 w-32 border-slate-200 flex items-center justify-center overflow-hidden",
                    !capturedPhoto && "p-5"
                )}>
                {
                    capturedPhoto ?
                        <Image src={capturedPhoto} alt="" width={100} height={100} className="w-full h-full object-cover object-center" />
                        :
                        <AvatarIcon className="w-20 h-20" />
                }
            </button>
        </div>
    )
}

// type PhotoInputComponentProps = {
//     value?: string | null;
//     onChange?: (value: string) => void;
// }

// function PhotoInputComponent({ value, onChange }: PhotoInputComponentProps) {
//     const inputRef = useRef<HTMLInputElement>(null);
//     const [popupOpen, setPopupOpen] = useState(false);
//     const [capturedPhoto, setCapturedPhoto] = useState<string | null>();
//     const webcamRef = useRef<Webcam>(null);
//     const capture = useCallback(
//         () => {
//             const imageSrc = webcamRef.current?.getScreenshot();
//             setCapturedPhoto(imageSrc)
//         },
//         [webcamRef]
//     );

//     const filesChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
//         const files = e.target.files;
//         if (!files || files.length <= 0) return;
//         console.log(files[0])
//     }


//     useEffect(() => {
//         setCapturedPhoto(value)
//     }, [value])


//     const handleContinueClick = () => {
//         if (!capturedPhoto) return;
//         onChange?.(capturedPhoto)
//         setPopupOpen(false)
//     }




//     return (
//         <div>
//             <input
//                 type="file"
//                 ref={inputRef}
//                 onChange={filesChangeHandler}
//                 hidden
//                 className="hidden"
//                 capture="user" />
//             <Dialog
//                 open={popupOpen}
//                 onOpenChange={(value) => {
//                     setCapturedPhoto(null)
//                     setPopupOpen(value)
//                 }}>
//                 <DialogTrigger asChild>
//                     <button type="button" className={cn(
//                         "rounded-full border aspect-square h-32 w-32 border-slate-200 flex items-center justify-center overflow-hidden",
//                         !capturedPhoto && "p-5"
//                     )}>
//                         {
//                             capturedPhoto ?
//                                 <Image src={capturedPhoto} alt="" width={100} height={100} className="w-full h-full object-cover object-center" />
//                                 :
//                                 <AvatarIcon className="w-20 h-20" />
//                         }
//                     </button>
//                 </DialogTrigger>
//                 <DialogContent className="sm:max-w-4xl p-0 overflow-hidden bg-white">
//                     <div className="relative max-h-[95vh]">
//                         {
//                             capturedPhoto ?
//                                 <div>
//                                     <Image src={capturedPhoto} alt="" width={500} height={800} className="w-full h-full object-contain object-center" />
//                                     <div className="absolute left-1/2 -translate-x-1/2 bottom-3 z-[10] flex items-center justify-center gap-4 w-full">
//                                         <Button
//                                             type="button"
//                                             variant="dark"
//                                             onClick={() => setCapturedPhoto(null)}
//                                             className="text-white rounded-full h-auto text-xs md:text-sm">
//                                             Capture again
//                                         </Button>
//                                         <Button onClick={handleContinueClick} type="button" variant="default" className="text-white rounded-full text-xs h-auto md:text-sm">
//                                             Continue
//                                         </Button>
//                                     </div>
//                                 </div>
//                                 :
//                                 <div className="w-full">
//                                     <Webcam
//                                         audio={false}
//                                         height={800}
//                                         screenshotFormat="image/jpeg"
//                                         capture="user"
//                                         ref={webcamRef}
//                                         width={800}
//                                         className="object-cover h-full object-center w-full"
//                                         videoConstraints={{ facingMode: "user", aspectRatio: { exact: 1 } }}
//                                     />
//                                     <Button onClick={capture} type="button" variant="default" className="absolute left-1/2 -translate-x-1/2 bottom-3 z-[10] text-white rounded-full text-xs md:text-sm">
//                                         Capture
//                                     </Button>
//                                 </div>
//                         }

//                     </div>
//                 </DialogContent>
//             </Dialog>
//         </div>
//     )
// }