"use client"

import Loading from "@/components/loading"
import { Accordion, AccordionItem, Avatar, Button, Divider, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Link, Spacer, Tooltip } from "@nextui-org/react"
import { useEffect, useState } from "react"
import prettyMilliseconds from "pretty-ms"
import { redirect } from "next/navigation"
import { PriorityIcon, SearchIcon, UserIcon } from "@/components/icons/misc"
import Image from "next/image"
import { useClerk } from "@clerk/nextjs"


type UInfo = {
  user: {
    id: string;
    username: string;
    name: string;
    image: string;
  },
  offenses: {
    id: string;
    violated_at: string;
    status: string;
    appealed_at: string;
    appealStatus: string;
  }[]
}

const priorityFormula = (informationA: UInfo, informationB: UInfo): number => {

  //! All offenses with the status of "APPEALED" and appealStatus of "OPEN" are considered priority (+1), and they need to be sorted by the date they were appealed, the oldest first.

  const aPriority = informationA.offenses.filter((offense) => offense.status === "APPEALED" && offense.appealStatus === "OPEN").length > 0 ? 1 : 0
  const bPriority = informationB.offenses.filter((offense) => offense.status === "APPEALED" && offense.appealStatus === "OPEN").length > 0 ? 1 : 0

  const aOldest = new Date(informationA.offenses.filter((offense) => offense.status === "APPEALED" && offense.appealStatus === "OPEN").sort((a: any, b: any) => {
    if (!a.appealed_at && !b.appealed_at) return 0
    if (!a.appealed_at && b.appealed_at) return -1
    if (a.appealed_at && !b.appealed_at) return 1
    return new Date(a.appealed_at).getTime() - new Date(b.appealed_at).getTime()
  })[0]?.appealed_at ?? Date.now()).getTime() 
  const bOldest = new Date(informationB.offenses.filter((offense) => offense.status === "APPEALED" && offense.appealStatus === "OPEN").sort((a: any, b: any) => {
      if (!a.appealed_at && !b.appealed_at) return 0
      if (!a.appealed_at && b.appealed_at) return -1
      if (a.appealed_at && !b.appealed_at) return 1
      return new Date(a.appealed_at).getTime() - new Date(b.appealed_at).getTime()
    })[0]?.appealed_at ?? Date.now()).getTime()


  const aExtra = (Date.now() - aOldest) > (Date.now() - bOldest) ? 1 : 0
  const bExtra = (Date.now() - bOldest) > (Date.now() - aOldest) ? 1 : 0
    
  const totalAPriority = aPriority + aExtra
  const totalBPriority = bPriority + bExtra

  return totalBPriority - totalAPriority
}


export default function Etc({ session: user, SERVER_ID }: { session: any, SERVER_ID: string }) {
    const appealURLPrefix = `/servers/${SERVER_ID}`

    const apiLoc = process.env.NODE_ENV == "development" ? `http://appeal.localhost:3000/api/servers/${SERVER_ID}` : `https://appeal.inimicalpart.com/api/servers/${SERVER_ID}`


    const [loading, setLoading] = useState(true)
    const [isSigningOut, setSigningOut] = useState(false)
    const [isAdmin, setIsAdmin] = useState(null)
    const [serverInfo, setServerInfo] = useState({} as any)
    const [nextUpdate, setNextUpdate] = useState(Date.now() + 300000)
    const [nextUpdateString, setNextUpdateString] = useState("5 minutes")
    const [search, setSearch] = useState("")
    const [isPriority, setPriority] = useState(false)

    const [users, setUsers] = useState<UInfo[]>([] as any)

    const { signOut, redirectToUserProfile } = useClerk();


    useEffect(() => {
      Promise.all([
      fetch(apiLoc + "/is-admin")
      .then(res=>res.json())
      .then(data=>{
        setIsAdmin(data.admin)
      }),
      fetch(apiLoc + "/server-info")
      .then(res=>res.json())
      .then(data=>{
        setServerInfo(data.serverInfo)
      }),
      fetch(apiLoc + "/admin/users")
      .then(res=>res.json())
      .then(data=>{

        if (data.error == "UNAVAILABLE") {
          redirect(appealURLPrefix + "/")
        }


        setUsers(
          data.users.toSorted((a: any, b: any) => {
            const aDate = new Date(
              a.offenses.toSorted((a: any, b: any) =>
                new Date(a.violated_at).getTime() - new Date(b.violated_at).getTime()
              )[0].violated_at
            ).getTime()
            const bDate = new Date(
              b.offenses.toSorted((a: any, b: any) =>
                new Date(a.violated_at).getTime() - new Date(b.violated_at).getTime()
              )[0].violated_at
            ).getTime()
            return bDate - aDate
          })
        )
        setNextUpdate(Date.now() + 300000)
      })]).then(()=>{
        setLoading(false)
      })  
    }, [appealURLPrefix, apiLoc])

    useEffect(() => {
        if (isAdmin === false) {
            redirect(appealURLPrefix + "/")
        }
    }, [isAdmin, appealURLPrefix])

    useEffect(() => {
      const interval = setInterval(() => {
        fetch(apiLoc + "/admin/users")
        .then(res=>res.json())
        .then(data=>{

          if (data.error == "UNAVAILABLE") {
            redirect(appealURLPrefix + "/")
          }

          setUsers(
            data.users.toSorted((a: any, b: any) => {
              const aDate = new Date(
                a.offenses.toSorted((a: any, b: any) =>
                  new Date(a.violated_at).getTime() - new Date(b.violated_at).getTime()
                )[0].violated_at
              ).getTime()
              const bDate = new Date(
                b.offenses.toSorted((a: any, b: any) =>
                  new Date(a.violated_at).getTime() - new Date(b.violated_at).getTime()
                )[0].violated_at
              ).getTime()
              return bDate - aDate
            })
          )

          setNextUpdate(Date.now() + 300000)
        })
      }, nextUpdate - Date.now())
      return () => clearInterval(interval)
    }, [nextUpdate,  appealURLPrefix, apiLoc])

    useEffect(() => {
      const interval = setInterval(() => {
        setNextUpdateString(prettyMilliseconds(nextUpdate - Date.now(), {verbose: true, secondsDecimalDigits: 0}))
      }, 100)
      return () => clearInterval(interval)
    }, [nextUpdate])



    return (loading ? <Loading isSigningOut={isSigningOut}/> : <div>
      <div className="flex  w-full -mt-10 justify-end items-center mb-5 sm:mb-0">
        <Tooltip content="Switch to User Mode">
          <Link href={appealURLPrefix + "/offenses"}>
              <Button color="default" variant="bordered" radius="lg" className="rounded-full px-0 min-w-0 min-h-0 py-0 h-12 w-12 mr-3">
                <UserIcon/>
              </Button>
          </Link>
        </Tooltip>
      <Dropdown placement="bottom" showArrow>
        <DropdownTrigger>
          <Avatar
            as="button"
            isBordered={true}
            src={user.imageUrl}
            className="transition-transform"
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2 cursor-default" isReadOnly>
            <p className="font-bold">Signed in as</p>
            <p className="font-bold">@{user.username}</p>
          </DropdownItem>
          <DropdownItem key="switch" color="primary" className="text-primary" onClick={() => window.location.href="/"}>
             Switch Servers
          </DropdownItem>
          <DropdownItem key="manage" color="primary" className="text-primary" onClick={() => redirectToUserProfile()}>
             Manage Account
          </DropdownItem>
          <DropdownItem key="logout" color="danger" className="text-danger" onClick={() => {
            setLoading(true)
            setSigningOut(true)
            signOut({ redirectUrl: '/' })
          }}>
            Log Out
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      </div>
    <div className="w-full text-center items-center justify-items-center content-center flex flex-col">
      <h1 className="font-bold text-3xl mb-1">Users with offenses</h1>
      <Tooltip content={serverInfo.name + " (" + serverInfo.id + ")"} placement="bottom" closeDelay={100} delay={0}>
        <div className="flex items-center justify-center gap-2">
          <Avatar src={serverInfo.icon} size="sm" />
          <p className="text-sm">{serverInfo.name}</p>
        </div>
      </Tooltip>
      {isPriority ? <p className="text-sm dark:text-gray-400 text-gray-500 mt-1">Priority mode enabled. Appealed offenses will be shown first in the oldest to newest order.</p> : ""}
    </div>
    <Spacer y={10}/>
    { users.length === 0 ? <div className="text-center"><p className="text-gray-500 italic decoration-wavy">No offenses found.</p> </div> :
    <>
    <div className="flex flex-row gap-2">
    <Input
      placeholder="Type to search..."
      label="Search"
      isClearable
      radius="lg"
      onClear={() => setSearch("")}
      onChange={(e) => setSearch(e.target.value)}
      startContent={
        <SearchIcon />
      }
      className="mb-2"
      />
      <Tooltip content="Toggle Priority Mode">
        <Button color="default" size="sm" variant={isPriority ? "solid" : "flat"} className="h-14 w-14" onClick={() => setPriority(!isPriority)}>
          <PriorityIcon />
        </Button>
      </Tooltip>
      </div>
    <Accordion variant="shadow">

      {
        users
        .toSorted((a: any, b: any) => isPriority ? priorityFormula(a, b) : 0)
        .map((user, index) => {

            const totalOffenses = user.offenses.length
            const plural = totalOffenses === 1 ? "" : "s"

            const revokedOffenses = user.offenses.filter((offense: any) => offense.status === "REVOKED").length
            const deniedOffenses = user.offenses.filter((offense: any) => offense.appealStatus === "DENIED").length
            const activeOffenses = user.offenses.filter((offense: any) => offense.status === "ACTIVE" && offense.appealStatus !== "DENIED").length
            const appealedOffenses = user.offenses.filter((offense: any) => offense.status === "APPEALED").length

            let matchesSearch: any = false
            try {
              matchesSearch = user.user.name.toLowerCase().match(search.toLowerCase()) || ("@" + user.user.username).toLowerCase().match(search.toLowerCase()) || user.user.id.toLowerCase().match(search.toLowerCase())
            } catch (e) {
              matchesSearch = false
            }

            return (
              <AccordionItem key={user.user.id} hidden={!matchesSearch} aria-label={`${user.user.name} (@${user.user.username})`} title={<p className="align-baseline">{user.user.name} <Tooltip content={"ID: " + user.user.id}><span className="text-gray-500 text-medium">(@{user.user.username})</span></Tooltip></p>} startContent={<Image src={user.user.image} alt={user.user.username + "'s profile picture"} width={32} height={32} className="rounded-full"/>} subtitle={<><p><b>{totalOffenses}</b> total offense{plural} · Latest: <span className="font-medium">{new Date(user.offenses.toSorted((a,b)=>new Date(b.violated_at).getTime() - new Date(a.violated_at).getTime())[0].violated_at).toLocaleString()}</span></p><p><b>{activeOffenses}</b> active, <b>{appealedOffenses}</b> appealed, <b>{revokedOffenses}</b> revoked, <b>{deniedOffenses}</b> denied</p></>}>
                <div className="grid mb-5">
                  <Divider className="mb-5 w-full"/>
                    <div className="flex items-center justify-between w-[90%] justify-self-center flex-col sm:flex-row">
                    <Tooltip content={
                        <div className="flex flex-col gap-2">
                          <b>Offenses that are active and have not been appealed.</b>
                          {activeOffenses > 0 ? <br/> : ""}
                          {activeOffenses > 0 ? user.offenses.toSorted((a,b)=>new Date(b.violated_at).getTime() - new Date(a.violated_at).getTime()).filter((offense: any) => offense.status === "APPEALED").slice(0,5).map((offense: any) => {
                            return (
                              <div key={offense.id} className="flex gap-2">
                                <p>{offense.rule_index}. {offense.violation} · <span>{new Date(offense.violated_at).toLocaleString()}</span> · <span>#{offense.id}</span></p>
                              </div>
                            )
                          }) : ""
                        }
                        {activeOffenses > 5 ? <p className="text-sm text-gray-400">+{activeOffenses - 5} more...</p> : ""}
                        </div>
                      
                      }>
                        <div className="flex items-center gap-2">
                            <p>{activeOffenses}</p>
                            <p className="text-sm">Active</p>
                        </div>
                      </Tooltip>
                      <Tooltip content={
                        <div className="flex flex-col gap-2">
                          <b>Offenses that have an active appeal.</b>
                          {appealedOffenses > 0 ? <br/> : ""}
                          {appealedOffenses > 0 ? user.offenses.toSorted((a,b)=>new Date(b.violated_at).getTime() - new Date(a.violated_at).getTime()).filter((offense: any) => offense.status === "APPEALED").slice(0,5).map((offense: any) => {
                            return (
                              <div key={offense.id} className="flex gap-2">
                                <p>{offense.rule_index}. {offense.violation} · <span>{new Date(offense.violated_at).toLocaleString()}</span> · <span>#{offense.id}</span></p>
                              </div>
                            )
                          }) : ""
                        }
                        {appealedOffenses > 5 ? <p className="text-sm text-gray-400">+{appealedOffenses - 5} more...</p> : ""}
                        </div>
                      
                      }>
                        <div className="flex items-center gap-2">
                            <p>{appealedOffenses}</p>
                            <p className="text-sm">Appealed</p>
                        </div>
                      </Tooltip>
                      <Tooltip content={
                        <div className="flex flex-col gap-2">
                          <b>Offenses that were made in error, and have been revoked by an admin.</b>
                          {revokedOffenses > 0 ? <br/> : ""}
                          {revokedOffenses > 0 ? user.offenses.toSorted((a,b)=>new Date(b.violated_at).getTime() - new Date(a.violated_at).getTime()).filter((offense: any) => offense.status === "REVOKED").slice(0,5).map((offense: any) => {
                            return (
                              <div key={offense.id} className="flex gap-2">
                                <p>{offense.rule_index}. {offense.violation} · <span>{new Date(offense.violated_at).toLocaleString()}</span> · <span>#{offense.id}</span></p>
                              </div>
                            )
                          }) : ""
                        }
                        {revokedOffenses > 5 ? <p className="text-sm text-gray-400">+{revokedOffenses - 5} more...</p> : ""}
                        </div>
                      
                      }>
                        <div className="flex items-center gap-2">
                            <p>{revokedOffenses}</p>
                            <p className="text-sm">Revoked</p>
                        </div>
                      </Tooltip>
                      <Tooltip content={
                        <div className="flex flex-col gap-2">
                          <b>Offenses that have been appealed and denied by an admin.</b>
                          {deniedOffenses > 0 ? <br/> : ""}
                          {deniedOffenses > 0 ? user.offenses.toSorted((a,b)=>new Date(b.violated_at).getTime() - new Date(a.violated_at).getTime()).filter((offense: any) => offense.status === "APPEALED").slice(0,5).map((offense: any) => {
                            return (
                              <div key={offense.id} className="flex gap-2">
                                <p>{offense.rule_index}. {offense.violation} · <span>{new Date(offense.violated_at).toLocaleString()}</span> · <span>#{offense.id}</span></p>
                              </div>
                            )
                          }) : ""
                        }
                        {deniedOffenses > 5 ? <p className="text-sm text-gray-400">+{deniedOffenses - 5} more...</p> : ""}
                        </div>
                      
                      }>
                        <div className="flex items-center gap-2">
                            <p>{deniedOffenses}</p>
                            <p className="text-sm">Denied</p>
                        </div>
                      </Tooltip>
                    </div>
                  <Divider className="my-5 w-full"/>
                  </div>
                <div className="flex items-center justify-center mb-2 gap-2">
                  <Link href={appealURLPrefix+"/admin/user/" + user.user.id}>
                    <Button color="default" variant="flat" size="sm">View Offenses</Button>
                  </Link>
                </div>
              </AccordionItem>
              )
          
        })
      }
    </Accordion>

    <p className="text-center text-sm text-gray-400 mt-4">
      Next update in: <span className="font-bold">{nextUpdate - Date.now() < 1000 || nextUpdateString.startsWith("-") ? "Now" : nextUpdateString}</span>
    </p>
    </>
    }
    </div>)

}
function ord (n: number) {
  return n + (n > 0 ? ["th", "st", "nd", "rd"][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : "")
}