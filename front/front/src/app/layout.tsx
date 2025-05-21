import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Italiana } from "next/font/google"
import { Noto_Serif_JP } from "next/font/google"
import "./globals.css"
import Header from "@/app/components/header/page"
// import Footer from "@/components/footer"

// 英字フォント
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

const italiana = Italiana({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-italiana",
  display: "swap",
})

// 日本語フォント
const notoSerifJP = Noto_Serif_JP({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-noto-serif-jp",
  display: "swap",
})

export const metadata: Metadata = {
  title: "HALCINEMA | 高級映画館",
  description: "最高の映画体験をお届け",
}

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="ja">
      <body
          className={`${playfair.variable} ${italiana.variable} ${notoSerifJP.variable} bg-dark text-white min-h-screen flex flex-col font-noto`}
      >
      <Header />
      <main className="flex-1">{children}</main>
      {/*<Footer />*/}
      </body>
      </html>
  )
}


