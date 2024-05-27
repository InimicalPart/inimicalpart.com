import { Button } from "@nextui-org/button";
import NextLink from "next/link";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center h-[100%]">
            <h1 className="text-4xl font-bold">Whoops!</h1>
            <p className="text-lg">It seems you've reached a page that doesn't exist.</p>
            <br/>
            <Button
                href="/"
                as={NextLink}
                color="primary"
                variant="solid"
                >
                Go back home
            </Button>
        </div>
    )
}