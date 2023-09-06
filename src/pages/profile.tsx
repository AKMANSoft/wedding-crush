import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Gender, User, UserInterest, UserSide } from "@prisma/client";
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from "~/components/ui/input";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Button } from "~/components/ui/button";
import ChipsGroup from "~/components/ui/chips-group";
import { UploadIcon } from "@radix-ui/react-icons";
import { trpcClient } from "~/utils/api";
import { bothGenderSvg, brideIconSvg, femaleSvg, groomIconSvg, maleSvg } from "~/utils/icons";
import Resizer from "react-image-file-resizer";
import Image from 'next/image'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { getAuthUser, getServerAuth } from "~/server/auth";
import { useTranslations } from 'next-intl';




export const getServerSideProps: GetServerSideProps<{ authUser?: User | null }> = async (ctx) => {
    const session = await getServerAuth(ctx)
    if (!session) {
        return {
            redirect: {
                destination: "/join",
                permanent: false,
            }
        }
    }
    const authUser = await getAuthUser(session);
    return {
        props: {
            authUser,
            messages: (await import(`../../locales/${ctx.locale}.json`)).default
        }
    }
}





export const updateProfileSchema = z.object({
    name: z.string({ required_error: "field_required" }).optional(),
    image: z.string({ required_error: "photo_required" }).optional(),
    gender: z.enum([Gender.MALE, Gender.FEMALE], { required_error: "field_required" }).optional(),
    interest: z.enum([UserInterest.MALE, UserInterest.FEMALE, UserInterest.BOTH], { required_error: "field_required" }).optional(),
    side: z.enum([UserSide.GROOM, UserSide.BRIDE], { required_error: "field_required" }).optional(),
    password: z.string({ required_error: "field_required" }).optional().default("")
})

type UpdateProfileSchema = z.infer<typeof updateProfileSchema>


export default function Page({ authUser }: InferGetServerSidePropsType<typeof getServerSideProps>) {
    const t = useTranslations()
    const form = useForm<UpdateProfileSchema>({
        resolver: zodResolver(updateProfileSchema),
        mode: "onSubmit",
        shouldFocusError: false,
        defaultValues: {
            name: authUser?.name,
            gender: authUser?.gender,
            interest: authUser?.interest,
            side: authUser?.side,
            image: authUser?.image,
        }
    })
    const { mutateAsync } = trpcClient.users.update.useMutation()




    const handleFormSubmit = async (data: UpdateProfileSchema) => {
        const res = await mutateAsync(data)
        if (res) {
            window.location.reload()
        }
    }


    return (
        <main className=" flex min-h-screen flex-col items-center justify-center py-32 px-4 bg-primary">
            {
                authUser &&
                <Card className="w-full max-w-[600px] rounded-md bg-white pb-5">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                            <CardContent className="p-6 px-5 relative">
                                <div className="absolute -top-[80px] bg-white border-[5px] border-primary rounded-full left-1/2 w-[118px] h-[118px] aspect-square -translate-x-1/2">
                                    <Image src={form.getValues("image") ?? ""} alt={authUser.name} width={114} height={114}
                                        className="w-full h-full object-cover object-center rounded-full" />
                                </div>
                                <div className="space-y-[22px]">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field, fieldState }) => (
                                            <FormItem>
                                                <FormLabel>{t("name")}</FormLabel>
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
                            <CardFooter className="flex items-center mt-10 justify-between">
                                <div></div>
                                <Button type="submit" disabled={form.formState.isSubmitting || !form.formState.isDirty} className="w-full h-[39px] rtl:font-noto-hebrew">
                                    {
                                        form.formState.isSubmitting ?
                                            <span className="w-5 h-5 border-2 border-white rounded-full border-t-transparent animate-spin" />
                                            :
                                            t("update")
                                    }
                                </Button>
                            </CardFooter>
                        </form>
                    </Form>
                </Card>
            }
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
    const t = useTranslations()
    const inputRef = useRef<HTMLInputElement>(null);
    const [capturedPhoto, setCapturedPhoto] = useState<string | null>();

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
            <Button type="button" className="w-full flex items-center justify-center gap-3 h-[35px] rtl:font-noto-hebrew"
                onClick={() => inputRef.current?.click()}>
                <UploadIcon /> <span>{t("update_selfie")}</span>
            </Button>
        </div >
    )
}
