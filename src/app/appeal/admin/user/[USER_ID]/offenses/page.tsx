import { redirect } from "next/navigation";


export default async function Page() {
    const appealURLPrefix = process.env.NODE_ENV === "development" ? "/appeal" : ""
    return redirect(appealURLPrefix + "/admin")
}