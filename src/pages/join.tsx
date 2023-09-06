import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Gender, UserInterest, UserSide } from "@prisma/client";
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from "~/components/ui/input";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import ChipsGroup from "~/components/ui/chips-group";
import { UploadIcon, ZoomInIcon } from "@radix-ui/react-icons";
import { trpcClient } from "~/utils/api";
import { signIn } from 'next-auth/react'
import { bothGenderSvg, brideIconSvg, femaleSvg, groomIconSvg, maleSvg } from "~/utils/icons";
import Resizer from "react-image-file-resizer";
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { useTranslations, useLocale } from 'next-intl';
import { GetStaticProps } from "next";
import { cn } from "~/utils/common";






export const getStaticProps: GetStaticProps = async (ctx) => {
    return {
        props: {
            messages: (await import(`../../locales/${ctx.locale}.json`)).default
        }
    }
}






export const joinFormSchema = z.object({
    name: z.string({ required_error: "field_required" }),
    image: z.string({ required_error: "photo_required" }),
    gender: z.enum([Gender.MALE, Gender.FEMALE], { required_error: "field_required" }),
    interest: z.enum([UserInterest.MALE, UserInterest.FEMALE, UserInterest.BOTH], { required_error: "field_required" }),
    side: z.enum([UserSide.GROOM, UserSide.BRIDE], { required_error: "field_required" }),
    password: z.string({ required_error: "field_required" }).optional().default("")
})

type JoinFormSchema = z.infer<typeof joinFormSchema>


export default function Page() {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const form = useForm<JoinFormSchema>({
        resolver: zodResolver(joinFormSchema),
        mode: "onSubmit",
        shouldFocusError: false
    })
    const { mutateAsync } = trpcClient.users.addNew.useMutation()


    const handleFormSubmit = async (data: JoinFormSchema) => {
        const res = await mutateAsync({
            ...data,
        })
        if (res) {
            const signinRes = await signIn("credentials", {
                callbackUrl: "/gallery",
                redirect: false,
                username: res.username,
                password: res.password,
            })
            if (signinRes?.ok && !signinRes.error) {
                router.push("/gallery")
            }
        }
    }

    return (
        <main className=" flex min-h-screen flex-col items-center justify-center py-20 px-4 bg-primary">
            <Card className="w-full max-w-[600px] rounded-md bg-white pb-5">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                        <CardContent className="p-6 px-5">
                            <div className="flex items-center justify-center">
                                <h2 className="text-lg border-b-2 border-primary text-center font-light text-secondary font-solway rtl:font-noto-hebrew">
                                    {t("fill_form")}
                                </h2>
                            </div>
                            <div className="space-y-[22px] mt-8">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormLabel className={cn("rtl:font-noto-hebrew font-light")}>{t("name")}</FormLabel>
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
                                            <FormLabel>{t("gender")}</FormLabel>
                                            <FormControl>
                                                <ChipsGroup
                                                    value={field.value}
                                                    chipClassName="w-1/2"
                                                    onChange={(value) => {
                                                        field.onChange(value)
                                                    }}
                                                    options={[
                                                        {
                                                            icon: maleSvg,
                                                            value: Gender.MALE,
                                                            label: t("male")
                                                        },
                                                        {
                                                            icon: femaleSvg,
                                                            value: Gender.FEMALE,
                                                            label: t("female")
                                                        },
                                                    ]} />
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
                                            <FormLabel>{t("interested")}</FormLabel>
                                            <FormControl>
                                                <ChipsGroup
                                                    value={field.value}
                                                    onChange={(value) => field.onChange(value)}
                                                    chipClassName="w-1/3 px-1"
                                                    options={[
                                                        {
                                                            icon: maleSvg,
                                                            value: UserInterest.MALE,
                                                            label: t("males")
                                                        },
                                                        {
                                                            icon: femaleSvg,
                                                            value: UserInterest.FEMALE,
                                                            label: t("females")
                                                        },
                                                        {
                                                            icon: bothGenderSvg,
                                                            value: UserInterest.BOTH,
                                                            label: t("both")
                                                        },
                                                    ]} />
                                            </FormControl>
                                            {fieldState.error && <FormMessage />}
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="side"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormLabel>{t("side")}</FormLabel>
                                            <FormControl>
                                                <ChipsGroup
                                                    value={field.value}
                                                    chipClassName="w-1/2"
                                                    onChange={(value) => field.onChange(value)}
                                                    options={[
                                                        {
                                                            icon: groomIconSvg,
                                                            value: UserSide.GROOM,
                                                            label: t("groom")
                                                        },
                                                        {
                                                            icon: brideIconSvg,
                                                            value: UserSide.BRIDE,
                                                            label: t("bride")
                                                        },
                                                    ]} />
                                            </FormControl>
                                            {fieldState.error && <FormMessage />}
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="image"
                                    render={({ field, fieldState }) => (
                                        <FormItem className="pt-5">
                                            <FormLabel></FormLabel>
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
                            </div>
                        </CardContent>
                        <CardFooter className="flex items-center mt-5 justify-between">
                            <div></div>
                            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full h-[39px] rtl:font-noto-hebrew">
                                {
                                    form.formState.isSubmitting ?
                                        <span className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                                        :
                                        t("done")
                                }
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </main >
    );
}




const resizeFile = (file: File) =>
    new Promise<string | null>((resolve) => {
        try {
            Resizer.imageFileResizer(
                file,
                256,
                256,
                "JPEG",
                100,
                0,
                (uri) => {
                    resolve(uri.toString());
                },
                "base64"
            );
        } catch (error) {
            console.log(error)
            resolve(null)
        }
    });



// function blobToBase64(blob: File): Promise<string> {
//     return new Promise((resolve, _) => {
//         const reader = new FileReader();
//         reader.onloadend = () => resolve(reader.result?.toString() ?? "");
//         reader.readAsDataURL(blob);
//     });
// }


type PhotoInputComponentProps = {
    value?: string | null;
    onChange?: (value: string) => void;
}

function PhotoInputComponent({ value, onChange }: PhotoInputComponentProps) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>();
    const t = useTranslations()

    const filesChangeHandler = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        const firstFile = files?.[0]
        if (!firstFile) return;
        const imageB64 = await resizeFile(firstFile)
        if (!imageB64) return;
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
                className="hidden" />
            <Button type="button" className="w-full flex h-[35px] items-center justify-center gap-3 rtl:font-noto-hebrew"
                onClick={() => inputRef.current?.click()}>
                <UploadIcon /> <span>{t("upload_selfie")}</span>
            </Button>
            {
                capturedPhoto &&
                <div className="mt-5">
                    <ImagePreviewPopup image={capturedPhoto} />
                </div>
            }
        </div >
    )
}




type ImagePreviewPopupProps = {
    image: string;
}

function ImagePreviewPopup({ image }: ImagePreviewPopupProps) {
    return (
        <Dialog>
            <DialogTrigger className="w-full relative rounded overflow-hidden">
                <Image src={image} alt="" width={500} height={300}
                    className="w-full aspect-video object-cover object-center h-auto shadow shadow-gray-500" />
                <div className="p-1 absolute top-0 right-0 bg-gradient-to-bl from-black/10 to-transparent">
                    <ZoomInIcon className="w-6 h-6  text-white" />
                </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg h-screen max-h-[90vh] p-0 flex items-center justify-center bg-white">
                <Image src={image} alt="" width={600} height={600} className="aspect-auto w-full h-auto" />
            </DialogContent>
        </Dialog>
    )
}