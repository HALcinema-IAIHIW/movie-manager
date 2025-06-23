'use client'

import { useEffect } from "react"
import { fetchPing } from '../libs/fetchPing'

export const PingStatus = () => {

    useEffect(() => {
        fetchPing()
        .then((msg) => {
            console.log("API応答", msg)
        })
        .catch((err) => {
            console.log("Ping error:", err)
            console.log("通信失敗")
        })
    }, [])

    return null
}