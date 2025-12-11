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

// APIレスポンスの型（バックエンドに合わせてください）
interface ShowtimeData {
  movieId: string
  screenId: string
  startDate: string
  endDate: string
  periodId?: number // ★デバッグ用に追加
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
      startDate: "",
      endDate: "",
      periodId: undefined, // 初期値
      showtimes: data.screenings.map((s: any) => ({
        date: s.date.split("T")[0],
        startTime: s.start_time.split("T")[1].slice(0, 5)
      }))
    }

    setFormData(showtimeData)

    fetchMovieAndScreenData(showtimeData.movieId, showtimeData.screenId)
    // 期間情報の取得を実行
    fetchPeriodData(showtimeData.movieId)

  }, [router])

  const fetchMovieAndScreenData = async (movieId: string, screenId: string) => {
    try {
      const movieResponse = await fetch(`http://localhost:8080/movies/${movieId}`)
      if (movieResponse.ok) {
        const movieData = await movieResponse.json()
        setMovie(movieData)
      }

      const screenResponse = await fetch(`http://localhost:8080/screens/${screenId}`)
      if (screenResponse.ok) {
        const screenData = await screenResponse.json()
        setScreen(screenData)
      }
    } catch (error) {
      console.error("データの取得に失敗しました:", error)
    }
  }

  const fetchPeriodData = async (movieId: string) => {
    if (!movieId) return;

    try {
      // Goのルーター設定で group.GET("/:movieid", ...) となっていると想定
      const url = `http://localhost:8080/periods/${movieId}`
      console.log(`Fetching period data from: ${url}`)

      const response = await fetch(url)

      if (response.ok) {
        const data = await response.json()
        console.log("Go API Response (Period):", data)

        // データが配列なら先頭を取得、オブジェクトならそのまま使用
        // ※映画に対して複数の上映期間がある場合、現在有効なものを選ぶロジックが必要ですが、
        // ここでは便宜上、最新（または最初）の期間データを使用します。
        const periodData = Array.isArray(data) ? data[0] : data

        if (periodData) {
          console.log("Selected Period Data:", periodData)

          setFormData(prev => {
            if (!prev) return null

            // Go側の構造体の json タグに合わせてデータを取得
            // 例: json:"startDate" または json:"start_date"
            const start = periodData.startDate || periodData.start_date || periodData.StartDate;
            const end = periodData.endDate || periodData.end_date || periodData.EndDate;

            // IDの取得 (GORMのModelを使っている場合、IDが大文字のことが多いです)
            const pId = periodData.id || periodData.ID || periodData.Model?.ID;

            return {
              ...prev,
              startDate: start,
              endDate: end,
              periodId: pId // ここで確実にIDを入れる
            }
          })
        } else {
          console.warn("上映期間データが見つかりませんでした (data is empty)")
          alert("この映画の上映期間が登録されていません。先に期間登録を行ってください。");
        }
      } else {
        console.error("Fetch failed with status:", response.status)
      }
    } catch (error) {
      console.error("上映期間の取得に失敗しました:", error)
    }
  }

  const handleSubmit = async () => {
    if (!formData || !formData.periodId) {
      alert(`上映期間情報(ID)が取得できていません。(ID: ${formData?.periodId})`);
      return;
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("ログイン情報がありません");

      const periodId = formData.periodId;

      for (const showtime of formData.showtimes) {
        const dateOnly = showtime.date;
        const start_time = `${dateOnly}T${showtime.startTime}:00+09:00`;
        const dateISO = `${dateOnly}T00:00:00+09:00`;

        const screeningResponse = await fetch("http://localhost:8080/screenings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            screening_period_id: periodId,
            screen_id: Number(formData.screenId), 
            date: dateISO,
            start_time: start_time,
            duration: movie?.duration || 120,
          }),
        });

        if (!screeningResponse.ok) {
          const errText = await screeningResponse.text();
          throw new Error(`作成失敗: ${errText}`);
        }
      }

      sessionStorage.removeItem("showtimeData");
      sessionStorage.removeItem("showtimeApiData");
      router.push("/admin/showtimes/complete");
    } catch (error) {
      alert(error instanceof Error ? error.message : "登録に失敗しました");
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "---";
    const date = new Date(dateString)
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short"
    })
  }

  const formatTime = (timeString: string) => timeString

  if (!formData) {
    return (
        <div className="min-h-screen bg-darker flex items-center justify-center">
          <div className="text-text-muted font-shippori">読み込み中...</div>
        </div>
    )
  }

  return (
      <div className="min-h-screen bg-darker">
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
            {/* デバッグ表示エリア */}
            <div className="bg-red-900/20 border border-red-500/50 p-4 mb-6 rounded text-red-200 font-mono text-sm">
              <p><strong>DEBUG INFO:</strong></p>
              <p>Period ID: {formData.periodId ?? "未取得 (null/undefined)"}</p>
              <p>Start Date: {formData.startDate ?? "未取得"}</p>
              <p>End Date: {formData.endDate ?? "未取得"}</p>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-text-primary mb-4 font-jp">入力内容をご確認ください</h2>
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
                      <p className="text-xs text-text-muted mt-1">(ID: {formData.periodId ?? "---"})</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 上映スケジュール */}
            <div className="card-luxury p-8 mb-8">
              <h3 className="text-xl font-bold text-text-primary mb-6 font-jp">上映スケジュール</h3>
              {/* ... (スケジュール表示部分は変更なし) ... */}
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