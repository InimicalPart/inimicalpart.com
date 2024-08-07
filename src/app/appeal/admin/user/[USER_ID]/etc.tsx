"use client"

import Loading from "@/components/loading"
import { getServerInfo } from "@/utils/iris"
import { Accordion, AccordionItem, Avatar, Badge, Button, Checkbox, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Spacer, Textarea, Tooltip, User, useDisclosure } from "@nextui-org/react"
import { useEffect, useState } from "react"
import prettyMilliseconds from "pretty-ms"
import { redirect, useRouter } from "next/navigation"
import { AdminIcon, BackIcon } from "@/components/icons/misc"
import { useClerk } from "@clerk/nextjs"

type Offense = {
  id: string;
  rule_index: number;
  violation: string;
  offense_count: number;
  violated_at: string;
  punishment_type: string;
  status: string;
  expires_at: string | null;
  ends_at: string | null;
  original_duration: string | null;
  appeal: null | {
    status: "OPEN" | "APPROVED" | "DENIED" | "AYR";
    transcript: [
      {
        type: string,
        message?: string,
        status?: string,
        timestamp: string
        user_id: string
      }
    ]
  };
  action_taken_by: string;
  can_appeal: boolean;
}


export default function Etc({ session: sessionUser, userID }: { session: any, userID: string }) {

    const appealURLPrefix = process.env.NODE_ENV == "development" ? "" : ""
    const apiLoc = process.env.NODE_ENV == "development" ? "http://appeal.localhost:3000/api" : "https://appeal.inimicalpart.com/api"

    const [loading, setLoading] = useState(true)
    const [isSigningOut, setSigningOut] = useState(false)
    const [isAdmin, setIsAdmin] = useState(null)
    const [user, setUser] = useState({} as any)
    const [toggling, setToggling] = useState(false)
    const [isRevoking, setIsRevoking] = useState(false)
    const [focusedOffense, setFocusedOffense] = useState<Offense>({} as Offense)
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const [offenses, setOffenses] = useState<Offense[]>([])
    const [serverInfo, setServerInfo] = useState({} as any)
    const [nextUpdate, setNextUpdate] = useState(Date.now() + 300000)
    const [nextUpdateString, setNextUpdateString] = useState("5 minutes")

    const { signOut, redirectToUserProfile } = useClerk();



    useEffect(() => {
      Promise.all([
      fetch(apiLoc + "/user-info")
      .then(res=>res.json())
      .then(data=>{
        setIsAdmin(data.admin)
      }),
      fetch(apiLoc + "/admin/users/"+userID)
      .then(res=>res.json())
      .then(data=>{
        setUser(data.user)
      }),

      fetch(apiLoc + "/server-info")
      .then(res=>res.json())
      .then(data=>{
        setServerInfo(data.serverInfo)
      }),
      fetch(apiLoc + "/admin/users/"+userID+"/offenses")
      .then(res=>res.json())
      .then(data=>{

        if (data.error == "IRIS_UNAVAILABLE") {
          redirect(appealURLPrefix + "/")
        }

        setOffenses(data.offenses.toSorted((a: any, b: any) => new Date(a.violated_at).getTime() - new Date(b.violated_at).getTime()))
        setNextUpdate(Date.now() + 300000)
      })]).then(()=>{
        setLoading(false)
      })  
    }, [appealURLPrefix, userID, apiLoc])

    useEffect(() => {
      if (isAdmin === false) {
          redirect(appealURLPrefix + "/")
      }
  }, [isAdmin, apiLoc, appealURLPrefix])

    useEffect(() => {
      const interval = setInterval(() => {
        fetch(apiLoc + "/admin/users/"+userID+"/offenses")
        .then(res=>res.json())
        .then(data=>{

          if (data.error == "IRIS_UNAVAILABLE") {
            redirect(appealURLPrefix + "/")
          }

          setOffenses(data.offenses.toSorted((a: any, b: any) => new Date(a.violated_at).getTime() - new Date(b.violated_at).getTime()))
          setNextUpdate(Date.now() + 300000)
        })
      }, nextUpdate - Date.now())
      return () => clearInterval(interval)
    }, [nextUpdate, appealURLPrefix, apiLoc, userID])

    useEffect(() => {
      const interval = setInterval(() => {
        setNextUpdateString(prettyMilliseconds(nextUpdate - Date.now(), {verbose: true, secondsDecimalDigits: 0}))
      }, 100)
      return () => clearInterval(interval)
    }, [nextUpdate])

    function revokeOffense() {
      if (focusedOffense.status == "REVOKED") {
        return
      }

      setIsRevoking(true)
      fetch(apiLoc + "/admin/users/"+userID+"/offenses/"+focusedOffense.id+"/revoke", {
        method: "POST"
      })
      .then(res=>res.json())
      .then(data=>{
        if (data.error == "IRIS_UNAVAILABLE") {
          redirect(appealURLPrefix + "/")
        } else if (data.error == "INVALID_ACTION") {
          setNextUpdate(Date.now())
          setIsRevoking(false)
          onClose()
          return
      }

        setOffenses(data.offenses.toSorted((a: any, b: any) => new Date(a.violated_at).getTime() - new Date(b.violated_at).getTime()))
        onClose()
        setIsRevoking(false)
      })
    }


    function toggleAppeal(offense: Offense) {
      if (focusedOffense.status == "REVOKED") {
        return
      }

      setToggling(true)
      fetch(apiLoc + "/admin/users/"+userID+"/offenses/"+offense.id+"/toggle-appealment")
      .then(res=>res.json())
      .then(data=>{
        if (data.error == "IRIS_UNAVAILABLE") {
          redirect(appealURLPrefix + "/")
        } else if (data.error == "INVALID_ACTION") {
          setNextUpdate(Date.now())
          setToggling(false)
          return
      }

        setOffenses(offenses.map(o=>{
          if (o.id == offense.id) {
            o.can_appeal = data.can_appeal
          }
          return o
        }))
        setToggling(false)
      })
    }


    return (loading ? <Loading isSigningOut={isSigningOut}/> : <div>
      <div className="flex w-full -mt-10 justify-between items-center">
      <Tooltip content="Go back">
        <Link href={appealURLPrefix + "/admin"}>
          <Button color="default" variant="light" radius="lg" className="rounded-full px-0 min-w-0 min-h-0 py-0 h-12 w-12">
            <BackIcon size={32} />
          </Button>
        </Link>
      </Tooltip>
      <Dropdown placement="bottom" showArrow>
        <DropdownTrigger>
          <Avatar
            as="button"
            isBordered={true}
            src={sessionUser.imageUrl}
            className="transition-transform"
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2 cursor-default" isReadOnly>
            <p className="font-bold">Signed in as</p>
            <p className="font-bold">@{sessionUser.username}</p>
          </DropdownItem>
          <DropdownItem key="logout" color="primary" className="text-primary" onClick={() => redirectToUserProfile()}>
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
      <Tooltip content={"@" + user.username + " (" + user.id + ")"} placement="top" closeDelay={100} delay={0}>
        <h1 className="font-bold text-3xl">{user.name}&apos;{user.name.endsWith("s") ? "" : "s"} offenses</h1>
      </Tooltip>
      <Tooltip content={serverInfo.name + " (" + serverInfo.id + ")"} placement="bottom" closeDelay={100} delay={0}>
        <div className="flex items-center justify-center gap-2">
          <Avatar src={serverInfo.icon} size="sm" />
          <p className="text-sm">{serverInfo.name}</p>
        </div>
      </Tooltip>
    </div>
    <Spacer y={10}/>
    { offenses.length === 0 ? <div className="text-center mb-10"><p className="text-gray-500 italic decoration-wavy">{user.name} has no offenses on record.</p> </div> :
    <><Accordion variant="shadow">

      {
        offenses.toReversed().map((offense, index) => {
          let shortenedPunishment = null;
          let punishmentDescription = null;
          let statusColor = "danger"
          let statusVariant = "flat"
          let statusDescription = null;

          switch (offense.punishment_type) {
            case "TEMPORARY_BANISHMENT":
              shortenedPunishment = "TEMP-BAN";
              break;
            case "PERMANENT_BANISHMENT":
              shortenedPunishment = "PERM-BAN";
              break;
            default:
              shortenedPunishment = offense.punishment_type;
              break;
          }


          switch (offense.punishment_type) {
            case "TEMPORARY_BANISHMENT":
              punishmentDescription = <p>Temporarily banned for <b>{offense.original_duration}</b>.</p>;
              break;
            case "TIMEOUT":
              punishmentDescription = <p>Timed out for <b>{offense.original_duration}</b>.</p>;
              break;
            case "PERMANENT_BANISHMENT":
              punishmentDescription = <p>Permanently banned.</p>;
              break;
            case "KICK":
              punishmentDescription = <p>Kicked.</p>;
              break;
            case "WARNING":
              punishmentDescription = <p>Warned.</p>;
              break;
          }


          const appealStatusDescriptionMap = {
            "APPROVED": "This appeal has been approved, and the punishment has been revoked.",
            "DENIED": "This appeal has been denyd, and the punishment remains active.",
            "OPEN": "This appeal is currently open, awaiting a staff member's review.",
            "AYR": "This appeal is awaiting the user's response."
        }
    
          const appealStatusColorMap = {
              "APPROVED": "success",
              "DENIED": "danger",
              "OPEN": "success",
              "AYR": "warning",
          }
      
      
          const appealStatusLookup = {
              "APPROVED": "Approved",
              "DENIED": "Denied",
              "OPEN": "Open",
              "AYR": "Awaiting Your Response",
          }

          switch (offense.status) {
            case "ACTIVE":
              statusColor = "danger";
              statusVariant = "flat";
              break;
            case "APPEALED":
              statusColor = "warning";
              statusVariant = "flat";
              break;
            case "REVOKED":
              statusColor = "success";
              statusVariant = "flat";
              break;
            case "EXPIRED":
              statusColor = "";
              statusVariant = "light";
              break;
            default:
              statusColor = "danger";
              statusVariant = "flat";
              break;
          }

          switch (offense.status) {
            case "ACTIVE":
              statusDescription = "This punishment is currently active, and counts towards the user's total offenses.";
              break;
            case "APPEALED":
              statusDescription = "This punishment has been appealed, and is pending review. During this time, the punishment is still active.";
              break;
            case "EXPIRED":
              statusDescription = "This punishment has expired, and no longer counts towards the user's total offenses.";
              break;
            case "REVOKED":
              statusDescription = "This punishment has been revoked by a staff member, and no longer counts towards the user's total offenses.";
              break;
            default:
              statusDescription = "This punishment is currently active, and counts towards the user's total offenses.";
              break;
          }


          
          const appealStatus = offense.appeal?.status || "OPEN";

          return <AccordionItem key={offense.id} className={offense.status == "REVOKED" ? "group opacity-40 hover:opacity-100 transition-opacity data-[open]:!opacity-100" : ""} aria-label={offense.rule_index + ". " + offense.violation} title={<div className={"inline-flex items-center gap-2 " + (offense.status == "REVOKED" ? "line-through" : "")}><p>{offense.rule_index}. {offense.violation}</p> <sub className="bottom-0 dark:text-gray-400">({ord(offense.offense_count)} offense)</sub></div>} subtitle={<>
              <Spacer y={1}/>
              <div className="flex gap-2">
                <Tooltip content={new Date(offense.violated_at).toString()} placement="top" closeDelay={50} delay={0}>
                  <Chip variant="flat" size="sm">{new Date(offense.violated_at).toLocaleString()}</Chip>
                </Tooltip>
                <Tooltip content={punishmentDescription} placement="top" closeDelay={50} delay={0} isDisabled={!punishmentDescription}>
                  <Chip variant={
                     offense.ends_at || offense.status == "REVOKED" ? (
                      new Date(offense.ends_at as string) > new Date() && offense.status !== "REVOKED" ? "flat" : "" as any
                    ) : "flat"
                  } color={
                    offense.ends_at || offense.status == "REVOKED" ? (
                      new Date(offense.ends_at as string) > new Date() && offense.status !== "REVOKED" ? "secondary" : "" as any
                    ) : "secondary"
                    } size={"sm"}>{shortenedPunishment}</Chip>
                </Tooltip>
                <Tooltip content={statusDescription} placement="top" closeDelay={50} delay={0} isDisabled={!statusDescription}>
                  <Chip variant={statusVariant as any} color={statusColor as any} size={"sm"}>{offense.status}</Chip>
                </Tooltip>
                {
                  offense.appeal ?
                  <Tooltip content={appealStatusDescriptionMap[appealStatus as keyof typeof appealStatusDescriptionMap]} placement="top" closeDelay={50} delay={0} isDisabled={!statusDescription}>
                    <Chip variant={statusVariant as any} color={appealStatusColorMap[appealStatus as keyof typeof appealStatusColorMap] as any} size={"sm"}>{appealStatusLookup[appealStatus as keyof typeof appealStatusLookup].toUpperCase()}</Chip>
                  </Tooltip> : null
                }
              </div>
            </>}>
              <div>
                <div className="w-full">
                  <ul className="list-disc list-inside">
                    <li>
                      <b>Offense ID:</b> #{offense.id}
                    </li>
                    <li>
                      <b>Violated rule:</b> {offense.rule_index}. {offense.violation}
                    </li>
                    <li>
                      <b>Violation count:</b> {ord(offense.offense_count)} offense
                    </li>
                    <li>
                      <b>Violated at:</b> {new Date(offense.violated_at).toLocaleString()}
                    </li>
                  </ul>
                  <Spacer y={2}/>
                  <ul className="list-disc list-inside">
                    <li>
                      <b>Offense Status:</b> {statusDescription}
                    </li>
                    <li>
                      <b>Appeal Status:</b> {
                        !offense.can_appeal ?
                        "Appealment disallowed" :
                            offense.appeal ? appealStatusLookup[appealStatus as keyof typeof appealStatusLookup] :
                            "Not appealed"
                      }
                    </li>

                  </ul>
                  <Spacer y={2}/>
                  <ul className="list-disc list-inside">
                    <li>
                      <b>Punishment:</b> <div className="inline-flex">{punishmentDescription}</div>
                    </li>
                    <li>
                      <b>Punishment ends:</b> {offense.ends_at ? new Date(offense.ends_at).toLocaleString() : "Never"}
                    </li>
                  </ul>
                </div>
                <div className="flex justify-end mb-2 mr-2 mt-5 sm:mt-2 gap-1">
                  <form action={toggleAppeal.bind(null, offense)} className={offense.appeal || !["ACTIVE", "APPEALED"].includes(offense.status) ? "hidden" : ""}>
                    <Button type="submit" color="default" isLoading={toggling} variant="flat" size="sm">{offense.can_appeal ? "Disallow Appealment" : "Allow Appealment"}</Button>
                  </form>
                  
                    <Button onClick={()=>{
                        setFocusedOffense(offense)
                        onOpen()
                      }}  color="danger" variant="flat" size="sm" isDisabled={["REVOKED"].includes(offense.status)} className={["APPROVED", "DENIED"].includes(appealStatus) ? "hidden" : ""}>Revoke Punishment</Button>
                  <Tooltip content="This offense does not have an appeal transcript." placement="top" closeDelay={50} delay={0} isDisabled={!!offense.appeal}>
                    <div>
                      <Link href={appealURLPrefix+"/admin/user/"+userID+"/offenses/"+offense.id} isDisabled={!offense.appeal}>
                        <Button color="default" variant="flat" size="sm">View Transcript</Button>
                      </Link>
                    </div>
                  </Tooltip>                  
                </div>
              </div>
            </AccordionItem>
          
        })
      }
    </Accordion>
    </>}

    <p className="text-center text-sm text-gray-400 mt-4">
      Next update in: <span className="font-bold">{nextUpdate - Date.now() < 1000 || nextUpdateString.startsWith("-") ? "Now" : nextUpdateString}</span>
    </p>

    <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h1>Revoke offense #{focusedOffense.id}</h1>
                <Spacer y={1}/>
                <div className="text-sm">
                  <p className="dark:text-gray-200">Violation</p>
                  <p className="font-normal">{focusedOffense.rule_index}. {focusedOffense.violation}</p>
                  <Spacer y={1}/>
                  <p className="dark:text-gray-200">Violated on</p>
                  <p className="font-normal">{new Date(focusedOffense.violated_at).toLocaleString()}</p>
                </div>
              </ModalHeader>
              <ModalBody className="text-center">
                <Spacer y={2}/>
                <p>Are you sure you want to revoke this offense?</p>
                <b>You will not be able to undo this decision.</b>
              </ModalBody>
              <ModalFooter className="justify-center">
                <Button color="default" variant="flat" onPress={onClose} isDisabled={isRevoking}>
                  Cancel
                </Button>
                <form action={revokeOffense}>
                  <Button type="submit" variant="flat" color="danger" isLoading={isRevoking}>
                    Revoke
                  </Button>
                </form>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

    </div>)

}
function ord (n: number) {
  return n + (n > 0 ? ["th", "st", "nd", "rd"][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10] : "")
}