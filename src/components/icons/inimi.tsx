import Image from "next/image"
import logo from "@/images/logo.png"

export default function InimiLogo({
    size = {
        width: 500,
        height: 500
    }
}:{
    size?: {
        width: number,
        height: number
    }
}){
    return (
        <Image src={logo} width={size.width} height={size.height} className="mr-3 rounded-md" alt="Inimi Logo" />
    )
}