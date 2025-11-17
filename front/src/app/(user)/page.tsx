"use client"

import { useState, useEffect } from "react"
import type { MovieTLResponse } from "@/app/types/movie"
import { HeroSection } from "../components/HeroSection"
import { MovieSection } from "../components/MovieSection"
import { NewsInfoSection } from "../components/NewsInfoSection"

export default function Home() {
  const [heroMovies, setHeroMovies] = useState<MovieTLResponse[]>([])
  const [nowShowing, setNowShowing] = useState<MovieTLResponse[]>([])
  const [comingSoon, setComingSoon] = useState<MovieTLResponse[]>([])

  // 映画情報
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await fetch("http://localhost:8080/movies/")
        if (!res.ok) throw new Error("Failed to fetch")
        const data: MovieTLResponse[] | null = await res.json()

        if (!data || !Array.isArray(data)) {
          console.warn("Received invalid movie data:", data)
          setNowShowing([])
          setComingSoon([])
          setHeroMovies([])
          return
        }

        const today = new Date()

        const now = data
          .filter(movie => movie.release_date && new Date(movie.release_date) <= today)
          .sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime())

        const coming = data
          .filter(movie => movie.release_date && new Date(movie.release_date) > today)
          .sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime())

        setNowShowing(now)
        setComingSoon(coming)
        setHeroMovies(now.slice(0, 3))
      } catch (err) {
        console.error(err)
        setNowShowing([])
        setComingSoon([])
        setHeroMovies([])
      }
    }

    fetchMovies()
  }, [])

  return (
    <div className="min-h-screen">
      
      {/* ヒーローセクション */}
      <HeroSection heroMovies={heroMovies} />

      {/* 映画セクション */}
      <MovieSection nowShowing={nowShowing} comingSoon={comingSoon} />

      {/* お知らせ・劇場情報セクション */}
      <NewsInfoSection />

    </div>
  )
}
