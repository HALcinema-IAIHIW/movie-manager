"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Play, Info, ChevronLeft, ChevronRight } from "lucide-react"

// カルーセルのデータ
const carouselData = [
  {
    id: 1,
    image: "/images/interstellar.jpg?height=800&width=1600",
    title: "映画タイトル",
  },
  {
    id: 2,
    image: "/images/interstellar.jpg?height=800&width=1600",
    title: "映画タイトル",
  },
  {
    id: 3,
    image: "/images/interstellar.jpg?height=800&width=1600",
    title: "映画タイトル",
  },
]

// 映画データ
const moviesData = {
  nowShowing: [
    { id: 1, title: "映画タイトル", image: "/images/interstellar.jpg?height=400&width=300" },
    { id: 2, title: "映画タイトル", image: "/images/interstellar.jpg?height=400&width=300" },
    { id: 3, title: "映画タイトル", image: "/images/interstellar.jpg?height=400&width=300" },
    { id: 4, title: "映画タイトル", image: "/images/interstellar.jpg?height=400&width=300" },
    { id: 5, title: "映画タイトル", image: "/images/interstellar.jpg?height=400&width=300" },
    { id: 6, title: "映画タイトル", image: "/images/interstellar.jpg?height=400&width=300" },
  ],
  comingSoon: [
    { id: 7, title: "映画タイトル", image: "/images/interstellar.jpg?height=400&width=300" },
    { id: 8, title: "映画タイトル", image: "/images/interstellar.jpg?height=400&width=300" },
    { id: 9, title: "映画タイトル", image: "/images/interstellar.jpg?height=400&width=300" },
    { id: 10, title: "映画タイトル", image: "/images/interstellar.jpg?height=400&width=300" },
    { id: 11, title: "映画タイトル", image: "/images/interstellar.jpg?height=400&width=300" },
    { id: 12, title: "映画タイトル", image: "/images/interstellar.jpg?height=400&width=300" },
  ],
}

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
      setCurrentSlide((prev) => (prev === carouselData.length - 1 ? 0 : prev + 1))
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying])

  // 前のスライドへ
  const prevSlide = () => {
    setIsAutoPlaying(false)
    setCurrentSlide((prev) => (prev === 0 ? carouselData.length - 1 : prev - 1))
  }

  // 次のスライドへ
  const nextSlide = () => {
    setIsAutoPlaying(false)
    setCurrentSlide((prev) => (prev === carouselData.length - 1 ? 0 : prev + 1))
  }

  // スライドを選択
  const goToSlide = (index: number) => {
    setIsAutoPlaying(false)
    setCurrentSlide(index)
  }

  return (
      <div>
        {/* カルーセルセクション */}
        <section className="relative h-[80vh]">
          {/* スライド */}
          {carouselData.map((slide, index) => (
              <div
                  key={slide.id}
                  className={`absolute inset-0 transition-opacity duration-1000 ${
                      index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
              >
                {/* 下から上へのグラデーション */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent z-10"></div>
                <Image src={slide.image || "/interstellar.jpg"} alt={slide.title} fill className="object-cover" priority />
              </div>
          ))}

          {/* ナビゲーションボタン */}
          <div className="absolute inset-0 flex items-center justify-between z-20 px-4">
            <button
                onClick={prevSlide}
                className="bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
                aria-label="前のスライド"
            >
              <ChevronLeft size={24} />
            </button>
            <button
                onClick={nextSlide}
                className="bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition-colors"
                aria-label="次のスライド"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          {/* インジケーター */}
          <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-20">
            {carouselData.map((_, index) => (
                <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentSlide ? "bg-white" : "bg-white/50"
                    }`}
                    aria-label={`スライド ${index + 1}`}
                />
            ))}
          </div>
        </section>

        {/* 映画セクション（タブ切り替え） */}
        <section className="py-16">
          <div className="container-custom">
            {/* タブナビゲーション */}
            <div className="flex border-b border-gray-800 mb-8">
              <button
                  className={`px-6 py-3 font-playfair text-lg font-medium transition-colors ${
                      activeTab === "nowShowing" ? "border-b-2 border-accent text-white" : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("nowShowing")}
              >
                NOW SHOWING
              </button>
              <button
                  className={`px-6 py-3 font-playfair text-lg font-medium transition-colors ${
                      activeTab === "comingSoon" ? "border-b-2 border-accent text-white" : "text-gray-400 hover:text-white"
                  }`}
                  onClick={() => setActiveTab("comingSoon")}
              >
                COMING SOON
              </button>
            </div>

            {/* NOW SHOWING コンテンツ */}
            <div className={`transition-opacity duration-300 ${activeTab === "nowShowing" ? "block" : "hidden"}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {moviesData.nowShowing.map((movie) => (
                    <div key={movie.id} className="group">
                      <div className="relative aspect-[2/3] overflow-hidden mb-3">
                        <Image
                            src={movie.image}
                            alt={movie.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="flex flex-col items-center gap-3">
                            <Link href={`/movies/${movie.id}`} className="bg-accent text-white p-2 rounded-full">
                              <Play size={20} />
                            </Link>
                            <Link href={`/movies/${movie.id}`} className="bg-white/20 text-white p-2 rounded-full">
                              <Info size={20} />
                            </Link>
                          </div>
                        </div>
                      </div>
                      <h3 className="font-medium text-sm text-center">{movie.title}</h3>
                      <div className="text-center mt-2">
                        <Link
                            href={`/tickets/buy/${movie.id}`}
                            className="inline-block text-xs bg-accent/90 text-white px-3 py-1 hover:bg-accent transition-colors"
                        >
                          チケット購入
                        </Link>
                      </div>
                    </div>
                ))}
              </div>
            </div>

            {/* COMING SOON コンテンツ */}
            <div className={`transition-opacity duration-300 ${activeTab === "comingSoon" ? "block" : "hidden"}`}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {moviesData.comingSoon.map((movie) => (
                    <div key={movie.id} className="group">
                      <div className="relative aspect-[2/3] overflow-hidden mb-3">
                        <Image
                            src={movie.image || "/interstellar.jpg"}
                            alt={movie.title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105 grayscale group-hover:grayscale-0"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Link href={`/movies/${movie.id}`} className="bg-white/20 text-white p-2 rounded-full">
                            <Info size={20} />
                          </Link>
                        </div>
                      </div>
                      <h3 className="font-medium text-sm text-center">{movie.title}</h3>
                      <p className="text-xs text-gray-400 text-center">Coming Soon</p>
                    </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ニュースセクション */}
        <section className="py-16 bg-darker">
          <div className="container-custom">
            <h2 className="section-title text-center mb-12">
              <span className="text-accent">NEWS</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link href="/news" className="group">
                <div className="bg-dark p-6 h-full transition-transform hover:-translate-y-2">
                  <div className="flex justify-center mb-4">
                    <Info size={48} className="text-accent" />
                  </div>
                  <h3 className="text-xl text-center mb-2 font-playfair">Information</h3>
                  <p className="text-gray-400 text-center text-sm">最新情報をご確認いただけます</p>
                </div>
              </Link>

              <Link href="/access" className="group">
                <div className="bg-dark p-6 h-full transition-transform hover:-translate-y-2">
                  <div className="aspect-video relative mb-4 overflow-hidden">
                    <Image src="/images/Screen01.png?height=200&width=300" alt="劇場案内" fill className="object-cover" />
                  </div>
                  <h3 className="text-xl text-center mb-2 font-playfair">施設案内</h3>
                  <p className="text-gray-400 text-center text-sm">最高級の設備をご用意しております</p>
                </div>
              </Link>

              <Link href="/movies" className="group">
                <div className="bg-dark p-6 h-full transition-transform hover:-translate-y-2">
                  <div className="aspect-video relative mb-4 overflow-hidden">
                    <Image src="/images/interstellar.jpg?height=200&width=300" alt="映画一覧" fill className="object-cover" />
                  </div>
                  <h3 className="text-xl text-center mb-2 font-playfair">映画一覧</h3>
                  <p className="text-gray-400 text-center text-sm">上映中・公開予定の作品一覧</p>
                </div>
              </Link>
            </div>
          </div>
        </section>
      </div>
  )
}

