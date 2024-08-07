"use client";

import { useClerk } from "@clerk/nextjs";
import { Button } from "@nextui-org/button"
 
export default function SignOut() {

    const {signOut} = useClerk()

  return (
      <Button type="submit" className="w-[150px] h-8" onClick={() => signOut({redirectUrl: "/"})}>
        Sign out
      </Button>
  )
} 