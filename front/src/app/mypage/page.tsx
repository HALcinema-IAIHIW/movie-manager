"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Mail, Phone, CreditCard, Calendar, MapPin, Clock, QrCode, Info, Edit3, Save, Film } from "lucide-react"

// 予約データの型定義
type Reservation = {
    id: number
    movieTitle: string
    date: string
    time: string
    endTime: string
    screen: string
    seat: string
    poster: string
    timeUntil: string
}

// コレクションデータの型定義
type CollectionItem = {
    id: number
    movieTitle: string
    watchedDate: string
    screen: string
    poster: string
}

// サンプルデータ
const reservationData: Reservation = {
    id: 1,
    movieTitle: "名探偵コナン",
    date: "2024年5月5日",
    time: "23:45",
    endTime: "25:15",
    screen: "スクリーン1",
    seat: "G-15",
    poster: "/images/movie-poster-1.jpg",
    timeUntil: "0時間後",
}

const collectionData: CollectionItem[] = [
    {
        id: 1,
        movieTitle: "インターステラー",
        watchedDate: "2024年4月20日",
        screen: "スクリーン1",
        poster: "/images/movie-poster-1.jpg",
    },
    {
        id: 2,
        movieTitle: "ブレードランナー 2049",
        watchedDate: "2024年4月15日",
        screen: "スクリーン2",
        poster: "/images/movie-poster-2.jpg",
    },
    {
        id: 3,
        movieTitle: "ラ・ラ・ランド",
        watchedDate: "2024年4月10日",
        screen: "スクリーン3",
        poster: "/images/movie-poster-3.jpg",
    },
    {
        id: 4,
        movieTitle: "ダンケルク",
        watchedDate: "2024年4月5日",
        screen: "スクリーン1",
        poster: "/images/movie-poster-4.jpg",
    },
]

export default function MyPage() {
    const [isEditing, setIsEditing] = useState(false)
    const [profileData, setProfileData] = useState({
        email: "xxx@xxxx.com",
        phone: "xxxx-xxxx-xxxx",
        cardNumber: "xxxx-xxxx-xxxx-1234",
        cardExpiry: "12/26",
    })

    const handleSave = () => {
        setIsEditing(false)
        // ここで実際の保存処理を行う
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
                            <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-4 font-en">MY PAGE</h1>
                            <p className="text-xl md:text-2xl text-gold mb-6 font-jp">マイページ</p>
                            <p className="text-lg text-text-secondary leading-relaxed max-w-xl font-jp">
                                ご予約の確認やプロフィール設定、
                                <br />
                                鑑賞履歴をご確認いただけます。
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* メインコンテンツ */}
            <section className="py-16">
                <div className="container-luxury">
                    <div className="max-w-4xl mx-auto space-y-16">
                        {/* 予約セクション */}
                        <div>
                            <h2 className="text-3xl font-bold text-text-primary mb-8 font-jp">現在の予約</h2>
                            <div className="card-luxury p-8">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                                    {/* 映画ポスター */}
                                    <div className="lg:col-span-1">
                                        <div className="relative aspect-[2/3] max-w-48 mx-auto">
                                            <Image
                                                src={reservationData.poster || "/placeholder.svg"}
                                                alt={reservationData.movieTitle}
                                                fill
                                                className="object-cover rounded-lg shadow-luxury"
                                            />
                                        </div>
                                    </div>

                                    {/* 予約詳細 */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gold mb-4 font-jp border-b border-gold/30 pb-2 inline-block">
                                                {reservationData.movieTitle}
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-text-secondary">
                                                <div className="flex items-center gap-3">
                                                    <Calendar size={20} className="text-gold flex-shrink-0" />
                                                    <div>
                                                        <p className="font-medium font-jp">{reservationData.date}</p>
                                                        <p className="text-sm text-text-muted font-jp">
                                                            {reservationData.time} 〜 {reservationData.endTime}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <MapPin size={20} className="text-gold flex-shrink-0" />
                                                    <div>
                                                        <p className="font-medium font-jp">{reservationData.screen}</p>
                                                        <p className="text-sm text-text-muted font-jp">座席: {reservationData.seat}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <Clock size={20} className="text-gold flex-shrink-0" />
                                                    <p className="font-medium text-gold font-jp">{reservationData.timeUntil}</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* アクションボタン */}
                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <button className="btn-luxury flex items-center justify-center gap-2 font-jp">
                                                <Info size={18} />
                                                映画詳細
                                            </button>
                                            <button className="btn-outline-luxury flex items-center justify-center gap-2 font-jp">
                                                <QrCode size={18} />
                                                QRコード
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* プロフィールセクション */}
                        <div>
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-bold text-text-primary font-jp">プロフィール</h2>
                                <button
                                    onClick={() => setIsEditing(!isEditing)}
                                    className="btn-outline-luxury flex items-center gap-2 font-jp"
                                >
                                    <Edit3 size={18} />
                                    {isEditing ? "キャンセル" : "編集"}
                                </button>
                            </div>

                            <div className="space-y-6">
                                {/* メールアドレス */}
                                <div className="card-luxury p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Mail size={20} className="text-gold" />
                                        <label className="text-lg font-medium text-text-primary font-jp">メールアドレス</label>
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                            className="w-full px-4 py-3 bg-darker border border-accent/30
                        rounded-lg text-text-primary placeholder-text-muted
                        focus:border-gold focus:outline-none transition-colors font-jp"
                                        />
                                    ) : (
                                        <p className="text-text-secondary text-lg font-jp">{profileData.email}</p>
                                    )}
                                </div>

                                {/* 電話番号 */}
                                <div className="card-luxury p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Phone size={20} className="text-gold" />
                                        <label className="text-lg font-medium text-text-primary font-jp">電話番号</label>
                                    </div>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                            className="w-full px-4 py-3 bg-darker border border-accent/30
                        rounded-lg text-text-primary placeholder-text-muted
                        focus:border-gold focus:outline-none transition-colors font-jp"
                                        />
                                    ) : (
                                        <p className="text-text-secondary text-lg font-jp">{profileData.phone}</p>
                                    )}
                                </div>

                                {/* クレジットカード */}
                                <div className="card-luxury p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        <CreditCard size={20} className="text-gold" />
                                        <label className="text-lg font-medium text-text-primary font-jp">クレジットカード</label>
                                    </div>
                                    {isEditing ? (
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                value={profileData.cardNumber}
                                                onChange={(e) => setProfileData({ ...profileData, cardNumber: e.target.value })}
                                                placeholder="カード番号"
                                                className="w-full px-4 py-3 bg-darker border border-accent/30
                          rounded-lg text-text-primary placeholder-text-muted
                          focus:border-gold focus:outline-none transition-colors font-jp"
                                            />
                                            <input
                                                type="text"
                                                value={profileData.cardExpiry}
                                                onChange={(e) => setProfileData({ ...profileData, cardExpiry: e.target.value })}
                                                placeholder="有効期限 (MM/YY)"
                                                className="w-full px-4 py-3 bg-darker border border-accent/30
                          rounded-lg text-text-primary placeholder-text-muted
                          focus:border-gold focus:outline-none transition-colors font-jp"
                                            />
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <p className="text-text-secondary text-lg font-jp">{profileData.cardNumber}</p>
                                            <p className="text-text-muted text-sm font-jp">有効期限: {profileData.cardExpiry}</p>
                                        </div>
                                    )}
                                </div>

                                {/* 保存ボタン */}
                                {isEditing && (
                                    <div className="text-center">
                                        <button onClick={handleSave} className="btn-luxury flex items-center gap-2 mx-auto font-jp">
                                            <Save size={18} />
                                            保存
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* コレクションセクション */}
                        <div>
                            <h2 className="text-3xl font-bold text-text-primary mb-8 font-jp">鑑賞履歴</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {collectionData.map((item) => (
                                    <div key={item.id} className="card-luxury p-0 overflow-hidden hover-lift group">
                                        {/* 映画ポスター */}
                                        <div className="relative aspect-[2/3] overflow-hidden">
                                            <Image
                                                src={item.poster || "/placeholder.svg"}
                                                alt={item.movieTitle}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                            />

                                            {/* ホバー時のオーバーレイ */}
                                            <div
                                                className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100
                        transition-all duration-300 flex items-center justify-center"
                                            >
                                                <Link
                                                    href={`/movies/${item.id}`}
                                                    className="w-12 h-12 bg-gold/20 hover:bg-gold/30 text-gold
                            rounded-full flex items-center justify-center transition-colors"
                                                >
                                                    <Film size={20} />
                                                </Link>
                                            </div>
                                        </div>

                                        {/* 映画情報 */}
                                        <div className="p-4">
                                            <h3 className="font-medium text-text-primary mb-2 line-clamp-2 font-jp">{item.movieTitle}</h3>
                                            <div className="space-y-1 text-sm text-text-muted">
                                                <div className="flex items-center gap-2">
                                                    <Calendar size={12} />
                                                    <span className="font-jp">{item.watchedDate}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <MapPin size={12} />
                                                    <span className="font-jp">{item.screen}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
