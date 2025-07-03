import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display } from "next/font/google"
import { Shippori_Mincho } from "next/font/google"
import "./globals.css"
import Header from "@/app/components/Header"
import Footer from "@/app/components/Footer"

// 英字フォントの設定 - Playfair Display
const playfairDisplay = Playfair_Display({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800", "900"],
    variable: "--font-playfair",
    display: "swap",
})

// 日本語フォントの設定 - しっぽり明朝
const shipporiMincho = Shippori_Mincho({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700", "800"],
    variable: "--font-shippori",
    display: "swap",
})

export const metadata: Metadata = {
    title: "HAL CINEMA | 最高級の映画体験",
    description: "洗練された空間で最高の映画体験をお届けする高級映画館",
    keywords: ["映画館", "高級", "シネマ", "映画", "エンターテイメント"],
    authors: [{ name: "HAL CINEMA" }],
    viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="ja" className="scroll-smooth">
        <body
            className={`${playfairDisplay.variable} ${shipporiMincho.variable} 
          bg-darkest text-text-primary min-h-screen flex flex-col antialiased`}
            style={{
                fontFamily: "var(--font-shippori), serif",
            }}
        >
        {/* ヘッダー */}
        <Header />

        {/* メインコンテンツ */}
        <main className="flex-1">{children}</main>

        {/* フッター */}
        <Footer />
        </body>
        </html>
    )
}
