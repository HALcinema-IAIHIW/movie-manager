"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Calendar, Play, Info } from 'lucide-react'
import type { MovieTLResponse } from "@/app/types/movie"

export default function AllMovies() {
    const [selectedGenre, setSelectedGenre] = useState<string>("all")
    const [movies, setMovies] = useState<MovieTLResponse[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    
    //映画データ取得
    useEffect(() => {
        fetch("http://localhost:8080/movies/")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch")
                return res.json()
              })
            .then((data: MovieTLResponse[]) => {
                const today = new Date()


                // 公開済み映画のみを取得
                const nowShowing = data
                  .filter((movie) => new Date(movie.release_date) <= today)
                  .sort(
                    (a, b) =>
                      new Date(b.release_date).getTime() - new Date(a.release_date).getTime()
                  )

        
                setMovies(nowShowing)
            })
            .catch((err) => {
                console.error(err)
                setError(err.message)
            })
            .finally(() => setLoading(false))
    }, [])
    
    if (loading) {
        return (
          <div className="text-center py-16 text-text-muted font-jp">
            読み込み中です...
          </div>
        )
    }

    if (error) {
        return (
          <div className="text-center py-16 text-red-500 font-jp">
            データ取得に失敗しました：{error}
          </div>
        )
    }

    // 映画ジャンル
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
        selectedGenre === "all"
        ? movies
        : movies.filter((movie) => movie.genre === selectedGenre)

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
                                  src={movie.poster_path || "/placeholder.svg"}
                                  alt={movie.title}
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
                                            href={`/tickets/schedule/${movie.id}`}
                                            className="w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors"
                                        >
                                            <Play size={20} />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            {/* 映画情報 */}
                            <div className="p-4">
                                <h3 className="font-medium text-text-primary mb-2 line-clamp-2 font-jp">{movie.title}</h3>
                                <div className="flex items-center justify-between text-sm text-text-muted mb-3">
                                    <span className="font-jp">{movie.genre}</span>
                                    <span className="font-jp">{movie.duration}分</span>
                                </div>
                                <div className="flex items-center justify-end mb-3">
                                    <div className="flex items-center gap-1 text-xs text-text-muted">
                                        <Calendar size={12} />
                                        <span className="font-playfair">{movie.release_date}</span>
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