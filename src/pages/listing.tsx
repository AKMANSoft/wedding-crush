import { Card, CardContent } from "~/components/ui/card";
import Image from 'next/image'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { getServerAuth } from "~/server/auth";
import { trpcClient } from "~/utils/api";




export const getServerSideProps: GetServerSideProps = async (ctx) => {
    const session = await getServerAuth(ctx)
    if (!session) {
        return {
            redirect: {
                destination: "/join",
                permanent: false,
            }
        }
    }
    return { props: {} }
}



export default function Page() {
    const { data: users, isLoading } = trpcClient.users.getByInterest.useQuery({ page: 1, perPage: -1 })

    return (
        <main className="min-h-screen p-5">
            {
                isLoading || !users ?
                    <div className="w-full h-screen flex items-center justify-center">
                        <div className="w-40 h-40 aspect-square border-2 border-white rounded-full border-t-transparent animate-spin" />
                    </div>
                    :
                    (
                        users && users.length <= 0 ?
                            <div className="w-full h-screen flex items-center justify-center">
                                <p className="text-white font-medium">No users found with your interest.</p>
                            </div>
                            :
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-5">
                                {
                                    users?.map((user) => (
                                        <Card key={user.name} className="bg-white rounded-md overflow-hidden">
                                            <CardContent className="p-0">
                                                <Image src={user.image}
                                                    alt="" width={200} height={300}
                                                    className="w-full object-cover bg-black object-center h-[200px] md:h-[250px]" />
                                                <div className="p-1 px-3">
                                                    <h3 className="text-base font-bold">
                                                        {user.name}
                                                    </h3>
                                                    <p className="text-xs">Gender: <span className="font-semibold">{user.gender}</span></p>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                }
                            </div>

                    )
            }
        </main>
    );
}
