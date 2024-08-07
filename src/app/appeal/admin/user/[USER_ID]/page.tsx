import SignOut from "@/components/login/signout";
import { connectToIRIS } from "@/utils/iris";
import { Spacer } from "@nextui-org/react";
import Etc from "./etc";
import { currentUser } from "@clerk/nextjs/server";


export default async function Page({
    params
}: {
    params: {
        USER_ID: string
    }
}) {
    const user = await currentUser()

    try {
        await connectToIRIS()
    } catch (e) {
        return <div className="text-center">
            <h1 className="text-xl font-bold">Whoops!</h1>
            <Spacer y={3}/>
            <p className="font-bold">IRIS is currently unavailable. Please try again later.</p>
            <Spacer y={7}/>
            <SignOut/>
        </div>
    }



    return <Etc session={{username: user?.username as string, imageUrl: user?.imageUrl as string, firstName: user?.firstName as string, discord: {id: user?.externalAccounts[0].externalId, username: user?.externalAccounts[0].username} }} userID={params.USER_ID} />

}