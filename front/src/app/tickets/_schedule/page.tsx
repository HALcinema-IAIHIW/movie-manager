"use client"
import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
// Swiper導入
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper/modules"
import "swiper/css"
import "swiper/css/navigation"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"

// コンポーネント
import MovieTL from "@/app/components/MovieTL"

// 表示できる日付のリスト
const ViewDate = [
    {
        id: 1,
        date: "0615",
        displayDate: "6/15",
    },
    {
        id: 2,
        date: "0616",
        displayDate: "6/16",
    },
    {
        id: 3,
        date: "0617",
        displayDate: "6/17",
    },
    {
        id: 4,
        date: "0618",
        displayDate: "6/18",
    },
    {
        id: 5,
        date: "0619",
        displayDate: "6/19",
    },
    {
        id: 6,
        date: "0620",
        displayDate: "6/20",
    },
    {
        id: 7,
        date: "0621",
        displayDate: "6/21",
    },
]

//日付と映画の組み合わせリスト
const DayMovieList = [
    { id: 1, date: "0615", movie: "Movie01" },
    { id: 2, date: "0615", movie: "Movie02" },
    { id: 3, date: "0615", movie: "Movie03" },
    { id: 4, date: "0616", movie: "Movie01" },
    { id: 5, date: "0616", movie: "Movie02" },
    { id: 6, date: "0616", movie: "Movie03" },
    { id: 7, date: "0617", movie: "Movie01" },
    { id: 8, date: "0618", movie: "Movie02" },
]

// 日付取得して初期値を設定
const getNow = () => {
    const today = new Date()
    const month = ("0" + (today.getMonth() + 1)).slice(-2)
    const day = ("0" + today.getDate()).slice(-2)
    return month + day
}

const Schedule = () => {
    const router = useRouter()
    // 今表示している日付
    const [ShowDate, changeDate] = useState(getNow())
    // 日付でmapする用の配列
    const MoviePerDay = DayMovieList.filter((DayMovieList) => DayMovieList.date === ShowDate)

    // 座席選択ページへの遷移
    const handleTimeSlotClick = (movieId: string, time: string, screen: string) => {
        const selectedDateObj = ViewDate.find((d) => d.date === ShowDate)
        const params = new URLSearchParams()
        params.set("movieId", movieId)
        params.set("date", `2024年${selectedDateObj?.displayDate || ShowDate}日`)
        params.set("time", time)
        params.set("screen", screen)

        router.push(`/tickets/seats?${params.toString()}`)
    }

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
                    {/* セクションタイトル */}
                    <div className="text-center mb-12">
                        <h2 className="section-title mb-4 font-en">SELECT DATE</h2>
                        <p className="text-text-muted text-lg max-w-2xl mx-auto font-jp">ご希望の日付を選択してください</p>
                    </div>

                    {/* 日付選択スライダー */}
                    <div className="relative mb-16">
                        <div className="card-luxury p-6">
                            <div className="flex items-center justify-center">
                                {/* 左矢印ボタン */}
                                <button
                                    className="swiper-button-prev-custom w-12 h-12 bg-gold hover:bg-gold-light text-darkest
                                    rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 mr-4"
                                    aria-label="前の日付"
                                >
                                    <ChevronLeft size={20} />
                                </button>

                                {/* スライダー - 幅を制限 */}
                                <div className="max-w-4xl w-full">
                                    <Swiper
                                        modules={[Navigation]}
                                        navigation={{
                                            prevEl: ".swiper-button-prev-custom",
                                            nextEl: ".swiper-button-next-custom",
                                        }}
                                        spaceBetween={12}
                                        slidesPerView="auto"
                                        centeredSlides={true}
                                        breakpoints={{
                                            0: { slidesPerView: 2 },
                                            350: { slidesPerView: 3 },
                                            550: { slidesPerView: 4 },
                                            750: { slidesPerView: 5 },
                                            980: { slidesPerView: 6 },
                                            1200: { slidesPerView: 7 },
                                        }}
                                        className="date-swiper"
                                    >
                                        {ViewDate.map((day) => (
                                            <SwiperSlide key={day.id} className="!w-auto">
                                                <button
                                                    className={`min-w-[100px] py-4 px-6 rounded-lg font-medium transition-all duration-300 font-jp ${
                                                        ShowDate === day.date
                                                            ? "bg-gold text-darkest shadow-gold-glow"
                                                            : "bg-accent/20 text-text-secondary hover:bg-accent/30 hover:text-text-primary"
                                                    }`}
                                                    onClick={() => changeDate(day.date)}
                                                >
                                                    <div className="flex flex-col items-center gap-1">
                                                        <Calendar size={16} />
                                                        <span className="text-sm whitespace-nowrap">{day.displayDate}</span>
                                                    </div>
                                                </button>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>

                                {/* 右矢印ボタン */}
                                <button
                                    className="swiper-button-next-custom w-12 h-12 bg-gold hover:bg-gold-light text-darkest
                                    rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 z-10 ml-4"
                                    aria-label="次の日付"
                                >
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 上映時間リスト */}
                    <div className="space-y-8">
                        {MoviePerDay.length > 0 ? (
                            MoviePerDay.map((MPD) => (
                                <div key={MPD.id} className="card-luxury">
                                    <MovieTL Movie={MPD.movie} Day={ShowDate} onTimeSlotClick={handleTimeSlotClick} />
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-16">
                                <p className="text-text-muted text-lg font-jp">選択された日付に上映予定の映画がありません</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Schedule
