"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, Info, ChevronLeft, ChevronRight, Star, Calendar, MapPin } from "lucide-react"

// カルーセルのデータ（実際の映画データに置き換え可能）
const heroMovies = [
  {
    id: 1,
    title: "インターステラー",
    subtitle: "時空を超えた愛の物語",
    image: "/images/hero-movie-1.jpg",
    description: "人類の未来をかけた壮大な宇宙の旅。愛が時空を超える感動の物語。",
    rating: 4.8,
    genre: "SF・ドラマ",
  },
  {
    id: 2,
    title: "ブレードランナー 2049",
    subtitle: "未来への問いかけ",
    image: "/images/hero-movie-2.jpg",
    description: "人間とは何かを問う、美しく哲学的なSF傑作の続編。",
    rating: 4.7,
    genre: "SF・スリラー",
  },
  {
    id: 3,
    title: "ラ・ラ・ランド",
    subtitle: "夢と愛のミュージカル",
    image: "/images/hero-movie-3.jpg",
    description: "ロサンゼルスを舞台に繰り広げられる、夢と愛の美しい物語。",
    rating: 4.6,
    genre: "ミュージカル・ロマンス",
  },
]

// 映画データ
const moviesData = {
  nowShowing: [
    {
      id: 1,
      title: "インターステラー",
      image: "/images/movie-poster-1.jpg",
      rating: 4.8,
      genre: "SF・ドラマ",
      duration: "169分",
    },
    {
      id: 2,
      title: "ブレードランナー 2049",
      image: "/images/movie-poster-2.jpg",
      rating: 4.7,
      genre: "SF・スリラー",
      duration: "164分",
    },
    {
      id: 3,
      title: "ラ・ラ・ランド",
      image: "/images/movie-poster-3.jpg",
      rating: 4.6,
      genre: "ミュージカル",
      duration: "128分",
    },
    {
      id: 4,
      title: "ダンケルク",
      image: "/images/movie-poster-4.jpg",
      rating: 4.5,
      genre: "戦争・ドラマ",
      duration: "106分",
    },
    {
      id: 5,
      title: "アバター",
      image: "/images/movie-poster-5.jpg",
      rating: 4.4,
      genre: "SF・アドベンチャー",
      duration: "162分",
    },
    {
      id: 6,
      title: "トップガン マーヴェリック",
      image: "/images/movie-poster-6.jpg",
      rating: 4.9,
      genre: "アクション",
      duration: "131分",
    },
  ],
  comingSoon: [
    {
      id: 7,
      title: "デューン 砂の惑星PART2",
      image: "/images/coming-soon-1.jpg",
      releaseDate: "2024.03.15",
      genre: "SF・アドベンチャー",
    },
    {
      id: 8,
      title: "オッペンハイマー",
      image: "/images/coming-soon-2.jpg",
      releaseDate: "2024.03.29",
      genre: "ドラマ・歴史",
    },
    {
      id: 9,
      title: "ミッション：インポッシブル",
      image: "/images/coming-soon-3.jpg",
      releaseDate: "2024.04.12",
      genre: "アクション・スリラー",
    },
    {
      id: 10,
      title: "ファンタスティック・ビースト",
      image: "/images/coming-soon-4.jpg",
      releaseDate: "2024.04.26",
      genre: "ファンタジー",
    },
    {
      id: 11,
      title: "ジョン・ウィック",
      image: "/images/coming-soon-5.jpg",
      releaseDate: "2024.05.10",
      genre: "アクション",
    },
    {
      id: 12,
      title: "スパイダーマン",
      image: "/images/coming-soon-6.jpg",
      releaseDate: "2024.05.24",
      genre: "アクション・SF",
    },
  ],
}

// ニュース・お知らせデータ
const newsData = [
  {
    id: 1,
    title: "新プレミアムシート導入のお知らせ",
    date: "2024.02.15",
    category: "施設情報",
    excerpt: "より快適な映画鑑賞体験のため、最新のプレミアムシートを導入いたします。",
  },
  {
    id: 2,
    title: "春の特別上映会開催決定",
    date: "2024.02.10",
    category: "イベント",
    excerpt: "名作映画の特別上映会を開催。限定グッズの販売も予定しております。",
  },
  {
    id: 3,
    title: "メンバーシップ制度リニューアル",
    date: "2024.02.05",
    category: "サービス",
    excerpt: "より充実した特典をご用意した新しいメンバーシップ制度がスタートします。",
  },
]

export default function Home() {
  // カルーセルの状態管理
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // タブの状態管理
  const [activeTab, setActiveTab] = useState("nowShowing")

  // カルーセルの自動再生
  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === heroMovies.length - 1 ? 0 : prev + 1))
    }, 6000) // 6秒間隔に変更

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  // スライド操作関数
  const prevSlide = () => {
    setIsAutoPlaying(false)
    setCurrentSlide((prev) => (prev === 0 ? heroMovies.length - 1 : prev - 1))
  }

  const nextSlide = () => {
    setIsAutoPlaying(false)
    setCurrentSlide((prev) => (prev === heroMovies.length - 1 ? 0 : prev + 1))
  }

  const goToSlide = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentSlide(index)
  }

  return (
      <div className="min-h-screen">
        {/* ヒーローセクション（カルーセル） */}
        <section className="relative h-screen overflow-hidden">
          {/* スライド */}
          {heroMovies.map((movie, index) => (
              <div
                  key={movie.id}
                  className={`absolute inset-0 transition-all duration-1000 ${
                      index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-105"
                  }`}
              >
                {/* 背景画像 */}
                <div className="absolute inset-0">
                  <Image
                      src={movie.image || "/placeholder.svg"}
                      alt={movie.title}
                      fill
                      className="object-cover"
                      priority={index === 0}
                  />
                  {/* グラデーションオーバーレイ */}
                  <div className="absolute inset-0 bg-gradient-to-r from-darkest/90 via-darkest/60 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-darkest/80 via-transparent to-darkest/40" />
                </div>

                {/* コンテンツ */}
                <div className="relative h-full flex items-center">
                  <div className="container-luxury pl-24">
                    <div className="max-w-2xl animate-fade-in">
                      {/* ジャンル・評価 */}
                      <div className="flex items-center gap-4 mb-4">
                    <span className="px-3 py-1 bg-gold/20 text-gold text-sm font-medium rounded-full font-shippori">
                      {movie.genre}
                    </span>
                        <div className="flex items-center gap-1">
                          <Star size={16} className="text-gold fill-gold" />
                          <span className="text-text-secondary font-medium font-playfair">{movie.rating}</span>
                        </div>
                      </div>

                      {/* タイトル */}
                      <h1 className="text-5xl md:text-7xl font-bold text-text-primary mb-4 font-jp">{movie.title}</h1>

                      {/* サブタイトル */}
                      <h2 className="text-xl md:text-2xl text-gold mb-6 font-shippori">{movie.subtitle}</h2>

                      {/* 説明文 */}
                      <p className="text-lg text-text-secondary leading-relaxed mb-8 max-w-xl font-shippori">
                        {movie.description}
                      </p>

                      {/* アクションボタン */}
                      <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href={`/movies/${movie.id}`}
                            className="btn-luxury flex items-center justify-center gap-2 font-shippori"
                        >
                          <Play size={20} />
                          <span className="font-jp">予告編を見る</span>
                        </Link>
                        <Link
                            href={`/tickets/buy/${movie.id}`}
                            className="btn-outline-luxury flex items-center justify-center gap-2 font-shippori"
                        >
                          <Info size={20} />
                          <span className="font-jp">チケット購入</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          ))}

          {/* ナビゲーションボタン */}
          <div className="absolute inset-y-0 left-0 right-0 flex items-center justify-between px-6 z-10">
            <button
                onClick={prevSlide}
                className="w-12 h-12 bg-black/30 hover:bg-black/50 text-white rounded-full
              flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="前のスライド"
            >
              <ChevronLeft size={24} />
            </button>
            <button
                onClick={nextSlide}
                className="w-12 h-12 bg-black/30 hover:bg-black/50 text-white rounded-full
              flex items-center justify-center transition-all duration-300 hover:scale-110"
                aria-label="次のスライド"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* インジケーター */}
          <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3 z-10">
            {heroMovies.map((_, index) => (
                <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide ? "bg-gold scale-125" : "bg-white/50 hover:bg-white/80"
                    }`}
                    aria-label={`スライド ${index + 1}`}
                />
            ))}
          </div>
        </section>

        {/* 映画セクション */}
        <section className="py-20 bg-darker">
          <div className="container-luxury">
            {/* セクションタイトル */}
            <div className="text-center mb-16">
              <h2 className="section-title mb-4 font-en">MOVIES</h2>
              <p className="text-text-muted text-lg max-w-2xl mx-auto font-shippori">
                <span className="font-jp">厳選された最高品質の映画作品をお楽しみください</span>
              </p>
            </div>

            {/* タブナビゲーション */}
            <div className="flex justify-center border-b border-accent/20 mb-12">
              <button
                  className={`px-8 py-4 text-lg transition-all duration-300 relative font-en ${
                      activeTab === "nowShowing" ? "text-gold" : "text-text-muted hover:text-text-secondary"
                  }`}
                  onClick={() => setActiveTab("nowShowing")}
              >
                NOW SHOWING
                {activeTab === "nowShowing" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
              </button>
              <button
                  className={`px-8 py-4 text-lg transition-all duration-300 relative font-en ${
                      activeTab === "comingSoon" ? "text-gold" : "text-text-muted hover:text-text-secondary"
                  }`}
                  onClick={() => setActiveTab("comingSoon")}
              >
                COMING SOON
                {activeTab === "comingSoon" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />}
              </button>
            </div>

            {/* NOW SHOWING コンテンツ */}
            <div
                className={`transition-all duration-500 ${activeTab === "nowShowing" ? "opacity-100" : "opacity-0 hidden"}`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {moviesData.nowShowing.map((movie) => (
                    <div key={movie.id} className="group hover-lift">
                      <div className="card-luxury p-0 overflow-hidden">
                        {/* 映画ポスター */}
                        <div className="relative aspect-[2/3] overflow-hidden">
                          <Image
                              src={movie.image || "/placeholder.svg"}
                              alt={movie.title}
                              fill
                              className="object-cover transition-transform duration-500
                          group-hover:scale-110"
                          />

                          {/* ホバー時のオーバーレイ */}
                          <div
                              className="absolute inset-0 bg-black/80 opacity-0
                        group-hover:opacity-100 transition-all duration-300
                        flex items-center justify-center"
                          >
                            <div className="flex flex-col items-center gap-3">
                              <Link
                                  href={`/movies/${movie.id}`}
                                  className="w-12 h-12 bg-gold/20 hover:bg-gold/30 text-gold
                              rounded-full flex items-center justify-center transition-colors"
                              >
                                <Play size={20} />
                              </Link>
                              <Link
                                  href={`/movies/${movie.id}`}
                                  className="w-12 h-12 bg-white/20 hover:bg-white/30 text-white
                              rounded-full flex items-center justify-center transition-colors"
                              >
                                <Info size={20} />
                              </Link>
                            </div>
                          </div>
                        </div>

                        {/* 映画情報 */}
                        <div className="p-4">
                          <h3 className="font-medium text-text-primary mb-2 line-clamp-2 font-shippori font-jp">
                            {movie.title}
                          </h3>
                          <div className="flex items-center justify-between text-sm text-text-muted mb-3">
                            <span className="font-shippori font-jp">{movie.genre}</span>
                            <span className="font-shippori font-jp">{movie.duration}</span>
                          </div>
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-1">
                              <Star size={14} className="text-gold fill-gold" />
                              <span className="text-sm text-text-secondary font-playfair">{movie.rating}</span>
                            </div>
                          </div>
                          <Link
                              href={`/tickets/buy/${movie.id}`}
                              className="block w-full text-center py-2 bg-gold/10 hover:bg-gold/20
                          text-gold text-sm font-medium transition-colors rounded font-shippori font-jp"
                          >
                            チケット購入
                          </Link>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </div>

            {/* COMING SOON コンテンツ */}
            <div
                className={`transition-all duration-500 ${activeTab === "comingSoon" ? "opacity-100" : "opacity-0 hidden"}`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {moviesData.comingSoon.map((movie) => (
                    <div key={movie.id} className="group hover-lift">
                      <div className="card-luxury p-0 overflow-hidden">
                        {/* 映画ポスター */}
                        <div className="relative aspect-[2/3] overflow-hidden">
                          <Image
                              src={movie.image || "/placeholder.svg"}
                              alt={movie.title}
                              fill
                              className="object-cover transition-all duration-500
                          grayscale group-hover:grayscale-0 group-hover:scale-110"
                          />

                          {/* 公開予定ラベル */}
                          <div
                              className="absolute top-3 left-3 px-2 py-1 bg-gold text-darkest
                        text-xs font-bold rounded font-playfair"
                          >
                            COMING SOON
                          </div>

                          {/* ホバー時のオーバーレイ */}
                          <div
                              className="absolute inset-0 bg-black/80 opacity-0
                        group-hover:opacity-100 transition-all duration-300
                        flex items-center justify-center"
                          >
                            <Link
                                href={`/movies/${movie.id}`}
                                className="w-12 h-12 bg-white/20 hover:bg-white/30 text-white
                            rounded-full flex items-center justify-center transition-colors"
                            >
                              <Info size={20} />
                            </Link>
                          </div>
                        </div>

                        {/* 映画情報 */}
                        <div className="p-4">
                          <h3 className="font-medium text-text-primary mb-2 line-clamp-2 font-shippori font-jp">
                            {movie.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-text-muted mb-3">
                            <Calendar size={14} />
                            <span className="font-playfair">{movie.releaseDate}</span>
                          </div>
                          <p className="text-sm text-text-muted font-shippori font-jp">{movie.genre}</p>
                        </div>
                      </div>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ニュース・インフォメーションセクション */}
        <section className="py-20">
          <div className="container-luxury">
            {/* セクションタイトル */}
            <div className="text-center mb-16">
              <h2 className="section-title mb-4 font-en">NEWS & INFORMATION</h2>
              <p className="text-text-muted text-lg max-w-2xl mx-auto font-shippori">
                <span className="font-jp">最新のお知らせと劇場情報をお届けします</span>
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* ニュース一覧 */}
              <div className="lg:col-span-2">
                <h3 className="text-2xl font-playfair text-text-primary mb-8 font-jp">最新ニュース</h3>
                <div className="space-y-6">
                  {newsData.map((news) => (
                      <Link key={news.id} href={`/news/${news.id}`} className="block card-luxury p-6 hover-glow">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0">
                        <span
                            className="inline-block px-3 py-1 bg-gold/20 text-gold
                          text-xs font-medium rounded-full font-shippori font-jp"
                        >
                          {news.category}
                        </span>
                          </div>
                          <div className="flex-1">
                            <h4
                                className="text-lg font-medium text-text-primary mb-2
                          group-hover:text-gold transition-colors font-shippori font-jp"
                            >
                              {news.title}
                            </h4>
                            <p className="text-text-muted text-sm mb-3 line-clamp-2 font-shippori font-jp">
                              {news.excerpt}
                            </p>
                            <time className="text-text-subtle text-xs font-playfair">{news.date}</time>
                          </div>
                        </div>
                      </Link>
                  ))}
                </div>
                <div className="text-center mt-8">
                  <Link href="/news" className="btn-outline-luxury font-shippori font-jp">
                    すべてのニュースを見る
                  </Link>
                </div>
              </div>

              {/* サイドバー */}
              <div className="space-y-8">
                {/* 劇場案内 */}
                <div className="card-luxury p-6">
                  <h3 className="text-xl font-playfair text-text-primary mb-4 font-jp">劇場案内</h3>
                  <div className="aspect-video relative mb-4 overflow-hidden rounded">
                  <Image src="/images/theater-interior.jpg" alt="劇場内観" fill className="object-cover" />
                  </div>
                  <p className="text-text-muted text-sm mb-4 font-shippori font-jp">
                    最高級の設備と洗練された空間で、特別な映画体験をお楽しみください。
                  </p>
                  <Link
                      href="/access"
                      className="text-gold hover:text-gold-light
                  transition-colors text-sm font-medium font-shippori font-jp"
                  >
                    詳細を見る →
                  </Link>
                </div>

                {/* アクセス情報 */}
                <div className="card-luxury p-6">
                  <h3 className="text-xl font-playfair text-text-primary mb-4 font-jp">アクセス</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <MapPin size={16} className="text-gold mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-text-secondary text-sm font-medium font-shippori font-jp">所在地</p>
                        <p className="text-text-muted text-sm font-shippori font-jp">
                          名古屋市中村区名駅4-27-1
                          <br />
                          スパイラルタワーズ
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Calendar size={16} className="text-gold mt-1 flex-shrink-0" />
                      <div>
                        <p className="text-text-secondary text-sm font-medium font-shippori font-jp">最寄り駅</p>
                        <p className="text-text-muted text-sm font-shippori font-jp">JR名古屋駅 徒歩5分</p>
                      </div>
                    </div>
                  </div>
                  <Link
                      href="/access"
                      className="inline-block mt-4 text-gold
                  hover:text-gold-light transition-colors text-sm font-medium font-shippori font-jp"
                  >
                    アクセス詳細 →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
  )
}
