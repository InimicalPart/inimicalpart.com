"use client"

import Loading from "@/components/loading"
import { getServerInfo } from "@/utils/iris"
import { Accordion, AccordionItem, Avatar, Badge, Button, Checkbox, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Link, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Selection, Spacer, Textarea, Tooltip, User, useDisclosure } from "@nextui-org/react"
import { getSession, signOut } from "next-auth/react"
import { useEffect, useState } from "react"
import prettyMilliseconds from "pretty-ms"
import { redirect, useRouter } from "next/navigation"
import { AdminIcon } from "@/components/icons/misc"

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


export default function Etc({ session }: { session: any }) {

    const appealURLPrefix = process.env.NODE_ENV == "development" ? "/appeal" : ""
    const apiURLPrefix = process.env.NODE_ENV == "development" ? "/api" : ""


    const [loading, setLoading] = useState(true)
    const [selectedKeys, setSelectedKeys] = useState<Selection>(new Set([]))
    const [isAdmin, setIsAdmin] = useState(false)
    const [offenses, setOffenses] = useState<Offense[]>([])
    const [serverInfo, setServerInfo] = useState({} as any)
    const [submitting, setSubmitting] = useState(false)
    const [focusedOffense, setFocusedOffense] = useState<Offense>({} as Offense)
    const {isOpen, onOpen, onOpenChange, onClose} = useDisclosure();
    const [appealMessage, setAppealMessage] = useState("")
    const [nextUpdate, setNextUpdate] = useState(Date.now() + 300000)
    const [nextUpdateString, setNextUpdateString] = useState("5 minutes")
    const [error, setError] = useState("")


    useEffect(() => {
      Promise.all([
      fetch(location.origin + apiURLPrefix + "/v1/appeal/user-info")
      .then(res=>res.json())
      .then(data=>{
        setIsAdmin(data.admin)
      }),
      fetch(location.origin + apiURLPrefix + "/v1/appeal/server-info")
      .then(res=>res.json())
      .then(data=>{
        setServerInfo(data.serverInfo)
      }),
      fetch(location.origin + apiURLPrefix + "/v1/appeal/offenses")
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
    }, [])

    

    useEffect(() => {
      if (loading) return
      const query = new URLSearchParams(location.search)
      console.log(query.values())
      if (query.has("appeal")) {
        const offenseID = query.get("appeal")
        const offense = offenses.find(offense=>offense.id == offenseID)
        if (offense) {
          setSelectedKeys(new Set([offenseID as string]))
          if (offense.can_appeal && offense.status == "ACTIVE") {
            setFocusedOffense(offense)
            onOpen()
          }
        }
      }
    }, [loading])

    useEffect(() => {
      const interval = setInterval(() => {
        fetch(location.origin + apiURLPrefix + "/v1/appeal/offenses")
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
    }, [nextUpdate])

    useEffect(() => {
      const interval = setInterval(() => {
        setNextUpdateString(prettyMilliseconds(nextUpdate - Date.now(), {verbose: true, secondsDecimalDigits: 0}))
      }, 100)
      return () => clearInterval(interval)
    }, [nextUpdate])



    function appealOffense() {
      setSubmitting(true)

      const response = fetch(location.origin + apiURLPrefix + "/v1/appeal/offenses/"+focusedOffense.id+"/appeal", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: appealMessage
        })
      }).then(res=>res.json())
      .then(data=>{
        
        if (data.error == "IRIS_UNAVAILABLE") {
          redirect(appealURLPrefix + "/")
        } else if (data.error == "INVALID_ACTION") {
          onClose()
          setNextUpdate(Date.now())
          setSubmitting(false)
          return
        }

        else {
          setSubmitting(false)
          onClose()
          setAppealMessage("")

          setOffenses(offenses.map(offense=>{
            if (offense.id == focusedOffense.id) {
              offense.status = data.status
              offense.appeal = {
                status: data.appeal_status,
                transcript: data.transcript
              }
            }
            return offense
          }))
        }
      })
    }


    return (loading ? <Loading/> : <div>
      <div className="flex w-full -mt-10 justify-end items-center">
      <Tooltip content="Switch to Admin Mode" isDisabled={!isAdmin}>
        <Link href={appealURLPrefix + "/admin"} className={!isAdmin ? "hidden" : ""}>
          <Button color="default" variant="bordered" radius="lg" className="rounded-full px-0 min-w-0 min-h-0 py-0 h-12 w-12 mr-3" onClick={()=>redirect(appealURLPrefix + "/")}>
            <AdminIcon />
          </Button>
        </Link>
      </Tooltip>
      <Dropdown placement="bottom" showArrow>
        <DropdownTrigger>
          <Avatar
            as="button"
            isBordered={true}
            src={session.user.image}
            className="transition-transform"
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownItem key="profile" className="h-14 gap-2 cursor-default" isReadOnly>
            <p className="font-bold">Signed in as</p>
            <p className="font-bold">@{session.user.username}</p>
          </DropdownItem>
            <DropdownItem key="logout" color="danger" className="text-danger" onClick={() => signOut()}>
              Log Out
            </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      </div>
    <div className="w-full text-center items-center justify-items-center content-center flex flex-col">
      <h1 className="font-bold text-3xl">Offenses</h1>
      <Tooltip content={serverInfo.name + " (" + serverInfo.id + ")"} placement="bottom" closeDelay={100} delay={0}>
        <div className="flex items-center justify-center gap-2">
          <Avatar src={serverInfo.icon} size="sm" />
          <p className="text-sm">{serverInfo.name}</p>
        </div>
      </Tooltip>
    </div>
    <Spacer y={10}/>
    { offenses.length === 0 ? <div className="text-center"><p className="text-gray-500 italic decoration-wavy">No offenses found. Let&apos;s keep it that way! :)</p> </div> :
    <><Accordion
      variant="shadow"
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
    >

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
            "AYR": "This appeal is awaiting your response."
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
              statusDescription = "This punishment is currently active, and counts towards your total offenses.";
              break;
            case "APPEALED":
              statusDescription = "This punishment has been appealed, and is pending review. During this time, the punishment is still active.";
              break;
            case "EXPIRED":
              statusDescription = "This punishment has expired, and no longer counts towards your total offenses.";
              break;
            case "REVOKED":
              statusDescription = "This punishment has been revoked by a staff member, and no longer counts towards your total offenses.";
              break;
            default:
              statusDescription = "This punishment is currently active, and counts towards your total offenses.";
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
                <div className="flex justify-end mb-2 mr-2 mt-5 sm:mt-2">
                  {
                    offense.appeal
                      ? <Link href={appealURLPrefix+"/offenses/"+offense.id}><Button color="primary" variant="solid" radius="lg">View transcript</Button></Link>
                      : <Tooltip content={
                          <div className="px-1 py-2">
                              <div className="text-small font-bold">Appeal unavailable</div>
                              <div className="text-sm">You cannot appeal this punishment.</div>
                          </div>
                        } placement="top" delay={50} closeDelay={50} isDisabled={offense.can_appeal}>
                          <div>
                              <Button onClick={()=>{
                                setFocusedOffense(offense)
                                onOpen()
                              }} color="primary" variant="solid" radius="lg" isDisabled={!offense.can_appeal}>Appeal this punishment</Button>
                          </div>
                        </Tooltip>
                  }
                </div>
              </div>
            </AccordionItem>
          
        })
      }
    </Accordion>

    <p className="text-center text-sm text-gray-400 mt-4">
      Next update in: <span className="font-bold">{nextUpdate - Date.now() < 1000 || nextUpdateString.startsWith("-") ? "Now" : nextUpdateString}</span>
    </p>
    </>
    }
    <Modal 
        isOpen={isOpen} 
        onOpenChange={onOpenChange}
        placement="top-center"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h1>Appeal offense #{focusedOffense.id}</h1>
                <Spacer y={1}/>
                <div className="text-sm">
                  <p className="dark:text-gray-200">Violation</p>
                  <p className="font-normal">{focusedOffense.rule_index}. {focusedOffense.violation}</p>
                  <Spacer y={1}/>
                  <p className="dark:text-gray-200">Violated on</p>
                  <p className="font-normal">{new Date(focusedOffense.violated_at).toLocaleString()}</p>
                </div>
              </ModalHeader>
              <ModalBody>
                <form action={appealOffense} id="appealForm">
                  <Textarea
                    autoFocus
                    isInvalid={!!error}
                    errorMessage={error}
                    label="Appeal Message"
                    placeholder="Enter your appeal message"
                    defaultValue={appealMessage}
                    onChange={(e) => {
                      if (e.target.value.length < 1) {
                        setError("Appeal message cannot be empty.")
                      } else if (e.target.value.length > 2000) {
                        setError("Appeal message cannot exceed 2000 characters.")
                      } else {
                        setError("")
                      }
                      setAppealMessage(e.target.value)
                    }}
                    onBlur={(e: any) => {
                      if (e.target.value.length < 1) {
                        setError("Appeal message cannot be empty.")
                      } else if (e.target.value.length > 2000) {
                        setError("Appeal message cannot exceed 2000 characters.")
                      } else {
                        setError("")
                      }
                    }}
                    variant="bordered"
                    minLength={1}
                    maxLength={2000}
                    
                    classNames={{
                      input: "resize-y min-h-[40px] max-h-[40dvh]",
                    }}
                  />
                </form>
              <p className="text-sm text-gray-400 text-center">To submit images, do so by attaching an <Link color="foreground" className="text-sm underline" href="https://imgur.com">imgur</Link> link to your image.<Spacer y={2}/><b>Markdown is supported.</b></p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="flat" onPress={onClose} isDisabled={submitting}>
                  Cancel
                </Button>
                <Button type="submit" form="appealForm" color="primary" isLoading={submitting} isDisabled={!!error || !appealMessage}>
                  Appeal
                </Button>
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