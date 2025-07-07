// src/app/tickets/seats/page.tsx

"use client" // Next.js App Routerのクライアントコンポーネント指定

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, Users, MapPin, Calendar, Clock } from "lucide-react"
// createSeat はもう直接は使わないのでコメントアウトか削除
// import { createSeat } from "../../libs/api/seat"


// 座席の状態を定義
type SeatStatus = "available" | "reserved" | "selected"

// 座席データの型定義
type Seat = {
    row: string
    number: number
    status: SeatStatus
    id: string // 例: "A1"
}

// MovieInfo 型に poster を戻す
type MovieInfo = {
    id: string
    title: string
    date: string
    time: string
    endTime: string
    screen: string
    poster: string; // ★poster をここに戻すよ★
}

// スクリーン設定の型定義 (既存のまま)
type ScreenConfig = {
    rows: string[]
    seatsPerRow: number[]
    totalSeats: number
    layout: "large" | "medium" | "small"
}

// スクリーン設定 (既存のまま)
const screenConfigs: { [key: string]: ScreenConfig } = {
    "スクリーン1": {
        rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        seatsPerRow: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
        totalSeats: 200,
        layout: "large",
    },
    "スクリーン2": {
        rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        seatsPerRow: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
        totalSeats: 200,
        layout: "large",
    },
    "スクリーン3": {
        rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        seatsPerRow: [20, 20, 20, 20, 20, 20, 20, 20, 20, 20],
        totalSeats: 200,
        layout: "large",
    },
    "スクリーン4": {
        rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        seatsPerRow: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
        totalSeats: 120,
        layout: "medium",
    },
    "スクリーン5": {
        rows: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
        seatsPerRow: [12, 12, 12, 12, 12, 12, 12, 12, 12, 12],
        totalSeats: 120,
        layout: "medium",
    },
    "スクリーン6": {
        rows: ["A", "B", "C", "D", "E", "F", "G"],
        seatsPerRow: [10, 10, 10, 10, 10, 10, 10],
        totalSeats: 70,
        layout: "small",
    },
    "スクリーン7": {
        rows: ["A", "B", "C", "D", "E", "F", "G"],
        seatsPerRow: [10, 10, 10, 10, 10, 10, 10],
        totalSeats: 70,
        layout: "small",
    },
    "スクリーン8": {
        rows: ["A", "B", "C", "D", "E", "F", "G"],
        seatsPerRow: [10, 10, 10, 10, 10, 10, 10],
        totalSeats: 70,
        layout: "small",
    },
}

// バックエンドからの予約済み座席レスポンスの型
type ReservedSeatResponse = {
    reservation_seat_id: number;
    purchase_id: number;
    seat_id: number;
    is_cancelled: boolean;
    seat_number: string; // "A1" のような形式
}

// バックエンドの CreatePurchaseRequest に合わせる新しい型定義
type CreatePurchaseDetail = {
    role_id: number; // チケットの種類（例: 大人、学生）
    quantity: number; // 数量
}

type CreatePurchaseData = {
    user_id: number;
    screening_id: number;
    purchase_time: string; // ISO 8601形式の購入日時 (例: "2025-07-07T15:30:00+09:00")
    purchase_details: CreatePurchaseDetail[];
    selected_seat_ids: string[]; // 選択された座席のIDリスト (例: ["A1", "B2"])
}


export default function SeatSelection() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [selectedSeats, setSelectedSeats] = useState<string[]>([])
    const [seats, setSeats] = useState<Seat[]>([])
    const [movieInfo, setMovieInfo] = useState<MovieInfo>({
        id: "",
        title: "",
        date: "",
        time: "",
        endTime:"",
        screen: "",
        poster: "", // 初期値に追加
    })
    const [currentConfig, setCurrentConfig] = useState<ScreenConfig>(screenConfigs["スクリーン1"])

    // URLパラメータから情報を取得
    const scId = searchParams.get("scId") // ScreeningID (string)
    const [screeningId, setScreeningId] = useState<string | null>(null); // StateをscIdのstring型に合わせる

    // URLパラメータからScreeningIDを取得し、映画情報をフェッチ
    useEffect(() => {
        if (!scId) {
            console.warn("URLパラメータにscIdがありません。");
            return;
        }
        setScreeningId(scId); // scIdをscreeningIdステートにセット

        const fetchMovieAndScreeningInfo = async () => {
            try {
                // Screeningの詳細情報を取得するAPIを呼び出す
                const response = await fetch(`http://localhost:8080/screenings/${scId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch screening data");
                }
                const data = await response.json(); // APIレスポンスの型は後で厳密に定義すると良い
                console.log("Screening API response:", data);

                // APIレスポンスの形式チェックを強化
                if (!data || !data.screening_period || !data.screening_period.movie ||
                    !data.screening_period.screen || !data.start_time || !data.duration) {
                    console.error("APIレスポンスの形式が期待と違います。必要なデータが不足しています。");
                    // 必要ならエラーメッセージ表示やfallback処理
                    return;
                }

                // 日付と時刻のフォーマット
                const movieDate = new Date(data.date).toLocaleDateString("ja-JP", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                }); // "2024年5月5日"
                const startTime = new Date(data.start_time).toLocaleTimeString("ja-JP", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false, // 24時間表示
                }); // "14:00"

                // 上映終了時刻の計算 (startTime + duration)
                const startDateTime = new Date(data.start_time);
                const endTime = new Date(startDateTime.getTime() + data.duration * 60 * 1000).toLocaleTimeString("ja-JP", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                });

                // スクリーン名（IDを文字列にしたキー）
                const screenNameKey = `スクリーン${data.screening_period.screen.id}`;


                setMovieInfo({
                    id: data.screening_period.movie.id.toString(),
                    title: data.screening_period.movie.title,
                    date: movieDate,
                    time: startTime,
                    endTime: endTime, // 計算したendTimeを設定
                    screen: screenNameKey, // Screen IDを文字列にしたキー
                    poster: data.screening_period.movie.posterPath || "/images/movie-poster-1.jpg", // PosterPathを使用
                });

                setCurrentConfig(screenConfigs[screenNameKey] || screenConfigs["スクリーン1"]);

            } catch (err) {
                console.error("映画情報取得エラー:", err);
                // 必要ならエラーメッセージ表示や fallback 処理を書く
            }
        };

        fetchMovieAndScreeningInfo();

    }, [scId]); // scId が変更されたときに実行


    // 座席データの初期化と予約済み座席のフェッチ
    useEffect(() => {
        // screeningId と currentConfig が揃ってから実行
        // currentConfig.rows.length はスクリーン設定がロードされたことを確認するため
        // movieInfo.screen はこのuseEffectの予約済み座席フェッチには直接関係ないので依存から外す
        if (!screeningId || !currentConfig.rows.length) return;

        const initializeSeats = async () => {
            const initialSeatData: Seat[] = [];

            // 全座席の初期状態を"available"として生成
            currentConfig.rows.forEach((row, rowIndex) => {
                const seatsInRow = currentConfig.seatsPerRow[rowIndex] || 0;
                for (let i = 1; i <= seatsInRow; i++) {
                    const seatId = `${row}${i}`;
                    initialSeatData.push({
                        row,
                        number: i,
                        status: "available" as SeatStatus, // 明示的にSeatStatusにキャスト
                        id: seatId,
                    });
                }
            });

            // ★予約済み座席のフェッチ★ (screeningIDベース)
            try {
                // APIエンドポイントを /reservation-seats/screening/:screeningID に変更
                // movieInfo.screen から actualScreenId を抽出するロジックは、
                // このAPI呼び出しでは不要。screeningId を直接使う。
                const response = await fetch(`http://localhost:8080/reservationseats/screening/${screeningId}`);
                if (!response.ok) {
                    // エラーレスポンスのボディを読んで、より詳細なエラーメッセージを出す
                    const errorData = await response.json();
                    throw new Error(`予約済み座席の取得に失敗しました: ${response.statusText} - ${errorData.error || '不明なエラー'}`);
                }
                const reservedSeatsData: ReservedSeatResponse[] = await response.json();
                console.log("Reserved Seats API response:", reservedSeatsData);

                // 予約済み座席のステータスを更新
                const updatedSeats = initialSeatData.map(seat => {
                    const isReserved = reservedSeatsData.some(reservedSeat => reservedSeat.seat_number === seat.id);
                    if (isReserved) {
                        return { ...seat, status: "reserved" as SeatStatus };
                    }
                    return seat;
                });
                setSeats(updatedSeats);
            } catch (err) {
                console.error("予約済み座席情報取得エラー:", err);
                setSeats(initialSeatData); // エラー時は初期生成した座席データ（すべてavailable）を使用
            } finally {
                setSelectedSeats([]); // スクリーン変更時に選択をリセット
            }
        };

        initializeSeats();

    }, [screeningId, currentConfig]); // movieInfo.screen を依存配列から削除


    // 座席選択の処理 (既存のまま)
    const handleSeatClick = (seatId: string) => {
        const seat = seats.find((s) => s.id === seatId)
        if (!seat || seat.status === "reserved") return

        if (selectedSeats.includes(seatId)) {
            // 選択解除
            setSelectedSeats(selectedSeats.filter((id) => id !== seatId))
            setSeats(seats.map((s) => (s.id === seatId ? { ...s, status: "available" as SeatStatus } : s)))
        } else {
            // 最大4席まで選択可能
            if (selectedSeats.length >= 4) {
                alert("最大4席まで選択できます")
                return
            }
            // 選択
            setSelectedSeats([...selectedSeats, seatId])
            setSeats(seats.map((s) => (s.id === seatId ? { ...s, status: "selected" as SeatStatus } : s)))
        }
    }

    // 座席のスタイルを取得 (既存のまま)
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

    // 座席レイアウトのレンダリング (既存のまま)
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
                                const seatId = `${row}${num}`
                                const seat = seats.find((s) => s.id === seatId)
                                return (
                                    <button
                                        key={seatId}
                                        onClick={() => handleSeatClick(seatId)}
                                        className={`w-8 h-8 text-xs font-medium rounded border transition-all duration-200 ${getSeatStyle(
                                            seat?.status || "available" as SeatStatus,
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
                                const seatId = `${row}${num}`
                                const seat = seats.find((s) => s.id === seatId)
                                return (
                                    <button
                                        key={seatId}
                                        onClick={() => handleSeatClick(seatId)}
                                        className={`w-8 h-8 text-xs font-medium rounded border transition-all duration-200 ${getSeatStyle(
                                            seat?.status || "available" as SeatStatus,
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
                                            seat?.status || "available" as SeatStatus,
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
                                const seatId = `${row}${num}`
                                const seat = seats.find((s) => s.id === seatId)
                                return (
                                    <button
                                        key={seatId}
                                        onClick={() => handleSeatClick(seatId)}
                                        className={`w-8 h-8 text-xs font-medium rounded border transition-all duration-200 ${getSeatStyle(
                                            seat?.status || "available" as SeatStatus,
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
                                const seatId = `${row}${num}`
                                const seat = seats.find((s) => s.id === seatId)
                                return (
                                    <button
                                        key={seatId}
                                        onClick={() => handleSeatClick(seatId)}
                                        className={`w-8 h-8 text-xs font-medium rounded border transition-all duration-200 ${getSeatStyle(
                                            seat?.status || "available" as SeatStatus,
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
                                            seat?.status || "available" as SeatStatus,
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
                                            seat?.status || "available" as SeatStatus,
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
    const handleNext = async () => {
        if (!screeningId) {
            alert("上映IDが取得できていません"); // screeningId に変更
            return;
        }

        if (selectedSeats.length === 0) {
            alert("座席を選択してください")
            return
        }

        // ログインしているユーザーのIDが必要
        const userId = localStorage.getItem('userId');
        if (!userId) {
            alert("ユーザーがログインしていません。ログインしてください。");
            router.push('/login'); // ログインページへリダイレクト
            return;
        }

        try {
            // スクリーンIDを数値として取得
            const numericScreeningId = parseInt(screeningId);
            if (isNaN(numericScreeningId)) {
                alert("無効な上映IDが検出されました。");
                console.error("Invalid screeningId for purchase:", screeningId);
                return;
            }

            const purchaseTime = new Date().toISOString();

            const purchaseDetails: CreatePurchaseDetail[] = [
                {
                    role_id: 1, // 仮のRoleID (例: 一般)
                    quantity: selectedSeats.length,
                }
            ];

            const seatIdsToReserve: string[] = selectedSeats;

            const purchaseData: CreatePurchaseData = {
                user_id: parseInt(userId),
                screening_id: numericScreeningId,
                purchase_time: purchaseTime,
                purchase_details: purchaseDetails,
                selected_seat_ids: seatIdsToReserve, // 文字列IDのリスト
            };

            // Purchase作成API呼び出し
            const purchaseResponse = await fetch('http://localhost:8080/purchases/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, // 認証トークンが必要な場合
                },
                body: JSON.stringify(purchaseData),
            });

            if (!purchaseResponse.ok) {
                const errorData = await purchaseResponse.json();
                throw new Error(`購入の作成に失敗しました: ${purchaseResponse.statusText} - ${errorData.error || '不明なエラー'}`);
            }

            const purchaseResult = await purchaseResponse.json();
            console.log("購入成功レスポンス:", purchaseResult);
            alert("座席の予約と購入情報が登録されました！");


            const seatSelectionData = {
                purchaseId: purchaseResult.PurchaseID, // 新しく取得したPurchaseIDをsessionStorageに保存
                selectedSeats: seatIdsToReserve, // これも文字列のまま
                movieId: movieInfo.id,
                date: movieInfo.date,
                time: movieInfo.time,
                screen: movieInfo.screen,
            };

            sessionStorage.setItem("seatSelection", JSON.stringify(seatSelectionData));
            router.push(`/tickets/types?`); // 次のページへ

        } catch (error) {
            alert("座席の予約と購入に失敗しました。")
            console.error(error)
        }
    }


    return (
        <div className="min-h-screen pt-24">
            <p>確認用:{scId}</p>
            {/* ヒーローセクション */}
            <section className="relative h-[20vh] md:h-[30vh] overflow-hidden">
                <div className="absolute inset-0">
                    <Image src="/images/theater-interior-1.jpg" alt="劇場内観" fill className="object-cover" priority />
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
                                        href="/tickets/schedule"
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