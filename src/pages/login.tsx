import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "~/components/ui/form";
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { signIn } from 'next-auth/react'
import { useRouter } from 'next/navigation'




// export const getServerSideProps: GetServerSideProps = async (ctx) => {
//     const session = await getServerAuth(ctx)
//     if (session?.user) {
//         return {
//             redirect: {
//                 destination: "/profile",
//                 permanent: false,
//             }
//         }
//     }
//     return { props: {} }
// }



export const loginSchema = z.object({
    username: z.string({ required_error: "This field is required." }),
    password: z.string({ required_error: "This field is required." }),
    info: z.string({ required_error: "This field is required." }).optional().default("")
})

type LoginSchema = z.infer<typeof loginSchema>


export default function Page() {
    const router = useRouter()
    const form = useForm<LoginSchema>({
        resolver: zodResolver(loginSchema),
        mode: "onSubmit",
        shouldFocusError: false
    })


    const handleFormSubmit = async (data: LoginSchema) => {
        const res = await signIn("credentials", {
            callbackUrl: "/gallery",
            redirect: false,
            username: data.username,
            password: data.password,
        })
        if (!res?.ok || res.error) {
            if (res?.error === "ACCOUNT_NOT_FOUND") {
                form.setError("username", {
                    message: "Account not found!",
                    type: "validate"
                })
            } else if (res?.error === "WRONG_PASSWORD") {
                form.setError("password", {
                    message: "Wrong password!",
                    type: "validate"
                })
            } else {
                form.setError("info", {
                    message: "Some error occured while processing your request, please try again.",
                    type: "validate"
                })
            }
            return;
        }
        router.push("/profile")
    }

    return (
        <main className=" flex min-h-screen flex-col items-center justify-center py-10 px-4 bg-primary">
            <Card className="w-full max-w-[600px] rounded-md bg-white pb-5">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleFormSubmit)}>
                        <CardContent className="p-6 px-5">
                            <div className="flex items-center justify-center">
                                <h2 className="text-lg border-b-2 border-primary text-center font-light text-secondary font-solway rtl:font-noto-hebrew">
                                    Please fill details below to login
                                </h2>
                            </div>
                            <div className="space-y-[22px] mt-8">
                                <FormField
                                    control={form.control}
                                    name="username"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormLabel>Username</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            {fieldState.error && <FormMessage />}
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" {...field} />
                                            </FormControl>
                                            {fieldState.error && <FormMessage />}
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="info"
                                    render={({ fieldState }) => (
                                        <FormItem>
                                            {fieldState.error && <FormMessage />}
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </CardContent>
                        <CardFooter className="flex items-center justify-between">
                            <div></div>
                            <Button type="submit" disabled={form.formState.isSubmitting} className="w-full h-[39px]">
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

