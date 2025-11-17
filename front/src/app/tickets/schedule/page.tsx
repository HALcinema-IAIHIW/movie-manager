"use client"
import { useEffect } from "react"
import { useState, useMemo } from "react"
import Image from "next/image"
// Swiper導入
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"

// types
// import { MovieSchedule } from "../types/schedule";

// コンポーネント
import MovieTL from "./components/MovieTL"

// fetch
import { fetchScreeningsByDate } from "../../libs/api/api"
import type { MovieTLProps } from "../../types/schedule"

// TODO: 今日の日付から7日間の映画上映情報取得
// TODO: その日付を使ってエンドポイントに投げる

// const mockScheduleByDate: Record<string, MovieTLProps[]> = {
//   "0701": [
//     {
//       MovieTitle: "君の名は",
//       ScreenNum: 1,
//       Day: "0701",
//       Showings: [
//         { id: 1, stTime: "0930" },
//         { id: 2, stTime: "1200" }
//       ]
//     },
//     {
//       MovieTitle: "天気の子",
//       ScreenNum: 2,
//       Day: "0701",
//       Showings: [{ id: 3, stTime: "1015" }]
//     }
//   ],
//   "0702": [
//     {
//       MovieTitle: "すずめの戸締まり",
//       ScreenNum: 3,
//       Day: "0702",
//       Showings: [
//         { id: 4, stTime: "1100" },
//         { id: 5, stTime: "1400" }
//       ]
//     }
//   ],
//   "0703": [
//     {
//       MovieTitle: "君の名は",
//       ScreenNum: 1,
//       Day: "0703",
//       Showings: [
//         { id: 6, stTime: "0930" },
//         { id: 7, stTime: "1200" }
//       ]
//     }
//   ]
// };

// 日付を表示用にフォーマットする関数を追加
const formatDateForDisplay = (mmdd: string) => {
    const month = mmdd.slice(0, 2)
    const day = mmdd.slice(2, 4)
    return `${Number.parseInt(month)}/${Number.parseInt(day)}`
}

// 日付取得して初期値を設定
const getNow = () => {
    const today = new Date()
    const month = ("0" + (today.getMonth() + 1)).slice(-2)
    const day = ("0" + today.getDate()).slice(-2)
    return month + day
}

// 表示できる日付のリスト
const getViewDates = () => {
    const today = new Date()
    const result = []

    for (let i = 0; i < 7; i++) {
        const targetDate = new Date(today)
        targetDate.setDate(today.getDate() + i)

        const month = ("0" + (targetDate.getMonth() + 1)).slice(-2)
        const day = ("0" + targetDate.getDate()).slice(-2)
        const mmdd = month + day

        result.push({ id: i + 1, date: mmdd, displayDate: formatDateForDisplay(mmdd) })
    }

    return result
}

const Schedule = () => {
    const ViewDate = useMemo(() => getViewDates(), [])
    // 当日の日付
    const Today = getNow()
    // 今表示している日付
    const [ShowDate, changeDate] = useState(Today)
    // 選択された日付に対応する映画ごとの上映スケジュール一覧を格納するステート
    const [MovieListPerDay, setMovieListPerDay] = useState<MovieTLProps[]>([])

    useEffect(() => {
        // const fetchByDate = async (date: string) => {
        const fetchByDate = async () => {
            try {
                const data = await fetchScreeningsByDate(ShowDate)
                setMovieListPerDay(data)
            } catch (err) {
                console.log("取得エラー:", err)
                setMovieListPerDay([])
            }
            // return mockScheduleByDate[date] || [];
        }
        // バックエンドが整ったら fetchScreeningsByDate(date) に差し替え
        // fetchByDate(ShowDate).then(setMovieListPerDay);
        fetchByDate()
    }, [ShowDate])

    return (
        <div className="min-h-screen pt-24">
            {/* ヒーローセクション */}
            <section className="relative h-[30vh] md:h-[40vh] overflow-hidden">
                {/* 背景画像 */}
                <div className="absolute inset-0">
                    <Image src="/images/theater-interior-1.png" alt="劇場内観" fill className="object-cover" priority />
                    {/* グラデーションオーバーレイ */}
                    <div className="absolute inset-0 bg-gradient-to-r from-darkest/90 via-darkest/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-t from-darkest/80 via-transparent to-darkest/40" />
                </div>

                {/* コンテンツ */}
                <div className="relative h-full flex items-center">
                    <div className="container-luxury">
                        <div className="max-w-2xl animate-fade-in">
                            <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-4 font-en">SCHEDULE</h1>
                            <p className="text-xl md:text-2xl text-gold mb-6 font-jp">上映スケジュール</p>
                            <p className="text-lg text-text-secondary leading-relaxed max-w-xl font-jp">
                                お好みの日時を選択して、
                                <br />
                                最高の映画体験をお楽しみください。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* メインコンテンツ */}
            <section className="py-16 bg-darker">
                <div className="container-luxury">
                    {/* 日付選択スライダー */}
                    <div className="mb-12">
                        <div className="relative max-w-4xl mx-auto">
                            <Swiper
                                modules={[Navigation]}
                                navigation={{
                                    prevEl: ".swiper-button-prev-custom",
                                    nextEl: ".swiper-button-next-custom",
                                }}
                                spaceBetween={16}
                                breakpoints={{
                                    0: { slidesPerView: 2 },
                                    350: { slidesPerView: 3 },
                                    550: { slidesPerView: 4 },
                                    750: { slidesPerView: 5 },
                                    980: { slidesPerView: 6 },
                                    1200: { slidesPerView: 7 },
                                }}
                                className="date-slider"
                            >
                                {ViewDate.map((day) => (
                                    <SwiperSlide key={day.id}>
                                        {Number(day.date) < Number(Today) ? (
                                            <button
                                                className="w-full py-4 px-3 bg-accent/20 text-text-muted rounded-lg cursor-not-allowed font-jp"
                                                disabled
                                            >
                                                {day.displayDate}
                                            </button>
                                        ) : (
                                            <button
                                                className={`w-full py-4 px-3 rounded-lg font-medium transition-all duration-300 font-jp ${
                                                    day.date === ShowDate
                                                        ? "bg-gold text-darkest shadow-gold-glow"
                                                        : "bg-accent/30 text-text-secondary hover:bg-accent/50 hover:text-text-primary"
                                                }`}
                                                onClick={() => changeDate(day.date)}
                                            >
                                                {day.displayDate}
                                            </button>
                                        )}
                                    </SwiperSlide>
                                ))}
                            </Swiper>

                            {/* カスタムナビゲーションボタン */}
                            <button className="swiper-button-prev-custom absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-10 h-10 bg-gold/20 hover:bg-gold/30 text-gold rounded-full flex items-center justify-center transition-colors">
                                ‹
                            </button>
                            <button className="swiper-button-next-custom absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-10 h-10 bg-gold/20 hover:bg-gold/30 text-gold rounded-full flex items-center justify-center transition-colors">
                                ›
                            </button>
                        </div>
                    </div>

                    {/* 映画スケジュール一覧 */}
                    <div className="space-y-8">
                        {MovieListPerDay?.map((props) => (
                            <div key={`${props.title}-${props.showings}`} className="card-luxury p-6">
                                <MovieTL {...props} />
                            </div>
                        ))}

                        {MovieListPerDay.length === 0 && (
                            <div className="text-center py-16">
                                <p className="text-text-muted text-lg font-jp">選択された日付の上映スケジュールはありません</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Schedule
