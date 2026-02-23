"use client"

import { useEffect, useState, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"

function AdminPaymentContent() {
  type SeatTicketForPayment = {
    seatId: string
    roleId: string
    price: number
    seatIdStr: string
    ticketTypeName: string
  }

  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const movieId = searchParams.get("movieId")
  const date = searchParams.get("date")
  const time = searchParams.get("time")
  const screeningId = searchParams.get("screeningId")
  const seatTicketsParam = searchParams.get("seatTickets")
  const parsedSeatTickets: SeatTicketForPayment[] = seatTicketsParam ? JSON.parse(seatTicketsParam) : []
  const screen = searchParams.get("screen")
  const totalPrice = searchParams.get("totalPrice")

  const [movieInfo, setMovieInfo] = useState({
    title: "",
    poster: "/images/movie-poster-1.jpg",
  })
  const [isLoadingMovie, setIsLoadingMovie] = useState(true)

  // 映画情報を取得
  useEffect(() => {
    if (!movieId) {
      setIsLoadingMovie(false)
      return
    }

    setIsLoadingMovie(true)
    fetch(`http://localhost:8080/movies/${movieId}`)
      .then(res => res.json())
      .then(data => {
        console.log("Movie API Response:", data)
        let posterUrl = "/images/movie-poster-1.jpg"
        const rawPoster = data.poster_path || data.posterUrl

        console.log("Raw poster value:", rawPoster)

        if (rawPoster) {
          if (rawPoster.includes("http")) {
            posterUrl = rawPoster.substring(rawPoster.lastIndexOf("http"))
          } else {
            posterUrl = rawPoster
          }
        }

        console.log("Final poster URL:", posterUrl)

        setMovieInfo({
          title: data.title || "タイトル不明",
          poster: posterUrl,
        })
        setIsLoadingMovie(false)
      })
      .catch(err => {
        console.error("Failed to fetch movie info:", err)
        setMovieInfo({
          title: "映画情報の取得に失敗しました",
          poster: "",
        })
        setIsLoadingMovie(false)
      })
  }, [movieId])

  // 購入処理
  const handlePayment = async () => {
    setIsLoading(true)
    setError(null)

    try {
      // 1. 券種ごとに数量を集計
      const roleCounts = parsedSeatTickets.reduce(
        (acc, ticket) => {
          const roleId = Number(ticket.roleId)
          if (!roleId) return acc
          acc[roleId] = (acc[roleId] || 0) + 1
          return acc
        },
        {} as Record<number, number>,
      )

      const purchaseDetails = Object.entries(roleCounts).map(([role_id, quantity]) => ({
        role_id: Number(role_id),
        quantity,
      }))

      const purchaseRequestBody = {
        user_id: 1, // Admin用の固定ユーザーID（必要に応じて変更）
        screening_id: Number(screeningId),
        purchase_time: new Date().toISOString(),
        purchase_details: purchaseDetails,
      }

      console.log("Sending to /purchases/:", JSON.stringify(purchaseRequestBody, null, 2))

      // 2. 購入情報を作成
      const purchaseResponse = await fetch("http://localhost:8080/purchases/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(purchaseRequestBody),
      })

      if (!purchaseResponse.ok) {
        const errorText = await purchaseResponse.text()
        try {
          const errorData = JSON.parse(errorText)
          throw new Error(errorData.message || "購入情報の作成に失敗しました。")
        } catch {
          throw new Error(errorText || "購入情報の作成に失敗しました。")
        }
      }

      const purchaseResult = await purchaseResponse.json()
      const purchaseId = purchaseResult.PurchaseID

      if (!purchaseId) {
        throw new Error("レスポンスから購入IDが取得できませんでした。")
      }

      console.log("Purchase successful. Purchase ID:", purchaseId)

      // 3. 座席予約情報を作成
      const reservationPromises = parsedSeatTickets.map((ticket) => {
        const reservationRequestBody = {
          purchase_id: purchaseId,
          seat_id: Number(ticket.seatId),
        }

        return fetch("http://localhost:8080/reservationseats/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(reservationRequestBody),
        })
      })

      const reservationResponses = await Promise.all(reservationPromises)

      for (const res of reservationResponses) {
        if (!res.ok) {
          const errorText = await res.text()
          throw new Error(errorText || "座席の予約に失敗しました。")
        }
      }

      console.log("All seats reserved successfully.")

      // 4. 完了ページに遷移
      const params = new URLSearchParams()
      params.set("movieId", movieId || "")
      params.set("date", date || "")
      params.set("time", time || "")
      params.set("totalPrice", totalPrice || "")
      params.set("screen", screen || "")
      params.set("seatTickets", seatTicketsParam || "")

      router.push(`/admin/tickets/completed?${params.toString()}`)
    } catch (err) {
      console.error("Payment failed:", err)
      setError(err instanceof Error ? err.message : "購入処理に失敗しました。")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* ヘッダー */}
      <header className="bg-darkest border-b border-gray-800">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4 h-16">
            <Link href="/admin/tickets/types" className="text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-white">会計</h1>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="flex items-stretch justify-between gap-8">
          {/* 左側：小計ボックス */}
          <div className="flex-1 max-w-2xl bg-[#1E2541] rounded-lg p-8">
            {isLoadingMovie ? (
              <div className="flex items-center justify-center py-8">
                <p className="text-gray-400 text-xl">映画情報読み込み中...</p>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-yellow-400 mb-6">小計</h2>
                <div className="flex items-start gap-6 mb-6">
                  <div className="relative w-32 h-44 flex-shrink-0">
                    <Image
                      src={movieInfo.poster}
                      alt={movieInfo.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="text-3xl mb-4 text-white-400">{movieInfo.title || "タイトル不明"}</h2>
                    <p className="text-lg mb-2">
                      {date} {time}
                    </p>
                    <p className="text-lg">
                      {screen}
                    </p>
                  </div>
                </div>
                
                <div className="mb-8">
                  {/* 座席リスト */}
                  <div className="space-y-6 mb-8">
                    {parsedSeatTickets.map((ticket, index) => (
                      <div key={index} className="flex items-center justify-between text-2xl gap-8">
                        <span className="font-bold">{ticket.seatIdStr}</span>
                        <span>{ticket.ticketTypeName}</span>
                        <span>{ticket.price}円</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 合計 */}
                <div className="border-t-2 border-gray-600 pt-6">
                  <div className="flex items-center justify-end gap-4">
                    <span className="text-2xl text-white">計</span>
                    <div className="flex items-baseline gap-2">
                      {(totalPrice || "0").toString().split('').map((digit, index) => (
                        <span key={index} className="text-5xl font-bold tracking-wider">
                          {digit}
                        </span>
                      ))}
                      <span className="text-2xl ml-2">円</span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 右側：会員情報と購入ボタン */}
          <div className="flex flex-col min-w-[280px] pt-16">

            <button className="bg-gray-800 border-2 border-blue-400 rounded-xl px-8 py-6 shadow-lg hover:bg-gray-700 transition-colors mb-6">
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl font-medium text-blue-400">会員情報なし</span>
              </div>
            </button>


            {/* 現金で支払う */}
            <div className="bg-gray-800 border-2 border-yellow-400 rounded-xl px-6 py-5 shadow-lg mb-6">
              <label className="flex items-center justify-center gap-3 cursor-pointer">
                <div className="relative">
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={true}
                    readOnly
                    className="w-5 h-5 accent-yellow-400"
                  />
                </div>
                <span className="text-xl font-medium text-yellow-400"> 現金で支払う</span>
              </label>
            </div>
            
            {/* エラーメッセージ */}
            {error && (
              <div className="p-4 bg-red-900/30 border-2 border-red-500 rounded-xl shadow-lg mb-6">
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}
            
            <div className="flex-grow"></div>
            
            <button 
              onClick={handlePayment}
              disabled={isLoading}
              className={`bg-gradient-to-br from-yellow-400 to-yellow-500 text-black rounded-xl px-12 py-6 text-2xl font-bold shadow-xl transition-all ${
                isLoading ? "opacity-50 cursor-not-allowed" : "hover:shadow-2xl hover:scale-105 active:scale-95"
              }`}
            >
              <div className="flex items-center justify-center gap-2">
                <span>{isLoading ? "⏳ 処理中..." : "購入"}</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminPayment() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-black text-white flex items-center justify-center text-2xl">読み込み中...</div>}>
      <AdminPaymentContent />
    </Suspense>
  )
}