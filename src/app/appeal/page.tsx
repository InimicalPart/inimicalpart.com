import {SignIn} from "@/components/login/login";
import { auth } from "@/utils/next-auth/auth";
import { redirect } from "next/navigation";


export default async function Page() {

    const session = await auth()
    if (!session) return <>{SignIn()}</>
    else redirect("/appeal/offenses")
}