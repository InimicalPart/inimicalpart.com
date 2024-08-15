"use client";

import { useClerk } from "@clerk/nextjs";
import { Button } from "@nextui-org/button"
import { redirect } from "next/navigation";
import { useRouter } from "next/router";
 
export default function BackToServerList() {

  return (
      <Button type="submit" className="min-w-[200px] h-8" onClick={() => window.location.pathname = "/"}>
        Back to Server Selection
      </Button>
  )
} 