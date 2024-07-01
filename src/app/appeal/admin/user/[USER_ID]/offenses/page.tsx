import { SignOut } from "@/components/login/signout";
import { auth } from "@/utils/next-auth/auth";
import { connectToIRIS } from "@/utils/iris";
import { Spacer } from "@nextui-org/react";
import { redirect } from "next/navigation";
import { SignIn } from "@/components/login/login";


export default async function Page() {
    return redirect("/appeal/admin")
}