"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Users, MapPin, Calendar, Clock } from "lucide-react"

// 座席の状態を定義
type SeatStatus = "available" | "reserved" | "selected"

// 座席データの型定義
type Seat = {
    row: string
    number: number
    status: SeatStatus
    id: string
}

// 映画情報の型定義
type MovieInfo = {
    id: string
    title: string
    date: string
    time: string
    screen: string
    poster: string
}

// スクリーン設定の型定義
type ScreenConfig = {
    rows: string[]
    seatsPerRow: number[]
    totalSeats: number
    layout: "large" | "medium" | "small"
}

// スクリーン設定
const screenConfigs: { [key: string]: ScreenConfig } = {
    スクリーン1: {
        rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        seatsPerRow: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
        totalSeats: 200,
        layout: "large",
    },
    スクリーン2: {
        rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        seatsPerRow: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
        totalSeats: 200,
        layout: "large",
    },
    スクリーン3: {
        rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        seatsPerRow: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
        totalSeats: 200,
        layout: "large",
    },
    スクリーン4: {
        rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        seatsPerRow: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
        totalSeats: 120,
        layout: "medium",
    },
    スクリーン5: {
        rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        seatsPerRow: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
        totalSeats: 120,
        layout: "medium",
    },
    スクリーン6: {
        rows: ["A", "B", "C", "D", "E", "F", "G"],
        seatsPerRow: [10, 10, 10, 10, 10, 10, 10],
        totalSeats: 70,
        layout: "small",
    },
    スクリーン7: {
        rows: ["A", "B", "C", "D", "E", "F", "G"],
        seatsPerRow: [10, 10, 10, 10, 10, 10, 10],
        totalSeats: 70,
        layout: "small",
    },
    スクリーン8: {
        rows: ["A", "B", "C", "D", "E", "F", "G"],
        seatsPerRow: [10, 10, 10, 10, 10, 10, 10],
        totalSeats: 70,
        layout: "small",
    },
}

export default function SeatSelection() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [selectedSeats, setSelectedSeats] = useState<string[]>([])
    const [seats, setSeats] = useState<Seat[]>([])
    const [movieInfo, setMovieInfo] = useState<MovieInfo>({
        id: "1",
        title: "インターステラー",
        date: "2024年5月5日",
        time: "19:30",
        screen: "スクリーン1",
        poster: "/images/movie-poster-1.jpg",
    })
    const [currentConfig, setCurrentConfig] = useState<ScreenConfig>(screenConfigs["スクリーン1"])

    // URLパラメータから情報を取得
    useEffect(() => {
        const screen = searchParams.get("screen") || "スクリーン1"
        const movieId = searchParams.get("movieId") || "1"
        const date = searchParams.get("date") || "2024年5月5日"
        const time = searchParams.get("time") || "19:30"

        setMovieInfo({
            id: movieId,
            title: "インターステラー",
            date: date,
            time: time,
            screen: screen,
            poster: "/images/movie-poster-1.jpg",
        })

        setCurrentConfig(screenConfigs[screen] || screenConfigs["スクリーン1"])
    }, [searchParams])

    // 座席データの初期化
    useEffect(() => {
        const seatData: Seat[] = []

        currentConfig.rows.forEach((row, rowIndex) => {
            const seatsInRow = currentConfig.seatsPerRow[rowIndex] || 0
            for (let i = 1; i <= seatsInRow; i++) {
                const seatId = `${row}${i}`
                let status: SeatStatus = "available"

                // ランダムに一部の座席を予約済みに設定（デモ用）
                if (Math.random() < 0.15) {
                    status = "reserved"
                }

                seatData.push({
                    row,
                    number: i,
                    status,
                    id: seatId,
                })
            }
        })

        setSeats(seatData)
        setSelectedSeats([]) // スクリーン変更時に選択をリセット
    }, [currentConfig])

    // 座席選択の処理
    const handleSeatClick = (seatId: string) => {
        const seat = seats.find((s) => s.id === seatId)
        if (!seat || seat.status === "reserved") return

        if (selectedSeats.includes(seatId)) {
            // 選択解除
            setSelectedSeats(selectedSeats.filter((id) => id !== seatId))
            setSeats(seats.map((s) => (s.id === seatId ? { ...s, status: "available" } : s)))
        } else {
            // 最大4席まで選択可能
            if (selectedSeats.length >= 4) {
                alert("最大4席まで選択できます")
                return
            }
            // 選択
            setSelectedSeats([...selectedSeats, seatId])
            setSeats(seats.map((s) => (s.id === seatId ? { ...s, status: "selected" } : s)))
        }
    }

    // 座席のスタイルを取得
    const getSeatStyle = (status: SeatStatus) => {
        switch (status) {
            case "available":
                return "bg-accent/30 hover:bg-accent/50 text-text-secondary cursor-pointer border-accent/50"
            case "reserved":
                return "bg-orange-800/60 text-orange-200 cursor-not-allowed border-orange-700"
            case "selected":
                return "bg-gold text-darkest cursor-pointer border-gold shadow-gold-glow"
            default:
                return "bg-accent/30 text-text-secondary"
        }
    }

    // 座席レイアウトのレンダリング
    const renderSeatLayout = () => {
        if (currentConfig.layout === "large") {
            // 大スクリーン（200席）: 4-12-4 配置
            return currentConfig.rows.map((row, rowIndex) => {
                const seatsInRow = currentConfig.seatsPerRow[rowIndex]
                return (
                    <div key={row} className="flex items-center justify-center gap-1">
                        {/* 行ラベル（左） */}
                        <div className="w-8 text-center text-gold font-medium font-en">{row}</div>

                        {/* 座席 */}
                        <div className="flex gap-1">
                            {/* 1-4席 */}
                            {Array.from({ length: 4 }, (_, i) => i + 1).map((num) => {
                                if (num > seatsInRow) return null
                                const seatId = `${row}${num}`
                                const seat = seats.find((s) => s.id === seatId)
                                return (
                                    <button
                                        key={seatId}
                                        onClick={() => handleSeatClick(seatId)}
                                        className={`w-8 h-8 text-xs font-medium rounded border transition-all duration-200 ${getSeatStyle(
                                            seat?.status || "available",
                                        )}`}
                                        disabled={seat?.status === "reserved"}
                                    >
                                        {num}
                                    </button>
                                )
                            })}

                            {/* 通路 */}
                            <div className="w-4" />

                            {/* 5-16席 */}
                            {Array.from({ length: 12 }, (_, i) => i + 5).map((num) => {
                                if (num > seatsInRow) return null
                                const seatId = `${row}${num}`
                                const seat = seats.find((s) => s.id === seatId)
                                return (
                                    <button
                                        key={seatId}
                                        onClick={() => handleSeatClick(seatId)}
                                        className={`w-8 h-8 text-xs font-medium rounded border transition-all duration-200 ${getSeatStyle(
                                            seat?.status || "available",
                                        )}`}
                                        disabled={seat?.status === "reserved"}
                                    >
                                        {num}
                                    </button>
                                )
                            })}

                            {/* 通路 */}
                            <div className="w-4" />

                            {/* 17-20席 */}
                            {Array.from({ length: 4 }, (_, i) => i + 17).map((num) => {
                                if (num > seatsInRow) return null
                                const seatId = `${row}${num}`
                                const seat = seats.find((s) => s.id === seatId)
                                return (
                                    <button
                                        key={seatId}
                                        onClick={() => handleSeatClick(seatId)}
                                        className={`w-8 h-8 text-xs font-medium rounded border transition-all duration-200 ${getSeatStyle(
                                            seat?.status || "available",
                                        )}`}
                                        disabled={seat?.status === "reserved"}
                                    >
                                        {num}
                                    </button>
                                )
                            })}
                        </div>

                        {/* 行ラベル（右） */}
                        <div className="w-8 text-center text-gold font-medium font-en">{row}</div>
                    </div>
                )
            })
        } else if (currentConfig.layout === "medium") {
            // 中スクリーン（120席）: 2-8-2 配置
            return currentConfig.rows.map((row, rowIndex) => {
                const seatsInRow = currentConfig.seatsPerRow[rowIndex]
                return (
                    <div key={row} className="flex items-center justify-center gap-1">
                        {/* 行ラベル（左） */}
                        <div className="w-8 text-center text-gold font-medium font-en">{row}</div>

                        {/* 座席 */}
                        <div className="flex gap-1">
                            {/* 1-2席 */}
                            {Array.from({ length: 2 }, (_, i) => i + 1).map((num) => {
                                if (num > seatsInRow) return null
                                const seatId = `${row}${num}`
                                const seat = seats.find((s) => s.id === seatId)
                                return (
                                    <button
                                        key={seatId}
                                        onClick={() => handleSeatClick(seatId)}
                                        className={`w-8 h-8 text-xs font-medium rounded border transition-all duration-200 ${getSeatStyle(
                                            seat?.status || "available",
                                        )}`}
                                        disabled={seat?.status === "reserved"}
                                    >
                                        {num}
                                    </button>
                                )
                            })}

                            {/* 通路 */}
                            <div className="w-3" />

                            {/* 3-10席 */}
                            {Array.from({ length: 8 }, (_, i) => i + 3).map((num) => {
                                if (num > seatsInRow) return null
                                const seatId = `${row}${num}`
                                const seat = seats.find((s) => s.id === seatId)
                                return (
                                    <button
                                        key={seatId}
                                        onClick={() => handleSeatClick(seatId)}
                                        className={`w-8 h-8 text-xs font-medium rounded border transition-all duration-200 ${getSeatStyle(
                                            seat?.status || "available",
                                        )}`}
                                        disabled={seat?.status === "reserved"}
                                    >
                                        {num}
                                    </button>
                                )
                            })}

                            {/* 通路 */}
                            <div className="w-3" />

                            {/* 11-12席 */}
                            {Array.from({ length: 2 }, (_, i) => i + 11).map((num) => {
                                if (num > seatsInRow) return null
                                const seatId = `${row}${num}`
                                const seat = seats.find((s) => s.id === seatId)
                                return (
                                    <button
                                        key={seatId}
                                        onClick={() => handleSeatClick(seatId)}
                                        className={`w-8 h-8 text-xs font-medium rounded border transition-all duration-200 ${getSeatStyle(
                                            seat?.status || "available",
                                        )}`}
                                        disabled={seat?.status === "reserved"}
                                    >
                                        {num}
                                    </button>
                                )
                            })}
                        </div>

                        {/* 行ラベル（右） */}
                        <div className="w-8 text-center text-gold font-medium font-en">{row}</div>
                    </div>
                )
            })
        } else {
            // 小スクリーン（70席）: 連続10席配置
            return currentConfig.rows.map((row, rowIndex) => {
                const seatsInRow = currentConfig.seatsPerRow[rowIndex]
                return (
                    <div key={row} className="flex items-center justify-center gap-1">
                        {/* 行ラベル（左） */}
                        <div className="w-8 text-center text-gold font-medium font-en">{row}</div>

                        {/* 座席 */}
                        <div className="flex gap-1">
                            {Array.from({ length: seatsInRow }, (_, i) => i + 1).map((num) => {
                                const seatId = `${row}${num}`
                                const seat = seats.find((s) => s.id === seatId)
                                return (
                                    <button
                                        key={seatId}
                                        onClick={() => handleSeatClick(seatId)}
                                        className={`w-8 h-8 text-xs font-medium rounded border transition-all duration-200 ${getSeatStyle(
                                            seat?.status || "available",
                                        )}`}
                                        disabled={seat?.status === "reserved"}
                                    >
                                        {num}
                                    </button>
                                )
                            })}
                        </div>

                        {/* 行ラベル（右） */}
                        <div className="w-8 text-center text-gold font-medium font-en">{row}</div>
                    </div>
                )
            })
        }
    }

    // 次のページへ進む
    const handleNext = () => {
        if (selectedSeats.length === 0) {
            alert("座席を選択してください")
            return
        }

        const params = new URLSearchParams()
        params.set("movieId", movieInfo.id)
        params.set("seats", selectedSeats.join(","))
        params.set("date", movieInfo.date)
        params.set("time", movieInfo.time)
        params.set("screen", movieInfo.screen)

        router.push(`/tickets/types?${params.toString()}`)
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
                            <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-4 font-en">SEAT SELECTION</h1>
                            <p className="text-xl md:text-2xl text-gold mb-4 font-jp">座席選択</p>
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

                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                        {/* 座席マップ */}
                        <div className="xl:col-span-3">
                            <div className="card-luxury p-4 md:p-8">
                                {/* スクリーン */}
                                <div className="mb-8">
                                    <div className="w-full h-4 bg-gradient-to-r from-transparent via-gold to-transparent rounded-full mb-2" />
                                    <p className="text-center text-gold font-medium font-en">SCREEN</p>
                                </div>

                                {/* スクリーン情報 */}
                                <div className="text-center mb-6">
                                    <p className="text-text-secondary text-sm font-jp">
                                        {movieInfo.screen} - {currentConfig.totalSeats}席
                                    </p>
                                </div>

                                {/* 座席配置 */}
                                <div className="space-y-2 md:space-y-3 mb-8 overflow-x-auto">
                                    <div className="min-w-fit mx-auto space-y-2 md:space-y-3">{renderSeatLayout()}</div>
                                </div>

                                {/* 凡例 */}
                                <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-accent/30 border border-accent/50 rounded" />
                                        <span className="text-text-secondary font-jp">空席</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-gold border border-gold rounded" />
                                        <span className="text-text-secondary font-jp">選択中</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 bg-orange-800/60 border border-orange-700 rounded" />
                                        <span className="text-text-secondary font-jp">予約済み</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 選択座席情報 */}
                        <div className="xl:col-span-1">
                            <div className="card-luxury p-6 sticky top-32">
                                <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2 font-jp">
                                    <Users size={20} className="text-gold" />
                                    選択座席
                                </h3>

                                {selectedSeats.length > 0 ? (
                                    <div className="space-y-3 mb-6">
                                        {selectedSeats.map((seatId) => (
                                            <div key={seatId} className="flex items-center justify-between p-3 bg-darker rounded-lg">
                                                <span className="text-text-primary font-medium font-en">{seatId}</span>
                                                <button
                                                    onClick={() => handleSeatClick(seatId)}
                                                    className="text-red-400 hover:text-red-300 text-sm font-jp"
                                                >
                                                    削除
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-text-muted text-center py-8 font-jp">座席を選択してください</p>
                                )}

                                <div className="text-center text-sm text-text-muted mb-6 font-jp">
                                    {selectedSeats.length}/4席 選択中
                                </div>

                                {/* ナビゲーションボタン */}
                                <div className="space-y-3">
                                    <button
                                        onClick={handleNext}
                                        disabled={selectedSeats.length === 0}
                                        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg font-medium transition-all duration-300 font-jp ${
                                            selectedSeats.length > 0
                                                ? "bg-gradient-to-r from-gold to-gold-light text-darkest hover:shadow-gold-glow"
                                                : "bg-accent/20 text-text-muted cursor-not-allowed"
                                        }`}
                                    >
                                        券種選択へ進む
                                        <ArrowRight size={18} />
                                    </button>

                                    <Link
                                        href="/tickets/date-selection"
                                        className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-accent/30
                      text-text-secondary hover:text-text-primary hover:border-accent/50 rounded-lg transition-all duration-300 font-jp"
                                    >
                                        <ArrowLeft size={18} />
                                        日時選択に戻る
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
