import { Spacer, Spinner } from "@nextui-org/react";

export default function Loading({
    isSigningOut = false
}: {
    isSigningOut?: boolean
}) {
    return  <div className="text-center">
        <h1 className="text-xl font-bold">{isSigningOut ? "Signing out..." : "Loading..."}</h1>
        <Spacer y={7}/>
        <Spinner/>
    </div>
}