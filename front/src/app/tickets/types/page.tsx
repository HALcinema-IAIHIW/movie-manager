"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, ArrowRight, Users, Calendar, Clock, MapPin, Ticket } from "lucide-react"
import {parse} from "date-fns";

// 券種の型定義 (roleId を含むように変更)
type TicketType = {
    id: string // これは従来のid (e.g., "general")
    name: string
    price: number
    roleId?: string // バックエンドから取得するroleId
}

// 選択された座席と券種の型定義 (seatIdStr と seatId を含むように変更)
type SeatTicket = {
    seatIdStr: string // "A1", "B2" などの元の座席文字列 (表示用)
    seatId?: string // バックエンドから取得する座席ID (API送信用)
    ticketType: TicketType
}

// 券種データ (初期データとしてnameとpriceを保持)
const initialTicketTypes: TicketType[] = [
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
    screen: string // スクリーン名またはID
    poster: string
}

export default function TicketTypeSelection() {
    const router = useRouter()
    const [selectedSeatStrs, setSelectedSeatStrs] = useState<string[]>([]) // 選択された座席文字列 (例: "A1")
    const [seatTickets, setSeatTickets] = useState<SeatTicket[]>([])
    const [movieInfo, setMovieInfo] = useState<MovieInfo | null>(null)
    const [totalPrice, setTotalPrice] = useState(0)
    const [isLoading, setIsLoading] = useState(true) // ローディング状態を追加
    const [error, setError] = useState<string | null>(null) // エラー状態を追加
    const [currentScreeningId, setCurrentScreeningId] = useState<string | null>(null);

    const [ticketTypes, setTicketTypes] = useState<TicketType[]>(initialTicketTypes);

    // APIから座席IDとロールIDをフェッチする関数
    const fetchRequiredIds = useCallback(async (screenId: string, seatStrs: string[]) => {
        try {
            // 1. 全ての座席IDを取得
            const seatIdPromises = seatStrs.map(async (seatStr) => {
                const response = await fetch(`http://localhost:8080/seats/find/${screenId}/${seatStr}`)
                if (!response.ok) {
                    throw new Error(`Failed to fetch seat ID for ${seatStr}`)
                }
                const data = await response.json()
                // ここで取得したデータ構造に合わせて調整してください。
                // 例: { seat_id: "..." } のような構造の場合
                return { seatStr, seatId: data.seat_id || data.id } // APIレスポンスに合わせて調整
            })
            const fetchedSeatIds = await Promise.all(seatIdPromises)
            const seatIdMap = new Map(fetchedSeatIds.map(item => [item.seatStr, item.seatId]))

            // 2. 全てのロールIDを取得
            const roleIdPromises = ticketTypes.map(async (ticketType) => {
                const response = await fetch(`http://localhost:8080/roles/${encodeURIComponent(ticketType.name)}`)
                if (!response.ok) {
                    // ロールが見つからない場合でもエラーにしないか、デフォルト値を設定するなど考慮
                    console.warn(`Failed to fetch role ID for ${ticketType.name}. It might not exist.`)
                    return { ...ticketType, roleId: undefined } // ロールIDがなくても続行
                }
                const data = await response.json()
                const fetchedRoleId = data.role_id || data.id; // 取得したroleId
                console.log(`Fetched roleId for ${ticketType.name} (ID: ${ticketType.id}):`, fetchedRoleId); // ⭐ ここを追加
                return { ...ticketType, roleId: fetchedRoleId }
            })
            const fetchedTicketTypesWithRoleIds = await Promise.all(roleIdPromises)
            setTicketTypes(fetchedTicketTypesWithRoleIds);
            // 取得したロールIDをticketTypesにマージ
            const updatedTicketTypes = ticketTypes.map(originalType => {
                const found = fetchedTicketTypesWithRoleIds.find(f => f.id === originalType.id);
                return found ? found : originalType;
            });



            // 初期 seatTickets の作成
            const initialSeatTickets = seatStrs.map((seatStr) => ({
                seatIdStr: seatStr,
                seatId: seatIdMap.get(seatStr), // 取得した座席IDを設定
                ticketType: updatedTicketTypes[0], // デフォルトで最初の券種を設定
            }))

            setSeatTickets(initialSeatTickets)
            return updatedTicketTypes; // 更新されたチケットタイプを返す
        } catch (err) {
            console.error("Error fetching IDs:", err)
            setError("必要な情報を取得できませんでした。再度お試しください。")
            return [];
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        if (typeof window === "undefined") return

        const stored = sessionStorage.getItem("seatSelection")
        if (!stored) {
            router.push("/tickets/seats")
            return
        }

        const parsed = JSON.parse(stored)
        const currentSelectedSeatStrs = parsed.selectedSeats
        setSelectedSeatStrs(currentSelectedSeatStrs)

        const screeningIdFromStorage = parsed.screeningId;
        if (screeningIdFromStorage) {
            setCurrentScreeningId(screeningIdFromStorage);
        }

        const currentMovieInfo = {
            id: parsed.movieId,
            title: "インターステラー", // 本来はAPIなどから取得
            date: parsed.date,
            time: parsed.time,
            screen: parsed.screen,
            poster: "/images/movie-poster-1.jpg",
        }
        setMovieInfo(currentMovieInfo)

        // 座席文字列とスクリーンIDが取得できたらAPIを呼び出す
        if (currentMovieInfo.screen && currentSelectedSeatStrs.length > 0) {
            fetchRequiredIds(currentMovieInfo.screen, currentSelectedSeatStrs).then((updatedTypes) => {
                // ticketTypesのstate更新は不要なため、ここで直接使用
                // setTicketTypes(updatedTypes) のようなstateは不要
            });
        } else {
            setIsLoading(false); // 情報が不足している場合はロードを終了
            setError("座席またはスクリーン情報が不足しています。");
        }
    }, [router, fetchRequiredIds])

    // 合計金額を計算
    useEffect(() => {
        const total = seatTickets.reduce((sum, seatTicket) => sum + seatTicket.ticketType.price, 0)
        setTotalPrice(total)
    }, [seatTickets])

    // 券種変更の処理
    const handleTicketTypeChange = (seatStr: string, ticketTypeId: string) => {
        // 現在の ticketTypes に、fetchRequiredIds で取得した roleId が含まれていることを前提とします
        const ticketType = ticketTypes.find((t) => t.id === ticketTypeId)
        if (!ticketType) return

        setSeatTickets((prev) =>
            prev.map((seatTicket) =>
                seatTicket.seatIdStr === seatStr ? { ...seatTicket, ticketType } : seatTicket,
            ),
        )
    }

    // 次のページへ進む
    const handleNext = () => {
        const params = new URLSearchParams()
        params.set("movieId", movieInfo?.id || "")
        params.set("date", movieInfo?.date || "")
        params.set("time", movieInfo?.time || "")
        params.set("screen", movieInfo?.screen || "")
        if (currentScreeningId) {
            params.set("screeningId", currentScreeningId);
        }

        // seatTickets を、変換後の seatId と roleId を含む形式で送信
        const seatTicketsForPayment = seatTickets.map(st => {
            const roleId = ticketTypes.find(tt => tt.id === st.ticketType.id)?.roleId;
            return {
                seatId: st.seatId, // APIから取得した座席ID
                roleId: roleId, // APIから取得したロールID
                price: st.ticketType.price,
                seatIdStr: st.seatIdStr, // 表示用に元の文字列も残しておく
                ticketTypeName: st.ticketType.name,
            };
        });

        params.set("seatTickets", JSON.stringify(seatTicketsForPayment))
        params.set("totalPrice", totalPrice.toString())

        router.push(`/tickets/payment?${params.toString()}`)
    }

    // 前のページに戻る
    const handleBack = () => {
        const params = new URLSearchParams()
        // この辺の情報いらないかも　座席の情報渡して選択状態にするぐらいか？
        // params.set("movieId", movieInfo?.id || "")
        // params.set("date", movieInfo?.date || "")
        // params.set("time", movieInfo?.time || "")
        // params.set("screen", movieInfo?.screen || "")
        // screening_idがscIdとして渡されている必要がある

        if (currentScreeningId) {
            params.set("scId", currentScreeningId);
        }
        router.push(`/tickets/seats?${params.toString()}`)
    }

    if (isLoading) {
        return <div className="min-h-screen pt-24 flex items-center justify-center text-text-primary">Loading...</div>
    }

    if (error) {
        return <div className="min-h-screen pt-24 flex items-center justify-center text-red-500">Error: {error}</div>
    }

    if (!movieInfo) {
        return <div className="min-h-screen pt-24 flex items-center justify-center text-text-primary">映画情報がありません。</div>
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
                                    {seatTickets.map((seatTicket) => (
                                        <div key={seatTicket.seatIdStr} className="border border-accent/20 rounded-lg p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-gold text-darkest rounded-lg flex items-center justify-center font-bold font-en">
                                                        {seatTicket.seatIdStr}
                                                    </div>
                                                    <span className="text-lg font-medium text-text-primary font-jp">
                                                        座席 {seatTicket.seatIdStr}
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
                                                    onChange={(e) => handleTicketTypeChange(seatTicket.seatIdStr, e.target.value)}
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
                                        <div key={seatTicket.seatIdStr} className="flex items-center justify-between p-3 bg-darker rounded-lg">
                                            <div>
                                                <p className="text-text-primary font-medium font-en">{seatTicket.seatIdStr}</p>
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