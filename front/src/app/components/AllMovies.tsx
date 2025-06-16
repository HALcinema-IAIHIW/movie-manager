"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Play, Info } from 'lucide-react'

// 映画データの型定義
export type Movie = {
    id: number
    name: string
    moviePicture: string
    summary: string
    cast: string[]
    genre: string
    duration: string
    releaseDate: string
    director: string
}

// 映画データ
export const MovieData: Movie[] = [
    {
        id: 1,
        name: "インターステラー",
        moviePicture: "/images/movie-poster-1.jpg",
        summary:
            "人類の未来をかけた壮大な宇宙の旅。愛が時空を超える感動の物語。地球の環境悪化により人類滅亡の危機が迫る中、元NASA宇宙飛行士のクーパーは、人類を救うための秘密ミッションに参加することになる。",
        cast: ["マシュー・マコノヒー", "アン・ハサウェイ", "ジェシカ・チャステイン", "マイケル・ケイン"],
        genre: "SF・ドラマ",
        duration: "169分",
        releaseDate: "2014.11.22",
        director: "クリストファー・ノーラン",
    },
    {
        id: 2,
        name: "ブレードランナー 2049",
        moviePicture: "/images/movie-poster-2.jpg",
        summary:
            "人間とは何かを問う、美しく哲学的なSF傑作の続編。2049年、新たなブレードランナーKが、社会の根幹を揺るがす秘密を発見する。",
        cast: ["ライアン・ゴズリング", "ハリソン・フォード", "アナ・デ・アルマス", "ジャレッド・レト"],
        genre: "SF・スリラー",
        duration: "164分",
        releaseDate: "2017.10.27",
        director: "ドゥニ・ヴィルヌーヴ",
    },
    {
        id: 3,
        name: "ラ・ラ・ランド",
        moviePicture: "/images/movie-poster-3.jpg",
        summary:
            "ロサンゼルスを舞台に繰り広げられる、夢と愛の美しい物語。女優を目指すミアとジャズピアニストのセバスチャンの恋愛を描いたミュージカル映画。",
        cast: ["ライアン・ゴズリング", "エマ・ストーン", "ジョン・レジェンド", "ローズマリー・デウィット"],
        genre: "ミュージカル・ロマンス",
        duration: "128分",
        releaseDate: "2017.02.24",
        director: "デイミアン・チャゼル",
    },
    {
        id: 4,
        name: "ダンケルク",
        moviePicture: "/images/movie-poster-4.jpg",
        summary:
            "第二次世界大戦の史実に基づく戦争映画。1940年、フランスのダンケルクで包囲された連合軍兵士たちの脱出作戦を描く。",
        cast: ["フィオン・ホワイトヘッド", "トム・グリン＝カーニー", "ジャック・ローデン", "ハリー・スタイルズ"],
        genre: "戦争・ドラマ",
        duration: "106分",
        releaseDate: "2017.09.09",
        director: "クリストファー・ノーラン",
    },
    {
        id: 5,
        name: "アバター",
        moviePicture: "/images/movie-poster-5.jpg",
        summary:
            "美しい惑星パンドラを舞台にした壮大なSFアドベンチャー。人類とナヴィ族の対立と共存を描いた革新的な映像体験。",
        cast: ["サム・ワーシントン", "ゾーイ・サルダナ", "シガーニー・ウィーバー", "スティーヴン・ラング"],
        genre: "SF・アドベンチャー",
        duration: "162分",
        releaseDate: "2009.12.23",
        director: "ジェームズ・キャメロン",
    },
    {
        id: 6,
        name: "トップガン マーヴェリック",
        moviePicture: "/images/movie-poster-6.jpg",
        summary: "伝説のパイロット、マーヴェリックの新たな挑戦。最新技術と人間ドラマが融合した航空アクション映画の傑作。",
        cast: ["トム・クルーズ", "マイルズ・テラー", "ジェニファー・コネリー", "ジョン・ハム"],
        genre: "アクション・ドラマ",
        duration: "131分",
        releaseDate: "2022.05.27",
        director: "ジョセフ・コシンスキー",
    },
]

export default function AllMovies() {
    const [selectedGenre, setSelectedGenre] = useState<string>("all")

    // ジャンルでフィルタリング
    const genres = [
        "all",
        "SF・ドラマ",
        "SF・スリラー",
        "ミュージカル・ロマンス",
        "戦争・ドラマ",
        "SF・アドベンチャー",
        "アクション・ドラマ",
    ]

    const filteredMovies =
        selectedGenre === "all" ? MovieData : MovieData.filter((movie) => movie.genre === selectedGenre)

    return (
        <div className="space-y-12">
            {/* ジャンルフィルター */}
            <div className="flex flex-wrap justify-center gap-4">
                {genres.map((genre) => (
                    <button
                        key={genre}
                        onClick={() => setSelectedGenre(genre)}
                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 font-jp ${
                            selectedGenre === genre
                                ? "bg-gold text-darkest"
                                : "bg-accent/20 text-text-secondary hover:bg-accent/30 hover:text-text-primary"
                        }`}
                    >
                        {genre === "all" ? "すべて" : genre}
                    </button>
                ))}
            </div>

            {/* 映画グリッド */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {filteredMovies.map((movie) => (
                    <div key={movie.id} className="group hover-lift">
                        <div className="card-luxury p-0 overflow-hidden">
                            {/* 映画ポスター */}
                            <div className="relative aspect-[2/3] overflow-hidden">
                                <Image
                                    src={movie.moviePicture || "/placeholder.svg"}
                                    alt={movie.name}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />

                                {/* ホバー時のオーバーレイ */}
                                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                                    <div className="flex flex-col items-center gap-3">
                                        <Link
                                            href={`/movies/${movie.id}`}
                                            className="w-12 h-12 bg-gold/20 hover:bg-gold/30 text-gold rounded-full flex items-center justify-center transition-colors"
                                        >
                                            <Info size={20} />
                                        </Link>
                                        <Link
                                            href={`/tickets/buy/${movie.id}`}
                                            className="w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors"
                                        >
                                            <Play size={20} />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* 映画情報 */}
                            <div className="p-4">
                                <h3 className="font-medium text-text-primary mb-2 line-clamp-2 font-jp">{movie.name}</h3>
                                <div className="flex items-center justify-between text-sm text-text-muted mb-3">
                                    <span className="font-jp">{movie.genre}</span>
                                    <span className="font-jp">{movie.duration}</span>
                                </div>
                                <div className="flex items-center justify-end mb-3">
                                    <div className="flex items-center gap-1 text-xs text-text-muted">
                                        <Calendar size={12} />
                                        <span className="font-playfair">{movie.releaseDate}</span>
                                    </div>
                                </div>
                                <Link
                                    href={`/movies/${movie.id}`}
                                    className="block w-full text-center py-2 bg-gold/10 hover:bg-gold/20 text-gold text-sm font-medium transition-colors rounded font-jp"
                                >
                                    詳細を見る
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 映画が見つからない場合 */}
            {filteredMovies.length === 0 && (
                <div className="text-center py-16">
                    <p className="text-text-muted text-lg font-jp">選択されたジャンルの映画が見つかりません</p>
                </div>
            )}
        </div>
    )
}