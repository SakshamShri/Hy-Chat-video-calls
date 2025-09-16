import {StreamChat} from "stream-chat"

import dotenv from "dotenv"
dotenv.config()

const apiKey = process.env.STREAM_API_KEY
const apiSecret = process.env.STREAM_API_SECRET

if(!apiKey || !apiSecret){
    throw new Error("STREAM_API_KEY and STREAM_API_SECRET must be set in environment variables")
}

const streamClient = StreamChat.getInstance(apiKey, apiSecret)

export const upsertStreamUser = async (userData) => {
    try {
        const userWithRole = {
            ...userData,
            role: 'admin' // Give users admin role to allow channel creation and access
        }
        await streamClient.upsertUsers([userWithRole])
        return userWithRole
    } catch (error) {
        console.error("Error creating/updating Stream user 1:", error)
        throw error
    }
}

export const generateStreamToken = (userId) => {
    try {
        const userIdStr = userId.toString()
        const token = streamClient.createToken(userIdStr)
        return token
    } catch (error) {
        console.error("Error generating Stream token:", error)
        throw error
    }
}

export default streamClient