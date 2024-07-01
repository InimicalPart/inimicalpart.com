
import { signOut } from "@/utils/next-auth/auth"
import { Button } from "@nextui-org/button"
 
export function SignOut() {
  return (
    <form
      action={async () => {
        "use server"
        await signOut()
      }}
    >
      <Button type="submit" className="w-[150px] h-8">
        Sign out
      </Button>
    </form>
  )
} 