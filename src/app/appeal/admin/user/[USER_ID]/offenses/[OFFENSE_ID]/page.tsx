import { SignOut } from "@/components/login/signout";
import { auth } from "@/utils/next-auth/auth";
import { connectToIRIS } from "@/utils/iris";
import { Spacer } from "@nextui-org/react";
import Etc from "./etc";
import { redirect } from "next/navigation";
import { SignIn } from "@/components/login/login";


export default async function Page({
    params
}: {
    params: {
        USER_ID: string,
        OFFENSE_ID: string
    }
}) {
    const session = await auth()
    if (!session) return <>{SignIn()}</>

    try {
        await connectToIRIS()
    } catch (e) {
        return <div className="text-center">
            <h1 className="text-xl font-bold">Whoops!</h1>
            <Spacer y={3}/>
            <p className="font-bold">IRIS is currently unavailable. Please try again later.</p>
            <Spacer y={7}/>
            <>{SignOut()}</>
        </div>
    }



    return <Etc session={session} OFFENSE_ID={params.OFFENSE_ID} USER_ID={params.USER_ID} />

}