import { MongoDBAdapter } from "@auth/mongodb-adapter"
import NextAuth from "next-auth"
import Discord from "next-auth/providers/discord"
import clientPromise from "./db"
 
const redirectURIs = {
    discord: process.env.NODE_ENV === "development"
        ? "http://localhost:3000/api/v1/auth"
        : "https://api.inimicalpart.com/v1/auth",
    
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [Discord({
    redirectProxyUrl: redirectURIs.discord,
    profile(profile) {
        if (profile.avatar === null) {
          const defaultAvatarNumber = Number(BigInt(profile.id) >> BigInt(22)) % 6
          profile.image_url = `https://cdn.discordapp.com/embed/avatars/${defaultAvatarNumber}.png`
        } else {
          const format = profile.avatar.startsWith("a_") ? "gif" : "png"
          profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`
        }
        return {
          user_id: profile.id,
          id: profile.id,
          username: profile.username,
          name: profile.global_name ?? profile.username,
          email: profile.email,
          image: profile.image_url,
        }
      },
  })],
  trustHost: true
})