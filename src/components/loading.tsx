import { Spacer, Spinner } from "@nextui-org/react";

export default function Loading() {
    return  <div className="text-center">
        <h1 className="text-xl font-bold">Loading...</h1>
        <Spacer y={7}/>
        <Spinner/>
    </div>
}