import { Card, CardContent } from "~/components/ui/card";
import Image from 'next/image'
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
import { getServerAuth } from "~/server/auth";
import { trpcClient } from "~/utils/api";
import { femaleGallerySvg, maleGallerySvg } from "~/utils/icons";




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
        <main className="min-h-screen p-5 pb-[65px]">
            <div className="flex items-center justify-center">
                <h2 className="text-lg border-b-2 border-primary text-center font-light text-secondary font-solway">
                    Singles at Wedding
                </h2>
            </div>
            <div className="mt-8">
                {
                    isLoading || !users ?
                        <div className="w-full h-screen flex items-center justify-center">
                            <div className="w-40 h-40 aspect-square border-2 border-white rounded-full border-t-transparent animate-spin" />
                        </div>
                        :
                        (
                            !users || users.length <= 0 ?
                                <div className="w-full h-screen flex items-center justify-center">
                                    <p className="text-secondary font-solway font-medium">No users found with your interest.</p>
                                </div>
                                :
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6  gap-5">
                                    {
                                        users?.map((user) => (
                                            <div key={user.id} className="shadow-2xl shadow-gray-600 relative rounded-xl bg-primary pl-2 pt-2">
                                                <div className="rounded-xl relative overflow-hidden bg-white">
                                                    <Image src={user.image}
                                                        alt="" width={200} height={300}
                                                        className="w-full object-cover object-center rounded-xl h-[180px] xs:h-[250px] md:h-[300px]" />
                                                    <div className="p-2 flex items-end justify-between absolute bottom-0 bg-gradient-to-t from-black from-50% to-transparent w-full">
                                                        <div>
                                                            <h3 className="text-white font-solway text-lg leading-none">
                                                                {user.name}
                                                            </h3>
                                                            <p className="text-[10px] md:text-xs text-white font-solway">
                                                                {
                                                                    user.side === "BRIDE" ?
                                                                        "From Bride's Side"
                                                                        :
                                                                        "From Groom's Side"

                                                                }
                                                            </p>
                                                            <p className="text-[9px] md:text-xs text-primary font-solway leading-none">Interested in <span className="capitalize">{user.gender.toLowerCase()}</span></p>
                                                        </div>
                                                        <div className="pr-2">
                                                            {
                                                                user.gender === "MALE" ?
                                                                    maleGallerySvg
                                                                    : femaleGallerySvg
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    }
                                </div>

                        )
                }
            </div>
        </main>
    );
}
