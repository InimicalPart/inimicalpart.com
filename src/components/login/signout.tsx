"use client";

import { useClerk } from "@clerk/nextjs";
import { Button } from "@nextui-org/button"
 
export default function SignOut() {

    const {signOut} = useClerk()

  return (
      <Button type="submit" className="min-w-[200px] h-8" onClick={() => signOut({redirectUrl: "/"})}>
        Sign out
      </Button>
  )
} 