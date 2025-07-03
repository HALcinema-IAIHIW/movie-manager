"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Users, Calendar, Clock, MapPin, Ticket } from "lucide-react"

// 券種の型定義
type TicketType = {
    id: string
    name: string
    price: number
}

// 選択された座席と券種の型定義
type SeatTicket = {
    seatId: string
    ticketType: TicketType
}

// 券種データ
const ticketTypes: TicketType[] = [
    { id: "general", name: "一般", price: 1800 },
    { id: "university", name: "大学生等", price: 1600 },
    { id: "highschool", name: "中学・高校生", price: 1400 },
    { id: "elementary", name: "小学生以下", price: 1000 },
]

// 映画情報の型定義
type MovieInfo = {
    id: string
    title: string
    date: string
    time: string
    screen: string
    poster: string
}

export default function TicketTypeSelection() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [selectedSeats, setSelectedSeats] = useState<string[]>([])
    const [seatTickets, setSeatTickets] = useState<SeatTicket[]>([])
    const [movieInfo, setMovieInfo] = useState<MovieInfo | null>(null)
    const [totalPrice, setTotalPrice] = useState(0)

    // URLパラメータから情報を取得
    useEffect(() => {
        const movieId = searchParams.get("movieId")
        const seats = searchParams.get("seats")
        const date = searchParams.get("date")
        const time = searchParams.get("time")
        const screen = searchParams.get("screen")

        if (!movieId || !seats || !date || !time || !screen) {
            // 必要なパラメータがない場合のみリダイレクト
            if (typeof window !== "undefined") {
                router.push("/tickets/seats")
            }
            return
        }

        const seatList = seats.split(",")

        // 既に設定済みの場合は再設定しない
        if (selectedSeats.length === 0) {
            setSelectedSeats(seatList)
        }

        // 映画情報を設定（実際のアプリではAPIから取得）
        if (!movieInfo) {
            setMovieInfo({
                id: movieId,
                title: "インターステラー",
                date: date,
                time: time,
                screen: screen,
                poster: "/images/movie-poster-1.jpg",
            })
        }

        // 初期券種を一般に設定（まだ設定されていない場合のみ）
        if (seatTickets.length === 0) {
            const initialSeatTickets = seatList.map((seatId) => ({
                seatId,
                ticketType: ticketTypes[0], // 一般
            }))
            setSeatTickets(initialSeatTickets)
        }
    }, [searchParams]) // 依存配列をsearchParamsのみに限定

    // 合計金額を計算
    useEffect(() => {
        const total = seatTickets.reduce((sum, seatTicket) => sum + seatTicket.ticketType.price, 0)
        setTotalPrice(total)
    }, [seatTickets])

    // 券種変更の処理
    const handleTicketTypeChange = (seatId: string, ticketTypeId: string) => {
        const ticketType = ticketTypes.find((t) => t.id === ticketTypeId)
        if (!ticketType) return

        setSeatTickets((prev) =>
            prev.map((seatTicket) => (seatTicket.seatId === seatId ? { ...seatTicket, ticketType } : seatTicket)),
        )
    }

    // 次のページへ進む
    const handleNext = () => {
        const params = new URLSearchParams()
        params.set("movieId", movieInfo?.id || "")
        params.set("date", movieInfo?.date || "")
        params.set("time", movieInfo?.time || "")
        params.set("screen", movieInfo?.screen || "")
        params.set("seatTickets", JSON.stringify(seatTickets))
        params.set("totalPrice", totalPrice.toString())

        router.push(`/tickets/payment?${params.toString()}`)
    }

    // 前のページに戻る
    const handleBack = () => {
        const params = new URLSearchParams()
        params.set("movieId", movieInfo?.id || "")
        params.set("date", movieInfo?.date || "")
        params.set("time", movieInfo?.time || "")
        params.set("screen", movieInfo?.screen || "")

        router.push(`/tickets/seats?${params.toString()}`)
    }

    if (!movieInfo) {
        return <div>Loading...</div>
    }

    return (
        <div className="min-h-screen pt-24">
            {/* ヒーローセクション */}
            <section className="relative h-[20vh] md:h-[30vh] overflow-hidden">
                <div className="absolute inset-0">
                    <Image src="/images/theater-interior.jpg" alt="劇場内観" fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-gradient-to-r from-darkest/90 via-darkest/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-darkest/80 via-transparent to-darkest/40" />
                </div>

                <div className="relative h-full flex items-center">
                    <div className="container-luxury">
                        <div className="max-w-2xl animate-fade-in">
                            <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-4 font-en">TICKET TYPE</h1>
                            <p className="text-xl md:text-2xl text-gold mb-4 font-jp">券種選択</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* メインコンテンツ */}
            <section className="py-16">
                <div className="container-luxury">
                    {/* 映画情報 */}
                    <div className="card-luxury p-6 mb-8">
                        <div className="flex items-center gap-6">
                            <div className="relative w-20 h-28 flex-shrink-0">
                                <Image
                                    src={movieInfo.poster || "/placeholder.svg"}
                                    alt={movieInfo.title}
                                    fill
                                    className="object-cover rounded"
                                />
                            </div>
                            <div className="flex-1">
                                <h2 className="text-2xl font-bold text-gold mb-2 font-jp">{movieInfo.title}</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-text-secondary">
                                    <div className="flex items-center gap-2">
                                        <Calendar size={16} className="text-gold" />
                                        <span className="font-jp">{movieInfo.date}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock size={16} className="text-gold" />
                                        <span className="font-jp">{movieInfo.time}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-gold" />
                                        <span className="font-jp">{movieInfo.screen}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                        {/* 券種選択 */}
                        <div className="xl:col-span-2">
                            <div className="card-luxury p-8">
                                <h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2 font-jp">
                                    <Ticket size={24} className="text-gold" />
                                    券種を選択してください
                                </h3>

                                <div className="space-y-6">
                                    {seatTickets.map((seatTicket, index) => (
                                        <div key={seatTicket.seatId} className="border border-accent/20 rounded-lg p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gold text-darkest rounded-lg flex items-center justify-center font-bold font-en">
                                                        {seatTicket.seatId}
                                                    </div>
                                                    <span className="text-lg font-medium text-text-primary font-jp">
                            座席 {seatTicket.seatId}
                          </span>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-2xl font-bold text-gold font-playfair">
                                                        ¥{seatTicket.ticketType.price.toLocaleString()}
                                                    </p>
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-text-secondary mb-2 font-jp">券種を選択</label>
                                                <select
                                                    value={seatTicket.ticketType.id}
                                                    onChange={(e) => handleTicketTypeChange(seatTicket.seatId, e.target.value)}
                                                    className="w-full px-4 py-3 bg-darker border border-accent/30 rounded-lg
                            text-text-primary focus:border-gold focus:outline-none transition-colors font-jp"
                                                >
                                                    {ticketTypes.map((ticketType) => (
                                                        <option key={ticketType.id} value={ticketType.id}>
                                                            {ticketType.name} - ¥{ticketType.price.toLocaleString()}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* 券種説明 */}
                                <div className="mt-8 p-6 bg-darker rounded-lg">
                                    <h4 className="text-lg font-medium text-text-primary mb-4 font-jp">券種について</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-text-secondary">
                                        <div>
                                            <p className="font-medium text-text-primary mb-1 font-jp">一般 - ¥1,800</p>
                                            <p className="font-jp">18歳以上の方</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-text-primary mb-1 font-jp">大学生等 - ¥1,600</p>
                                            <p className="font-jp">大学生・専門学生（要学生証）</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-text-primary mb-1 font-jp">中学・高校生 - ¥1,400</p>
                                            <p className="font-jp">中学生・高校生（要学生証）</p>
                                        </div>
                                        <div>
                                            <p className="font-medium text-text-primary mb-1 font-jp">小学生以下 - ¥1,000</p>
                                            <p className="font-jp">小学生・幼児</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 注文確認 */}
                        <div className="xl:col-span-1">
                            <div className="card-luxury p-6 sticky top-32">
                                <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2 font-jp">
                                    <Users size={20} className="text-gold" />
                                    注文確認
                                </h3>

                                {/* 選択座席・券種一覧 */}
                                <div className="space-y-3 mb-6">
                                    {seatTickets.map((seatTicket) => (
                                        <div key={seatTicket.seatId} className="flex items-center justify-between p-3 bg-darker rounded-lg">
                                            <div>
                                                <p className="text-text-primary font-medium font-en">{seatTicket.seatId}</p>
                                                <p className="text-sm text-text-muted font-jp">{seatTicket.ticketType.name}</p>
                                            </div>
                                            <p className="text-gold font-medium font-playfair">
                                                ¥{seatTicket.ticketType.price.toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* 合計金額 */}
                                <div className="border-t border-accent/20 pt-4 mb-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-medium text-text-primary font-jp">合計金額</span>
                                        <span className="text-2xl font-bold text-gold font-playfair">¥{totalPrice.toLocaleString()}</span>
                                    </div>
                                </div>

                                {/* ナビゲーションボタン */}
                                <div className="space-y-3">
                                    <button
                                        onClick={handleNext}
                                        className="w-full flex items-center justify-center gap-2 py-3 px-4
                      bg-gradient-to-r from-gold to-gold-light text-darkest hover:shadow-gold-glow
                      rounded-lg font-medium transition-all duration-300 font-jp"
                                    >
                                        お支払いへ進む
                                        <ArrowRight size={18} />
                                    </button>

                                    <button
                                        onClick={handleBack}
                                        className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-accent/30
                      text-text-secondary hover:text-text-primary hover:border-accent/50 rounded-lg transition-all duration-300 font-jp"
                                    >
                                        <ArrowLeft size={18} />
                                        座席選択に戻る
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
    