// "use client"

import Etc from "./etc"
import { currentUser, User } from "@clerk/nextjs/server"

export default async function Offense({
    params
}: {
    params: {OFFENSE_ID: string}
}) {

    const user = await currentUser()

    return <Etc params={params} session={{username: user?.username as string, imageUrl: user?.imageUrl as string, firstName: user?.firstName as string, discord: {id: user?.externalAccounts[0].externalId, username: user?.externalAccounts[0].username} }}/>
}