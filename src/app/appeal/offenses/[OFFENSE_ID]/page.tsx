// "use client"

import { auth } from "@/utils/next-auth/auth"
import { Button, Card, CardBody, CardHeader, Chip, Divider, Link } from "@nextui-org/react"
import { redirect } from "next/navigation"
import Etc from "./etc"
import { SignIn } from "@/components/login/login"

export default async function Offense({
    params
}: {
    params: {OFFENSE_ID: string}
}) {

    const session = await auth()
    if (!session) return <>{SignIn()}</>

    return <Etc params={params} session={session} />
}