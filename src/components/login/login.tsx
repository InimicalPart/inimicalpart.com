
import { signIn } from "@/utils/next-auth/auth"
import { DiscordIcon } from "../icons/misc"
import { Button } from "@nextui-org/button"
import { Card, CardBody } from "@nextui-org/react"
 
export function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("discord")
      }}
      className="flex justify-center items-center"
    >
            <Card className="w-[300px] py-5 px-2 bg-[#2c2f33] rounded-xl shadow-lg flex">
                <CardBody className="justify-center">
                    <Button startContent={<DiscordIcon/>} type="submit" className="bg-[#647fe2] rounded-lg">
                        Sign in with Discord
                    </Button>
                </CardBody>
            </Card>
    </form>
  )
} 