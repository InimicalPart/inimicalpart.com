"use client"

import { AvatarIcon, SendIcon } from "@/components/icons/misc";
import { Button } from "@nextui-org/button";
import { Card, CardHeader, Divider, CardBody, Chip, Skeleton, Tooltip, Textarea, CardFooter, Avatar, Spacer } from "@nextui-org/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import DOMPurify from 'dompurify';
import showdown from 'showdown';
import Image from "next/image";
import prettyMilliseconds from "pretty-ms";
import { redirect, useRouter } from "next/navigation";
import { User } from "@clerk/nextjs/server";

let converter = new showdown.Converter();

export default function Etc({
    params,
    session: user
}: {
    params: {OFFENSE_ID: string, SERVER_ID: string},
    session: any
}) {
    
    const appealURLPrefix = `/servers/${params.SERVER_ID}`
    const apiLoc = process.env.NODE_ENV == "development" ? `http://appeal.localhost:3000/api/servers/${params.SERVER_ID}` : `https://appeal.inimicalpart.com/api/servers/${params.SERVER_ID}`


    const [loading, setLoading] = useState(true)
    const [offense, setOffense] = useState<{
        rule_index: number;
        status: "ACTIVE" | "APPEALED" | "EXPIRED" | "REVOKED" | "AYR" | "OPEN" | "LOCKED"
        violation: string;
        violated_at: string;
        punishment_type: "TEMPORARY_BANISHMENT" | "PERMANENT_BANISHMENT" | "TIMEOUT" | "KICK" | "WARNING";
        original_duration: string | null;
        ends_at: string | null;
        appeal: {
            status: "OPEN" | "APPROVED" | "DENIED" | "AYR",
            transcript: [
                {
                    type: string,
                    user_id: string;
                    status?: string;
                    message?: string;
                    timestamp: string;
                }
            ]
        } | null
    }>({
        status: "ACTIVE",
        rule_index: 0,
        violation: "",
        violated_at: "",
        punishment_type: "WARNING",
        original_duration: null,
        ends_at: null,
        appeal: null
    })
    const [appealText, setAppealText] = useState("")
    const [error, setError] = useState("")
    const [isSending, setSending] = useState(false)
    const [nextUpdate, setNextUpdate] = useState(Date.now() + 300000)
    const [nextUpdateString, setNextUpdateString] = useState("5 minutes")
    const [users, setUsers] = useState<any>([])

    const offenseStatusDescriptionMap = {
        "ACTIVE": "This punishment is currently active, and counts towards your total offenses.",
        "APPEALED": "This punishment has been appealed, and is pending review. During this time, the punishment is still active.",
        "EXPIRED": "This punishment has expired, and no longer counts towards your total offenses.",
        "REVOKED": "This punishment has been revoked by a staff member, and no longer counts towards your total offenses.",
        "DENIED": "This appeal has been denyd, and you cannot appeal the punishment again.",
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

    const offenseStatusColorMap = {
        "ACTIVE": "danger",
        "APPEALED": "warning",
        "EXPIRED": "info",
        "REVOKED": "success",
    }



    const punishmentNameMap = {
        "TEMPORARY_BANISHMENT": "Temporary Ban",
        "PERMANENT_BANISHMENT": "Permanent Ban",
        "TIMEOUT": "Timeout",
        "KICK": "Kick",
        "WARNING": "Warning",
    }

    const isActive = !["APPROVED" , "DENIED"].includes(offense?.appeal?.status ?? "") && offense?.status == "APPEALED"
    useEffect(() => {
        Promise.all([
        fetch(apiLoc + "/offenses/" + params.OFFENSE_ID)
        .then(res=>res.json())
        .then(data=>{
            if (data.error == "UNAVAILABLE" || data.error == "OFFENSE_NOT_FOUND") {
                return redirect(appealURLPrefix + "/")
            }
            setOffense(data.offense)
            setTimeout(()=>document.getElementById("messages")?.scrollTo(0, document.getElementById("messages")?.scrollHeight as any), 150)
        }),
        fetch(apiLoc + "/offenses/" + params.OFFENSE_ID + "/appeal/users")
        .then(res=>res.json())
        .then(data=>{
            if (data.error == "UNAVAILABLE" || data.error == "OFFENSE_NOT_FOUND") {
                return redirect(appealURLPrefix + "/")
            }
            setUsers(data.users)
        })
    
    ]).then(()=>{
          setLoading(false)
          if (isActive) {
             setNextUpdate(Date.now() + 300000)
          }
        })  
      }, [params.OFFENSE_ID, apiLoc, appealURLPrefix, isActive])

      useEffect(() => {
        const interval = setInterval(() => {
            Promise.all([
            fetch(apiLoc + "/offenses/" + params.OFFENSE_ID)
            .then(res=>res.json())
            .then(data=>{
                if (data.error == "UNAVAILABLE" || data.error == "OFFENSE_NOT_FOUND") {
                    return redirect(appealURLPrefix + "/")
                }

                setOffense(data.offense)
                setTimeout(()=>document.getElementById("messages")?.scrollTo(0, document.getElementById("messages")?.scrollHeight as any), 150)
    
            }),
            fetch(apiLoc + "/offenses/" + params.OFFENSE_ID + "/appeal/users")
            .then(res=>res.json())
            .then(data=>{
                if (data.error == "UNAVAILABLE" || data.error == "OFFENSE_NOT_FOUND") {
                    return redirect(appealURLPrefix + "/")
                }
                setUsers(data.users)
            })
        
        ]).then(()=>{
              setLoading(false)
              if (isActive) {
                 setNextUpdate(Date.now() + 300000)
              }
            })  
        }, nextUpdate - Date.now())
        return () => clearInterval(interval)
      }, [nextUpdate, params.OFFENSE_ID, apiLoc, appealURLPrefix, isActive])
  
      useEffect(() => {
        let interval = null
        if (isActive) {
            interval = setInterval(() => {
                setNextUpdateString(prettyMilliseconds(nextUpdate - Date.now(), {verbose: true, secondsDecimalDigits: 0}))
            }, 100)
        }
        return () => {
            if (interval) clearInterval(interval)
        }
      }, [nextUpdate, isActive])

    function htmlAsIntended(html: string) {
        // for all h1 tags, add a class called "line-through"
        return html
            .replace(/<h1/g, '<h1 class="font-bold text-3xl"')
            .replace(/<h2/g, '<h2 class="font-bold text-2xl"')
            .replace(/<h3/g, '<h3 class="font-bold text-xl"')
            .replace(/<h4/g, '<h4 class="font-bold text-lg"')
            .replace(/<ul/g, '<ul style="margin: revert; padding: revert; list-style: disc;"')

    }

    function sendMessage() {
        setSending(true)
        fetch(`${apiLoc}/offenses/${params.OFFENSE_ID}/appeal/messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: appealText
            })
        })
        .then(res=>res.json())
        .then(data=>{
            if (data.error == "UNAVAILABLE") {
                return redirect(appealURLPrefix + "/")
            } else if (data.error == "INVALID_ACTION") {
                setNextUpdate(Date.now())
                setSending(false)
                return
            }


            if (data.error) {
                setError(data.message)
            } else {
                setError("")
            }
            setAppealText("")
            let appealCopy = offense

            if (offense?.appeal) {
              offense.appeal.transcript = data.transcript;
              offense.appeal.status = data.appeal_status
              setOffense(appealCopy)
              setUsers(data.users)
              setTimeout(()=>document.getElementById("messages")?.scrollTo(0, document.getElementById("messages")?.scrollHeight as any), 150)
            }
            setSending(false)

        })

    }


    const appealStatus = offense?.appeal?.status ?? "OPEN"
    let hideTextarea = ["APPROVED", "DENIED"].includes(appealStatus as any) || !["APPEALED"].includes(offense?.status)
    return <>
    <div className="flex justify-center flex-row">
        <div className="mr-2 z-10">
            <Skeleton isLoaded={!loading} className="rounded-xl">
                <Card className="h-[70svh] hidden md:!block w-[300px] dark:bg-neutral-800 light:bg-neutral-100">
                    <CardHeader>
                        <h1 className="text-center w-full font-bold text-large">Offense #{params.OFFENSE_ID}</h1>
                    </CardHeader>
                    <Divider/>
                    <CardBody className="items-center flex flex-col gap-4 h-[calc(100%-8rem)]">
                        <div className="flex flex-col items-center">
                            <h1 className="text-medium font-bold">Offense Status</h1>
                            <Tooltip content={offenseStatusDescriptionMap[offense?.status as keyof typeof offenseStatusDescriptionMap]} placement="top" isDisabled={false}>
                                <Chip color={offenseStatusColorMap[offense?.status as keyof typeof offenseStatusColorMap] as any} size="sm" variant="flat">{offense?.status == "AYR" ? "Awaiting your response" : offense?.status}</Chip>
                            </Tooltip>
                        </div>
                        <div className="flex flex-col items-center">
                            <h1 className="text-medium font-bold">Appeal Status</h1>
                            <Tooltip content={appealStatusDescriptionMap[appealStatus as keyof typeof appealStatusDescriptionMap]} placement="top" isDisabled={false}>
                                <Chip color={appealStatusColorMap[appealStatus as keyof typeof appealStatusColorMap] as any} size="sm" variant="flat">{appealStatusLookup[appealStatus as keyof typeof appealStatusLookup].toUpperCase()}</Chip>
                            </Tooltip>
                        </div>
                        <div className="flex flex-col items-center">
                            <h1 className="text-medium font-bold">Violation</h1>
                            <p className="text-sm max-w-60 text-center">{offense?.rule_index}. {offense?.violation}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <h1 className="text-medium font-bold">Violated on</h1>
                            <p className="text-sm max-w-60 text-center">{new Date(offense?.violated_at).toLocaleString()}</p>
                        </div>
                        <div className="flex flex-col items-center">
                            <h1 className="text-medium font-bold">Punishment</h1>
                            <Tooltip content="This punishment has ended." placement="top" isDisabled={offense?.ends_at ? new Date(offense?.ends_at).getTime() > Date.now() : true}>
                            <p className={"text-sm max-w-60 text-center " + (offense?.ends_at ? new Date(offense?.ends_at).getTime() < Date.now() ? "line-through" : "" : "")}>{punishmentNameMap[offense?.punishment_type]} {offense?.original_duration ? `(${offense?.original_duration})` : ""}</p>
                            </Tooltip>
                        </div>
                        <div className="flex flex-col items-center">
                            <h1 className="text-medium font-bold">{offense?.ends_at ? new Date(offense?.ends_at).getTime() < Date.now() ? "Ended at" : "Ends" : "Ends"}</h1>
                            <p className="text-sm max-w-60 text-center">{offense?.ends_at ? new Date(offense?.ends_at).toLocaleString() : "Never"}</p>

                        </div>
                    </CardBody>
                    <CardFooter className="pt-0 h-20">
                        <Link href={appealURLPrefix + "/"} className="w-full">
                            <Button color="primary" className="w-full" size="md">Back</Button>
                        </Link>
                    </CardFooter>
                </Card>
            </Skeleton>
        </div>
        <div className="ml-2">
            <Skeleton isLoaded={!loading} className="rounded-xl">
                <Card>
                    <CardBody className="h-[70svh] w-[80svw] sm:w-[60svw] dark:bg-neutral-800 light:bg-neutral-100 flex flex-col">
                        <div className={"w-full mb-2 flex flex-col gap-3 overflow-y-auto scrollbar-thin " + (hideTextarea ? "h-full" : "h-[calc(100%-5rem)]")} id="messages">
                            {
                                offense?.appeal?.transcript.map((event, index) => {
                                    if (event.type == "message") {
                                        return <div key={index} className={"flex flex-row " + (event.user_id == user.discord.id ? "text-right mr-2 " : "") + (index == offense?.appeal?.transcript.length as any - 1 ? "mb-2 " : "") + (index==0?"mt-2":"")}>
                                                {   
                                                    event.user_id != user.discord.id ? <>
                                                        {
                                                            event.user_id == "--" ? <AvatarIcon size={32}/>
                                                            : <Avatar src={
                                                                users.find((user: any) => user.id == event.user_id)?.image
                                                            } className="w-8 h-8"/>
                                                        }
                                                        <Spacer x={2}/>
                                                    </> : null
                                                }
                                                <div className="w-full">
                                                    <div className="">

                                                        <p className={"leading-2 w-full font-bold inline-flex gap-1 " + (event.user_id == user.discord.id ? "flex-row-reverse": "flex-row")}>
                                                            <span>
                                                                {event.user_id == user.discord.id ? user.firstName : 
                                                                (event.user_id == "--" ? "Anonymous" : users.find((user: any) => user.id == event.user_id)?.name)
                                                            }</span>
                                                            <span className="text-gray-400">·</span>
                                                            <span className="font-normal text-sm content-center text-gray-400">{new Date(event.timestamp).toLocaleString()}</span>
                                                        </p>
                                                    </div>
                                                    <div className="grid">
                                                        <Card className={"dark:bg-neutral-700 bg-neutral-200 max-w-[90%] w-fit max-h-min " + (event.user_id == user.discord.id ? "justify-self-end rounded-tr-none" : "rounded-tl-none")}>
                                                            <CardBody>
                                                                <p className="w-full" dangerouslySetInnerHTML={{__html: htmlAsIntended(DOMPurify.sanitize(converter.makeHtml((event.message ?? "").replaceAll("\\n", "\n").replaceAll("<br/>", "\n")) ?? "")) as any}}></p>
                                                            </CardBody>
                                                        </Card>
                                                    </div>
                                                </div>
                                                {   
                                                    event.user_id == user.discord.id ? <>
                                                        <Spacer x={2}/>
                                                        <Avatar src={user.imageUrl} className="w-8 h-8"/>
                                                    </> : null
                                                }
                                        </div>
                                    } else {
                                        const usr = event.user_id == "--" ? null : users.find((u: {id:string})=>u.id==event.user_id)
                                        return <div key={index} className={"grid " + (index==0?"mt-2":"")}>
                                            <div className="text-center w-full font-thin my-2 inline-flex justify-center">Appeal status changed to &apos;<span className="font-normal">{appealStatusLookup[event.status as keyof typeof appealStatusLookup]}</span>&apos; by<Spacer />{event.user_id != "--" ? <><Image src={usr?.image} width={24} height={24} alt="Author's profile picture" className="rounded-full"/><Spacer /><span className="font-normal">{usr?.name}</span></> : <><AvatarIcon size={24}/><Spacer/><span className="font-normal">Anonymous</span></>}</div>
                                        </div>
                                    }
                                })
                            }
                        </div>
                        <div className={"w-full h-[9rem] mt-2 flex flex-row items-center " + (hideTextarea ? "hidden" : "")}>
                            <div className="w-full mr-1">
                                <Textarea
                                    isInvalid={!!error}
                                    errorMessage={error}
                                    label="Appeal Message"
                                    placeholder={"Enter your appeal message.\n\nMarkdown is supported."}
                                    value={appealText}
                                    onChange={(e) => {
                                        if (e.target.value.length > 2000) {
                                            setError("Appeal message cannot exceed 2000 characters.")
                                        } else {
                                            setError("")
                                        }
                                        setAppealText(e.target.value)
                                    }}
                                    onBlur={(e: any) => {
                                        if (e.target.value.length > 2000) {
                                            setError("Appeal message cannot exceed 2000 characters.")
                                        } else {
                                            setError("")
                                        }
                                    }}
                                    variant="bordered"
                                    minLength={1}
                                    maxLength={2000}
                                    
                                    classNames={{
                                        input: "max-h-[5rem] min-h-[5rem]",
                                    }}
                                    className="w-full"
                                />
                            </div>
                            <div className="ml-1 min-w-[5.5rem] h-full">
                                <Button color="primary" className="h-full min-w-[5.5rem]" onClick={()=>sendMessage()} isDisabled={!!error || !appealText.trim()} isLoading={isSending}>
                                    {isSending ? "" : <SendIcon/>}
                                </Button>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </Skeleton>
        </div>
    </div>
        <p className={"text-center text-sm text-gray-400 mt-4 " + (loading || !isActive ? "hidden": "")}>
            Next update in: <span className="font-bold">{nextUpdate - Date.now() < 1000 || nextUpdateString.startsWith("-") ? "Now" : nextUpdateString}</span>
        </p>
    </>
}
