"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, User, Check, ArrowRight } from "lucide-react"

// 座席の状態を定義
type SeatStatus = "available" | "selected" | "booked"

// 座席の型定義
type Seat = {
    id: string
    row: string
    number: number
    status: SeatStatus
}

// 座席データを生成する関数
const generateSeats = (): Seat[] => {
    const seats: Seat[] = []
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]

    rows.forEach((row) => {
        // 各行20席
        for (let i = 1; i <= 20; i++) {
            let status: SeatStatus = "available"

            // いくつかの座席を予約済みに設定
            if (
                (row === "B" && [8, 9, 10, 11].includes(i)) ||
                (row === "D" && [3, 4, 15, 16, 17].includes(i)) ||
                (row === "E" && [7, 8, 9, 10, 11, 12].includes(i)) ||
                (row === "F" && [5, 6].includes(i)) ||
                (row === "G" && [12, 13, 14].includes(i)) ||
                (row === "H" && [1, 2, 18, 19, 20].includes(i))
            ) {
                status = "booked"
            }

            seats.push({
                id: `${row}-${i}`,
                row,
                number: i,
                status,
            })
        }
    })

    return seats
}

export default function SeatReservation() {
    const [seats, setSeats] = useState<Seat[]>(generateSeats())
    const [selectedSeats, setSelectedSeats] = useState<string[]>([])

    // 座席クリック時の処理
    const handleSeatClick = (seatId: string) => {
        const seat = seats.find((s) => s.id === seatId)
        if (!seat || seat.status === "booked") return

        setSeats((prevSeats) =>
            prevSeats.map((s) => {
                if (s.id === seatId) {
                    if (s.status === "selected") {
                        setSelectedSeats((prev) => prev.filter((id) => id !== seatId))
                        return { ...s, status: "available" as SeatStatus }
                    } else if (s.status === "available") {
                        setSelectedSeats((prev) => [...prev, seatId])
                        return { ...s, status: "selected" as SeatStatus }
                    }
                }
                return s
            }),
        )
    }

    // 座席の表示スタイルを取得
    const getSeatStyle = (seat: Seat) => {
        const baseStyle =
            "w-7 h-7 m-0.5 rounded-t-lg border-2 cursor-pointer transition-all duration-200 flex items-center justify-center text-xs font-bold"

        switch (seat.status) {
            case "available":
                return `${baseStyle} bg-text-primary border-text-primary hover:bg-gold hover:border-gold hover:scale-110 text-darkest`
            case "selected":
                return `${baseStyle} bg-gold border-gold text-darkest scale-110 shadow-gold-glow`
            case "booked":
                return `${baseStyle} bg-accent border-accent cursor-not-allowed opacity-50 text-text-muted`
            default:
                return baseStyle
        }
    }

    // 座席番号を表示
    const getSeatNumber = (seat: Seat) => {
        if (seat.status === "selected") {
            return <Check size={10} />
        }
        return seat.number
    }

    // 次のページへのリンクを生成（選択座席をクエリパラメータで渡す）
    const getNextPageLink = () => {
        if (selectedSeats.length === 0) return "#"
        const seatsParam = selectedSeats.sort().join(",")
        return `/tickets/types?seats=${encodeURIComponent(seatsParam)}`
    }

    return (
        <div className="min-h-screen pt-24">
            {/* ヒーローセクション */}
            <section className="relative h-[20vh] overflow-hidden">
                <div className="absolute inset-0">
                    <Image src="/images/theater-interior.jpg" alt="劇場内観" fill className="object-cover" priority />
                    <div className="absolute inset-0 bg-gradient-to-r from-darkest/90 via-darkest/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-darkest/80 via-transparent to-darkest/40" />
                </div>

                <div className="relative h-full flex items-center">
                    <div className="container-luxury">
                        <div className="flex items-center gap-4">
                            <Link
                                href="/movies"
                                className="w-12 h-12 bg-accent/20 hover:bg-accent/30 text-gold
                  rounded-full flex items-center justify-center transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </Link>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-text-primary font-en">SEAT SELECTION</h1>
                                <p className="text-lg text-gold font-jp">座席選択</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* メインコンテンツ */}
            <section className="py-8">
                <div className="container-luxury">
                    <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
                        {/* 座席マップ */}
                        <div className="xl:col-span-3">
                            <div className="card-luxury p-6 md:p-8">
                                {/* 凡例 */}
                                <div className="flex flex-wrap items-center justify-center gap-6 mb-8 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-text-primary border-2 border-text-primary rounded-t-lg flex items-center justify-center text-xs font-bold text-darkest">
                                            1
                                        </div>
                                        <span className="font-jp">空席</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-gold border-2 border-gold rounded-t-lg flex items-center justify-center">
                                            <Check size={12} className="text-darkest" />
                                        </div>
                                        <span className="font-jp">選択中</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 bg-accent border-2 border-accent rounded-t-lg opacity-50 flex items-center justify-center text-xs font-bold text-text-muted">
                                            ×
                                        </div>
                                        <span className="font-jp">予約済み</span>
                                    </div>
                                </div>

                                {/* スクリーン */}
                                <div className="mb-8">
                                    <div className="w-full h-4 bg-text-primary rounded-lg shadow-luxury mx-auto max-w-4xl"></div>
                                    <p className="text-center text-text-muted mt-2 font-jp">スクリーン</p>
                                </div>

                                {/* 座席レイアウト */}
                                <div className="overflow-x-auto">
                                    <div className="min-w-fit mx-auto">
                                        {["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"].map((row) => (
                                            <div key={row} className="flex items-center justify-center mb-1">
                                                {/* 左側の行ラベル */}
                                                <div className="w-8 text-center text-gold font-bold mr-2 font-en">{row}</div>

                                                {/* 座席 */}
                                                <div className="flex">
                                                    {seats
                                                        .filter((seat) => seat.row === row)
                                                        .map((seat, index) => (
                                                            <div key={seat.id} className="flex">
                                                                <button
                                                                    onClick={() => handleSeatClick(seat.id)}
                                                                    className={getSeatStyle(seat)}
                                                                    disabled={seat.status === "booked"}
                                                                    title={`${seat.row}-${seat.number}`}
                                                                >
                                                                    {getSeatNumber(seat)}
                                                                </button>
                                                                {/* 通路スペース */}
                                                                {(seat.number === 5 || seat.number === 15) && <div className="w-3"></div>}
                                                            </div>
                                                        ))}
                                                </div>

                                                {/* 右側の行ラベル */}
                                                <div className="w-8 text-center text-gold font-bold ml-2 font-en">{row}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 選択情報パネル */}
                        <div className="xl:col-span-1">
                            <div className="card-luxury p-6 sticky top-32">
                                <h3 className="text-xl font-bold text-gold mb-6 font-jp">選択した座席</h3>

                                {selectedSeats.length > 0 ? (
                                    <div className="space-y-4">
                                        {/* 選択座席リスト */}
                                        <div className="space-y-2 max-h-64 overflow-y-auto">
                                            {selectedSeats.sort().map((seatId) => (
                                                <div key={seatId} className="flex items-center justify-between p-3 bg-darker rounded-lg">
                                                    <span className="text-text-primary font-medium font-en">{seatId}</span>
                                                    <button
                                                        onClick={() => handleSeatClick(seatId)}
                                                        className="text-text-muted hover:text-gold transition-colors text-lg"
                                                    >
                                                        ×
                                                    </button>
                                                </div>
                                            ))}
                                        </div>

                                        {/* 座席数 */}
                                        <div className="border-t border-accent/20 pt-4">
                                            <div className="flex justify-between items-center mb-6">
                                                <span className="text-text-secondary font-jp">選択座席数</span>
                                                <span className="text-gold font-bold text-lg font-en">{selectedSeats.length}席</span>
                                            </div>
                                        </div>

                                        {/* 次へボタン */}
                                        <Link
                                            href={getNextPageLink()}
                                            className="btn-luxury w-full flex items-center justify-center gap-2 font-jp"
                                        >
                                            チケット選択へ
                                            <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                ) : (
                                    <div className="text-center py-8">
                                        <User size={48} className="text-accent mx-auto mb-4" />
                                        <p className="text-text-muted font-jp">座席を選択してください</p>
                                    </div>
                                )}

                                {/* 注意事項 */}
                                <div className="mt-8 p-4 bg-darker rounded-lg">
                                    <h4 className="text-sm font-bold text-gold mb-2 font-jp">ご注意</h4>
                                    <ul className="text-xs text-text-muted space-y-1 font-jp">
                                        <li>• 一度に最大8席まで選択可能</li>
                                        <li>• 座席の変更は上映開始30分前まで可能</li>
                                        <li>• 選択した座席は10分間仮押さえされます</li>
                                        <li>• 最適な鑑賞のため中央付近をおすすめします</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
