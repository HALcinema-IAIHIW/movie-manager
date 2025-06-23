"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, MapPin, ChevronDown, Check } from "lucide-react"

// チケットタイプの型定義
type TicketType = {
    id: string
    name: string
    price: number
    description: string
    category: "adult" | "student" | "child"
}

// 座席チケット割り当ての型定義
type SeatTicketAssignment = {
    seatId: string
    ticketTypeId: string | null
}

// チケットタイプデータ
const ticketTypes: TicketType[] = [
    {
        id: "general",
        name: "一般",
        price: 1800,
        description: "18歳以上の方",
        category: "adult",
    },
    {
        id: "university",
        name: "大学生・専門学生",
        price: 1600,
        description: "学生証の提示が必要です",
        category: "student",
    },
    {
        id: "highschool",
        name: "高校生・中学生",
        price: 1400,
        description: "学生証の提示が必要です",
        category: "student",
    },
    {
        id: "elementary",
        name: "小学生・幼児",
        price: 1000,
        description: "3歳以上小学生以下",
        category: "child",
    },
]

export default function TicketTypes() {
    const searchParams = useSearchParams()
    const [selectedSeats, setSelectedSeats] = useState<string[]>([])
    const [seatAssignments, setSeatAssignments] = useState<SeatTicketAssignment[]>([])

    // URLパラメータから座席情報を取得
    useEffect(() => {
        const seatsParam = searchParams.get("seats")
        if (seatsParam) {
            const seats = seatsParam.split(",").filter(Boolean).sort()
            setSelectedSeats(seats)

            // 各座席に対してチケット割り当てを初期化
            setSeatAssignments(
                seats.map((seatId) => ({
                    seatId,
                    ticketTypeId: null,
                })),
            )
        }
    }, [searchParams])

    // 座席のチケットタイプを更新
    const updateSeatTicketType = (seatId: string, ticketTypeId: string) => {
        setSeatAssignments((prev) =>
            prev.map((assignment) => (assignment.seatId === seatId ? { ...assignment, ticketTypeId } : assignment)),
        )
    }

    // 全ての座席にチケットタイプが割り当てられているかチェック
    const allSeatsAssigned = seatAssignments.every((assignment) => assignment.ticketTypeId !== null)

    // 総金額を計算
    const totalAmount = seatAssignments.reduce((sum, assignment) => {
        if (!assignment.ticketTypeId) return sum
        const ticket = ticketTypes.find((t) => t.id === assignment.ticketTypeId)
        return sum + (ticket ? ticket.price : 0)
    }, 0)

    // チケットタイプ別の集計
    const ticketSummary = seatAssignments.reduce(
        (summary, assignment) => {
            if (!assignment.ticketTypeId) return summary

            const existing = summary.find((item) => item.ticketTypeId === assignment.ticketTypeId)
            if (existing) {
                existing.count += 1
            } else {
                const ticket = ticketTypes.find((t) => t.id === assignment.ticketTypeId)
                if (ticket) {
                    summary.push({
                        ticketTypeId: assignment.ticketTypeId,
                        ticketType: ticket,
                        count: 1,
                    })
                }
            }
            return summary
        },
        [] as { ticketTypeId: string; ticketType: TicketType; count: number }[],
    )

    // 次のページへのリンクを生成
    const getNextPageLink = () => {
        if (!allSeatsAssigned) return "#"
        const seatsParam = selectedSeats.join(",")
        const assignmentsParam = seatAssignments
            .map((assignment) => `${assignment.seatId}:${assignment.ticketTypeId}`)
            .join(",")
        return `/tickets/confirm?seats=${encodeURIComponent(seatsParam)}&assignments=${encodeURIComponent(assignmentsParam)}`
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
                                href={`/tickets/seats`}
                                className="w-12 h-12 bg-accent/20 hover:bg-accent/30 text-gold
                  rounded-full flex items-center justify-center transition-colors"
                            >
                                <ArrowLeft size={20} />
                            </Link>
                            <div>
                                <h1 className="text-3xl md:text-4xl font-bold text-text-primary font-en">TICKET ASSIGNMENT</h1>
                                <p className="text-lg text-gold font-jp">チケット割り当て</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* メインコンテンツ */}
            <section className="py-16">
                <div className="container-luxury">
                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* 座席チケット割り当て */}
                            <div className="lg:col-span-2">
                                <div className="flex items-center gap-3 mb-8">
                                    <MapPin size={24} className="text-gold" />
                                    <h2 className="text-2xl font-bold text-text-primary font-jp">各座席のチケットタイプを選択</h2>
                                </div>

                                {selectedSeats.length > 0 ? (
                                    <div className="space-y-4">
                                        {seatAssignments.map((assignment) => {
                                            const selectedTicket = assignment.ticketTypeId
                                                ? ticketTypes.find((t) => t.id === assignment.ticketTypeId)
                                                : null

                                            return (
                                                <div key={assignment.seatId} className="card-luxury p-6">
                                                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                                                        {/* 座席番号 */}
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
                                                                <span className="text-gold font-bold font-en">{assignment.seatId}</span>
                                                            </div>
                                                            <div>
                                                                <p className="text-text-primary font-medium font-jp">座席</p>
                                                                <p className="text-text-muted text-sm font-en">{assignment.seatId}</p>
                                                            </div>
                                                        </div>

                                                        {/* チケットタイプ選択 */}
                                                        <div className="flex-1">
                                                            <div className="relative">
                                                                <select
                                                                    value={assignment.ticketTypeId || ""}
                                                                    onChange={(e) => updateSeatTicketType(assignment.seatId, e.target.value)}
                                                                    className="w-full px-4 py-3 bg-darker border border-accent/30 rounded-lg
                                    text-text-primary focus:border-gold focus:outline-none transition-colors
                                    appearance-none cursor-pointer font-jp"
                                                                >
                                                                    <option value="" className="font-jp">
                                                                        チケットタイプを選択してください
                                                                    </option>
                                                                    {ticketTypes.map((ticket) => (
                                                                        <option key={ticket.id} value={ticket.id} className="font-jp">
                                                                            {ticket.name} - ¥{ticket.price.toLocaleString()}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                                <ChevronDown
                                                                    size={20}
                                                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gold pointer-events-none"
                                                                />
                                                            </div>

                                                            {/* 選択されたチケットの詳細 */}
                                                            {selectedTicket && (
                                                                <div className="mt-3 p-3 bg-gold/10 rounded-lg border border-gold/20">
                                                                    <div className="flex items-center justify-between">
                                                                        <div>
                                                                            <p className="text-gold font-medium font-jp">{selectedTicket.name}</p>
                                                                            <p className="text-text-muted text-sm font-jp">{selectedTicket.description}</p>
                                                                        </div>
                                                                        <div className="text-right">
                                                                            <p className="text-gold font-bold text-lg font-en">
                                                                                ¥{selectedTicket.price.toLocaleString()}
                                                                            </p>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* 選択完了アイコン */}
                                                        <div className="flex items-center justify-center">
                                                            {assignment.ticketTypeId ? (
                                                                <div className="w-8 h-8 bg-gold rounded-full flex items-center justify-center">
                                                                    <Check size={16} className="text-darkest" />
                                                                </div>
                                                            ) : (
                                                                <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center">
                                                                    <span className="text-accent text-xs">?</span>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <div className="card-luxury p-8 text-center">
                                        <p className="text-text-muted font-jp">座席が選択されていません</p>
                                    </div>
                                )}
                            </div>

                            {/* 選択サマリー */}
                            <div className="lg:col-span-1">
                                <div className="card-luxury p-6 sticky top-32">
                                    <h3 className="text-xl font-bold text-gold mb-6 font-jp">選択内容</h3>

                                    {/* 進捗状況 */}
                                    <div className="mb-6">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-text-secondary font-jp">割り当て進捗</span>
                                            <span className="text-text-primary font-en">
                        {seatAssignments.filter((a) => a.ticketTypeId).length} / {selectedSeats.length}
                      </span>
                                        </div>
                                        <div className="w-full bg-accent/20 rounded-full h-2">
                                            <div
                                                className="bg-gold h-2 rounded-full transition-all duration-300"
                                                style={{
                                                    width: `${(seatAssignments.filter((a) => a.ticketTypeId).length / selectedSeats.length) * 100}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* チケット集計 */}
                                    {ticketSummary.length > 0 && (
                                        <div className="mb-6">
                                            <h4 className="text-lg font-medium text-text-primary mb-4 font-jp">チケット集計</h4>
                                            <div className="space-y-3">
                                                {ticketSummary.map((item) => (
                                                    <div
                                                        key={item.ticketTypeId}
                                                        className="flex justify-between items-center p-3 bg-darker rounded-lg"
                                                    >
                                                        <div>
                                                            <p className="text-text-primary font-medium font-jp">{item.ticketType.name}</p>
                                                            <p className="text-text-muted text-sm font-en">
                                                                ¥{item.ticketType.price.toLocaleString()} × {item.count}
                                                            </p>
                                                        </div>
                                                        <p className="text-gold font-bold font-en">
                                                            ¥{(item.ticketType.price * item.count).toLocaleString()}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* 合計金額 */}
                                    {totalAmount > 0 && (
                                        <div className="border-t border-accent/20 pt-4 mb-6">
                                            <div className="flex justify-between items-center">
                                                <span className="text-lg font-medium text-text-secondary font-jp">合計金額</span>
                                                <span className="text-2xl font-bold text-gold font-en">¥{totalAmount.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* 状態メッセージ */}
                                    {!allSeatsAssigned && selectedSeats.length > 0 && (
                                        <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg mb-6">
                                            <p className="text-accent text-sm font-jp">すべての座席にチケットタイプを選択してください</p>
                                        </div>
                                    )}

                                    {/* 確認ボタン */}
                                    <Link
                                        href={getNextPageLink()}
                                        className={`w-full flex items-center justify-center gap-2 font-jp transition-all duration-300 ${
                                            allSeatsAssigned
                                                ? "btn-luxury"
                                                : "px-6 py-3 bg-accent/20 text-text-muted cursor-not-allowed rounded-none"
                                        }`}
                                        onClick={(e) => {
                                            if (!allSeatsAssigned) {
                                                e.preventDefault()
                                            }
                                        }}
                                    >
                                        予約確認へ
                                        <ArrowRight size={18} />
                                    </Link>

                                    {/* 注意事項 */}
                                    <div className="mt-8 p-4 bg-darker rounded-lg">
                                        <h4 className="text-sm font-bold text-gold mb-2 font-jp">ご注意</h4>
                                        <ul className="text-xs text-text-muted space-y-1 font-jp">
                                            <li>• 各座席に対してチケットタイプの選択が必要です</li>
                                            <li>• 学生料金は学生証の提示が必要</li>
                                            <li>• 3歳未満は膝上鑑賞で無料</li>
                                            <li>• 料金は税込価格です</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
