"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Film, MapPin, Calendar, Clock, Check } from "lucide-react"

interface Movie {
  id: number
  title: string
  duration: number
  genre: string
}

interface Screen {
  id: number
  maxRow: string
  maxColumn: number
}

interface ShowtimeData {
  movieId: string
  screenId: string
  startDate: string
  endDate: string
  showtimes: Array<{
    date: string
    startTime: string
  }>
}

export default function ShowtimeConfirm() {
  const [formData, setFormData] = useState<ShowtimeData | null>(null)
  const [movie, setMovie] = useState<Movie | null>(null)
  const [screen, setScreen] = useState<Screen | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin/login")
      return
    }

    const storedData = sessionStorage.getItem("showtimeApiData")
    if (!storedData) {
      router.push("/admin/showtimes/input")
      return
    }

    const data = JSON.parse(storedData)

    const showtimeData: ShowtimeData = {
      movieId: data.period.movieID.toString(),
      screenId: data.period.screenID.toString(),
      startDate: data.period.startDate,
      endDate: data.period.endDate,
      showtimes: data.screenings.map((s: any) => ({
        date: s.date,
        startTime: s.start_time.split("T")[1].slice(0,5) // "HH:MM" に変換
      }))
    }

    setFormData(showtimeData)
    fetchMovieAndScreenData(showtimeData.movieId, showtimeData.screenId)
  
  }, [router])

  const fetchMovieAndScreenData = async (movieId: string, screenId: string) => {
    try {
      // 映画情報を取得
      const movieResponse = await fetch(`http://localhost:8080/movies/${movieId}`)
      if (movieResponse.ok) {
        const movieData = await movieResponse.json()
        setMovie(movieData)
      }

      // スクリーン情報を取得
      const screenResponse = await fetch(`http://localhost:8080/screens/${screenId}`)
      if (screenResponse.ok) {
        const screenData = await screenResponse.json()
        setScreen(screenData)
      }
    } catch (error) {
      console.error("データの取得に失敗しました:", error)
    }
  }

const handleSubmit = async () => {
  if (!formData) return;

  setIsLoading(true);
  try {
    const token = localStorage.getItem("adminToken");
    if (!token) throw new Error("ログイン情報がありません");

    // 1. 上映期間の作成
    const periodResponse = await fetch("http://localhost:8080/admin/screening-periods", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        movieID: parseInt(formData.movieId),
        screenID: parseInt(formData.screenId),
        startDate: formData.startDate,
        endDate: formData.endDate,
      }),
    });

    if (!periodResponse.ok) {
      const err = await periodResponse.json();
      throw new Error(`上映期間の作成に失敗しました: ${err?.error || periodResponse.statusText}`);
    }

    const periodData = await periodResponse.json();
    console.log("periodData:", periodData);
    const periodId = periodData.period_id;
    if (!periodId) throw new Error("上映期間IDが取得できませんでした");

    // 2. 上映スケジュールを順番に登録
    for (const showtime of formData.showtimes) {
      const dateOnly = showtime.date.split("T")[0]; // YYYY-MM-DD
      const start_time = `${dateOnly}T${showtime.startTime}:00+09:00`;

      const screeningResponse = await fetch("http://localhost:8080/admin/screenings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          screening_period_id: periodId,
          date: `${dateOnly}T00:00:00+09:00`,
          start_time,
          duration: movie?.duration || 120,
        }),
      });

      if (!screeningResponse.ok) {
        const errText = await screeningResponse.text();
        throw new Error(`上映スケジュール ${dateOnly} ${showtime.startTime} の作成に失敗しました: ${errText}`);
      }
    }

    // 3. 完了処理
    sessionStorage.removeItem("showtimeData");
    router.push("/admin/showtimes/complete");
  } catch (error) {
    alert(error instanceof Error ? error.message : "登録に失敗しました");
  } finally {
    setIsLoading(false);
  }
};

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short"
    })
  }

  const formatTime = (timeString: string) => timeString

  // ←ここで null チェック
  if (!formData) {
    return (
      <div className="min-h-screen bg-darker flex items-center justify-center">
        <div className="text-text-muted font-shippori">読み込み中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-darker">
      {/* ヘッダー */}
      <header className="bg-darkest border-b border-accent/20">
        <div className="container-luxury">
          <div className="flex items-center gap-4 h-16">
            <Link href="/admin/showtimes/input" className="text-text-muted hover:text-text-primary transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-text-primary font-jp">上映情報確認</h1>
          </div>
        </div>
      </header>

      <div className="container-luxury py-8">
        <div className="max-w-4xl mx-auto">
          {/* 確認メッセージ */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-text-primary mb-4 font-jp">入力内容をご確認ください</h2>
            <p className="text-text-muted font-shippori">
              以下の内容で上映情報を登録します。内容に間違いがないか確認してください。
            </p>
          </div>

          {/* 基本情報 */}
          <div className="card-luxury p-8 mb-8">
            <h3 className="text-xl font-bold text-text-primary mb-6 font-jp">基本情報</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 映画情報 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <Film size={20} className="text-gold" />
                </div>
                <div>
                  <h4 className="font-medium text-text-secondary mb-1 font-shippori">映画作品</h4>
                  <p className="text-lg text-text-primary font-jp">{movie?.title}</p>
                  <p className="text-sm text-text-muted font-shippori">
                    {movie?.genre} | {movie?.duration}分
                  </p>
                </div>
              </div>

              {/* スクリーン情報 */}
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin size={20} className="text-gold" />
                </div>
                <div>
                  <h4 className="font-medium text-text-secondary mb-1 font-shippori">上映スクリーン</h4>
                  <p className="text-lg text-text-primary font-jp">スクリーン{screen?.id}</p>
                  <p className="text-sm text-text-muted font-shippori">
                    {screen?.maxRow}列{screen?.maxColumn}番まで
                  </p>
                </div>
              </div>

              {/* 上映期間 */}
              <div className="md:col-span-2">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Calendar size={20} className="text-gold" />
                  </div>
                  <div>
                    <h4 className="font-medium text-text-secondary mb-1 font-shippori">上映期間</h4>
                    <p className="text-lg text-text-primary font-jp">
                      {formatDate(formData.startDate)} ～ {formatDate(formData.endDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 上映スケジュール */}
          <div className="card-luxury p-8 mb-8">
            <h3 className="text-xl font-bold text-text-primary mb-6 font-jp">上映スケジュール</h3>

            <div className="space-y-4">
              {formData.showtimes.map((showtime, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-darkest/50 rounded-lg">
                  <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center">
                    <Clock size={16} className="text-gold" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-6">
                      <div>
                        <span className="text-sm text-text-secondary font-shippori">上映日</span>
                        <p className="text-text-primary font-jp">{formatDate(showtime.date)}</p>
                      </div>
                      <div>
                        <span className="text-sm text-text-secondary font-shippori">開始時刻</span>
                        <p className="text-text-primary font-jp">{formatTime(showtime.startTime)}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-green-400">
                    <Check size={20} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-gold/5 border border-gold/20 rounded-lg">
              <p className="text-sm text-text-muted font-shippori">
                <strong>合計 {formData.showtimes.length} 回</strong>の上映スケジュールが登録されます。
              </p>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex justify-center gap-4">
            <Link
              href="/admin/showtimes/input"
              className="btn-outline-luxury px-8 py-3 font-shippori"
            >
              内容を修正する
            </Link>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="btn-luxury px-8 py-3 font-shippori disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "登録中..." : "この内容で登録する"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}