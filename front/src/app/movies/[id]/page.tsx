"use client"

import { useEffect, useState } from "react"
import { use } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Star, Clock, Calendar, User, Play, Ticket } from "lucide-react"
import { MovieData, type Movie } from "@/app/components/AllMovies"

const DetailMovie = ({ params }: { params: Promise<{ id: string }> }) => {
  const [movie, setMovie] = useState<Movie | undefined>(undefined)
  const movieParams = use(params)

  useEffect(() => {
    const found = MovieData.find((m) => m.id === Number(movieParams.id))
    setMovie(found)
  }, [movieParams.id])

  if (!movie) {
    return (
        <div className="min-h-screen pt-24 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-text-primary mb-4 font-jp">映画が見つかりません</h1>
            <Link href="/movies" className="btn-outline-luxury font-jp">
              映画一覧に戻る
            </Link>
          </div>
        </div>
    )
  }

  return (
      <div className="min-h-screen pt-24">
        {/* ヒーローセクション */}
        <section className="relative h-[60vh] md:h-[70vh] overflow-hidden">
          {/* 背景画像 */}
          <div className="absolute inset-0">
            <Image
                src={movie.moviePicture || "/placeholder.svg"}
                alt={movie.name}
                fill
                className="object-cover"
                priority
            />
            {/* グラデーションオーバーレイ */}
            <div className="absolute inset-0 bg-gradient-to-r from-darkest/95 via-darkest/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-darkest/90 via-transparent to-darkest/50" />
          </div>

          {/* コンテンツ */}
          <div className="relative h-full flex items-center">
            <div className="container-luxury">
              <div className="max-w-3xl animate-fade-in">
                {/* 戻るボタン */}
                <Link
                    href="/movies"
                    className="inline-flex items-center gap-2 text-text-secondary hover:text-gold transition-colors mb-6 font-jp"
                >
                  <ArrowLeft size={20} />
                  映画一覧に戻る
                </Link>

                {/* 映画情報 */}
                <div className="flex items-center gap-4 mb-4">
                <span className="px-3 py-1 bg-gold/20 text-gold text-sm font-medium rounded-full font-jp">
                  {movie.genre}
                </span>
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-gold fill-gold" />
                    <span className="text-text-secondary font-medium font-playfair">{movie.rating}</span>
                  </div>
                </div>

                <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-4 font-jp">{movie.name}</h1>

                <div className="flex flex-wrap items-center gap-6 text-text-secondary mb-6">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gold" />
                    <span className="font-jp">{movie.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gold" />
                    <span className="font-playfair">{movie.releaseDate}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-gold" />
                    <span className="font-jp">監督: {movie.director}</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                      href={`/tickets/buy/${movie.id}`}
                      className="btn-luxury flex items-center justify-center gap-2 font-jp"
                  >
                    <Ticket size={20} />
                    チケット購入
                  </Link>
                  <button className="btn-outline-luxury flex items-center justify-center gap-2 font-jp">
                    <Play size={20} />
                    予告編を見る
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 詳細情報セクション */}
        <section className="py-16 bg-darker">
          <div className="container-luxury">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* ポスター */}
              <div className="lg:col-span-1">
                <div className="card-luxury p-0 overflow-hidden max-w-md mx-auto">
                  <div className="relative aspect-[2/3]">
                    <Image
                        src={movie.moviePicture || "/placeholder.svg"}
                        alt={movie.name}
                        fill
                        className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* 詳細情報 */}
              <div className="lg:col-span-2 space-y-8">
                {/* あらすじ */}
                <div className="card-luxury p-8">
                  <h2 className="text-2xl font-bold text-gold mb-6 font-jp">あらすじ</h2>
                  <p className="text-text-secondary leading-relaxed font-jp">{movie.summary}</p>
                </div>

                {/* キャスト */}
                <div className="card-luxury p-8">
                  <h2 className="text-2xl font-bold text-gold mb-6 font-jp">キャスト</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {movie.cast.map((actor, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-accent/10 rounded-lg">
                          <div className="w-12 h-12 bg-gold/20 rounded-full flex items-center justify-center">
                            <User size={20} className="text-gold" />
                          </div>
                          <span className="text-text-primary font-jp">{actor}</span>
                        </div>
                    ))}
                  </div>
                </div>

                {/* 作品情報 */}
                <div className="card-luxury p-8">
                  <h2 className="text-2xl font-bold text-gold mb-6 font-jp">作品情報</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-medium text-text-primary mb-2 font-jp">監督</h3>
                      <p className="text-text-secondary font-jp">{movie.director}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-text-primary mb-2 font-jp">ジャンル</h3>
                      <p className="text-text-secondary font-jp">{movie.genre}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-text-primary mb-2 font-jp">上映時間</h3>
                      <p className="text-text-secondary font-jp">{movie.duration}</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-text-primary mb-2 font-jp">公開日</h3>
                      <p className="text-text-secondary font-playfair">{movie.releaseDate}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTAセクション */}
        <section className="py-16">
          <div className="container-luxury text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gold mb-6 font-jp">この作品をご覧になりませんか？</h2>
            <p className="text-xl text-text-secondary mb-8 font-jp">最高の映画体験をHALCINEMAで。</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href={`/tickets/buy/${movie.id}`} className="btn-luxury font-jp">
                チケット購入
              </Link>
              <Link href="/movies" className="btn-outline-luxury font-jp">
                他の作品を見る
              </Link>
            </div>
          </div>
        </section>
      </div>
  )
}

export default DetailMovie
