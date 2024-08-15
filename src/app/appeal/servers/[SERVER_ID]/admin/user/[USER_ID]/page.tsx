import SignOut from "@/components/login/signout";
import { connectToIRIS } from "@/utils/iris";
import { Spacer } from "@nextui-org/react";
import Etc from "./etc";
import { currentUser } from "@clerk/nextjs/server";
import BackToServerList from "@/components/misc/backToServerList";

declare const global: ICOMGlobal

export default async function Page({
    params
}: {
    params: {
        USER_ID: string,
        SERVER_ID: string
    }
}) {
    const user = await currentUser()

    try {
        const server = global.servers[params.SERVER_ID]
        if (!server) throw new Error("Server not available")
        
        const botConnection = global.connections[server.managingBot]
        if (!botConnection || !botConnection.verified)  throw new Error("Server not available")
    } catch (e) {
        return <div className="text-center">
            <h1 className="text-xl font-bold">Whoops!</h1>
            <Spacer y={3}/>
            <p className="font-bold">This server is currently unavailable. Please try again later.</p>
            <Spacer y={7}/>
            <div className="flex flex-col gap-2 justify-center items-center">
                <BackToServerList />
                <SignOut/>
            </div>
        </div>
    }



    return <Etc SERVER_ID={params.SERVER_ID} session={{username: user?.username as string, imageUrl: user?.imageUrl as string, firstName: user?.firstName as string, discord: {id: user?.externalAccounts[0].externalId, username: user?.externalAccounts[0].username} }} userID={params.USER_ID} />

}