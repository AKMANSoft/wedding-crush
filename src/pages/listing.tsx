import { Card, CardContent } from "~/components/ui/card";
import Image from 'next/image'


const users = [
    {
        name: "User 1",
        photo: '/images/photo-1.jpg',
        gender: "FEMALE"
    },
    {
        name: "User 2",
        photo: '/images/photo-2.jpg',
        gender: "MALE"
    },
    {
        name: "User 3",
        photo: '/images/photo-3.jpg',
        gender: "MALE"
    },
    {
        name: "User 1",
        photo: '/images/photo-1.jpg',
        gender: "FEMALE"
    },
    {
        name: "User 2",
        photo: '/images/photo-2.jpg',
        gender: "MALE"
    },
    {
        name: "User 3",
        photo: '/images/photo-3.jpg',
        gender: "MALE"
    },
    {
        name: "User 1",
        photo: '/images/photo-1.jpg',
        gender: "FEMALE"
    },
    {
        name: "User 2",
        photo: '/images/photo-2.jpg',
        gender: "MALE"
    },
    {
        name: "User 3",
        photo: '/images/photo-3.jpg',
        gender: "MALE"
    },
    {
        name: "User 1",
        photo: '/images/photo-1.jpg',
        gender: "FEMALE"
    },
    {
        name: "User 2",
        photo: '/images/photo-2.jpg',
        gender: "MALE"
    },
    {
        name: "User 3",
        photo: '/images/photo-3.jpg',
        gender: "MALE"
    },
]


export default function Page() {
    return (
        <main className="min-h-screen p-5">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-5">
                {
                    users.map((user) => (
                        <Card key={user.name} className="bg-white rounded-md overflow-hidden">
                            <CardContent className="p-0">
                                <Image src={user.photo}
                                    alt="" width={200} height={300}
                                    className="w-full object-cover object-center h-[200px] md:h-[250px]" />
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
        </main>
    );
}
