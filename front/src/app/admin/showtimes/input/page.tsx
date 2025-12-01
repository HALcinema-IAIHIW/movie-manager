"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Calendar, Clock, ArrowLeft, Film, MapPin } from "lucide-react"

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

export default function ShowtimeInput() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [screens, setScreens] = useState<Screen[]>([])
  const [formData, setFormData] = useState<ShowtimeData>({
    movieId: "",
    screenId: "",
    startDate: "",
    endDate: "",
    showtimes: [{ date: "", startTime: "" }]
  })
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin/login")
      return
    }

    // 映画とスクリーンの情報を取得
    fetchMovies()
    fetchScreens()
  }, [])

  const fetchMovies = async () => {
    try {
      const response = await fetch("http://localhost:8080/movies/")
      if (response.ok) {
        const data = await response.json()
        setMovies(data)
      }
    } catch (error) {
      console.error("映画データの取得に失敗しました:", error)
    }
  }

  const fetchScreens = async () => {
    try {
      const response = await fetch("http://localhost:8080/screens/")
      if (response.ok) {
        const data = await response.json()
        setScreens(data)
      }
    } catch (error) {
      console.error("スクリーンデータの取得に失敗しました:", error)
    }
  }

  const handleInputChange = (field: keyof ShowtimeData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleShowtimeChange = (index: number, field: "date" | "startTime", value: string) => {
    setFormData(prev => ({
      ...prev,
      showtimes: prev.showtimes.map((showtime, i) =>
        i === index ? { ...showtime, [field]: value } : showtime
      )
    }))
  }

  const addShowtime = () => {
    setFormData(prev => ({
      ...prev,
      showtimes: [...prev.showtimes, { date: "", startTime: "" }]
    }))
  }

  const removeShowtime = (index: number) => {
    if (formData.showtimes.length > 1) {
      setFormData(prev => ({
        ...prev,
        showtimes: prev.showtimes.filter((_, i) => i !== index)
      }))
    }
  }

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault(); // フォームリロード防止

  // バリデーション
  if (!formData.movieId || !formData.screenId || !formData.startDate || !formData.endDate) {
    alert("すべての必須項目を入力してください");
    return;
  }
  if (formData.showtimes.some(st => !st.date || !st.startTime)) {
    alert("すべての上映日時を入力してください");
    return;
  }

  const selectedMovie = movies.find(m => m.id === parseInt(formData.movieId));
  if (!selectedMovie) {
    alert("正しい映画が選択されていません");
    return;
  }

  // --- period データ ---
  const periodPayload = {
    movieID: Number(formData.movieId),
    screenID: Number(formData.screenId),
    startDate: formData.startDate,
    endDate: formData.endDate
  };

  // --- screenings データ ---
  const screeningsPayload = formData.showtimes.map(st => {
    const isoDate = `${st.date}T00:00:00+09:00`;
    const isoStart = `${st.date}T${st.startTime}:00+09:00`;
    return {
      screening_period_id: null, // 確認ページで埋める
      date: isoDate,
      start_time: isoStart,
      duration: selectedMovie.duration
    };
  });

  const saveData = {
    period: periodPayload,
    screenings: screeningsPayload
  };

  try {
    sessionStorage.setItem("showtimeApiData", JSON.stringify(saveData));
    console.log("Saved to sessionStorage:", saveData);

    router.push("/admin/showtimes/confirm"); // ここで確実に遷移
  } catch (error) {
    console.error("Failed to save data or navigate:", error);
  }
};


  const selectedMovie = movies.find(m => m.id === parseInt(formData.movieId))
  const selectedScreen = screens.find(s => s.id === parseInt(formData.screenId))

  return (
    <div className="min-h-screen bg-darker">
      {/* ヘッダー */}
      <header className="bg-darkest border-b border-accent/20">
        <div className="container-luxury">
          <div className="flex items-center gap-4 h-16">
            <Link href="/admin/menu" className="text-text-muted hover:text-text-primary transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-text-primary font-jp">上映情報入力</h1>
          </div>
        </div>
      </header>

      <div className="container-luxury py-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 基本情報 */}
            <div className="card-luxury p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6 font-jp">基本情報</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 映画選択 */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2 font-shippori">
                    映画作品 <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Film size={18} className="text-text-muted" />
                    </div>
                    <select
                      value={formData.movieId}
                      onChange={(e) => handleInputChange("movieId", e.target.value)}
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-accent/20 bg-darker/50
                        rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50"
                    >
                      <option value="">映画を選択してください</option>
                      {movies.map((movie) => (
                        <option key={movie.id} value={movie.id}>
                          {movie.title} ({movie.duration}分)
                        </option>
                      ))}
                    </select>
                  </div>
                  {selectedMovie && (
                    <div className="mt-2 text-sm text-text-muted font-shippori">
                      ジャンル: {selectedMovie.genre} | 上映時間: {selectedMovie.duration}分
                    </div>
                  )}
                </div>

                {/* スクリーン選択 */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2 font-shippori">
                    スクリーン <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin size={18} className="text-text-muted" />
                    </div>
                    <select
                      value={formData.screenId}
                      onChange={(e) => handleInputChange("screenId", e.target.value)}
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-accent/20 bg-darker/50
                        rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50"
                    >
                      <option value="">スクリーンを選択してください</option>
                      {screens.map((screen) => (
                        <option key={screen.id} value={screen.id}>
                          スクリーン{screen.id} ({screen.maxRow}列{screen.maxColumn}番まで)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* 上映開始日 */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2 font-shippori">
                    上映開始日 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => handleInputChange("startDate", e.target.value)}
                    required
                    className="block w-full px-3 py-3 border border-accent/20 bg-darker/50
                      rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>

                {/* 上映終了日 */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2 font-shippori">
                    上映終了日 <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => handleInputChange("endDate", e.target.value)}
                    required
                    className="block w-full px-3 py-3 border border-accent/20 bg-darker/50
                      rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
              </div>
            </div>

            {/* 上映時刻設定 */}
            <div className="card-luxury p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text-primary font-jp">上映時刻設定</h2>
                <button
                  type="button"
                  onClick={addShowtime}
                  className="btn-outline-luxury px-4 py-2 text-sm font-shippori"
                >
                  上映時間を追加
                </button>
              </div>

              <div className="space-y-4">
                {formData.showtimes.map((showtime, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-darkest/50 rounded-lg">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* 上映日 */}
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2 font-shippori">
                          上映日
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Calendar size={16} className="text-text-muted" />
                          </div>
                          <input
                            type="date"
                            value={showtime.date}
                            onChange={(e) => handleShowtimeChange(index, "date", e.target.value)}
                            min={formData.startDate}
                            max={formData.endDate}
                            className="block w-full pl-10 pr-3 py-2 border border-accent/20 bg-darker/50
                              rounded text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50"
                          />
                        </div>
                      </div>

                      {/* 開始時刻 */}
                      <div>
                        <label className="block text-sm font-medium text-text-secondary mb-2 font-shippori">
                          開始時刻
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Clock size={16} className="text-text-muted" />
                          </div>
                          <input
                            type="time"
                            value={showtime.startTime}
                            onChange={(e) => handleShowtimeChange(index, "startTime", e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-accent/20 bg-darker/50
                              rounded text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50"
                          />
                        </div>
                      </div>
                    </div>

                    {formData.showtimes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeShowtime(index)}
                        className="text-red-400 hover:text-red-300 transition-colors p-2"
                      >
                        削除
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 送信ボタン */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="btn-luxury px-8 py-3 font-shippori disabled:opacity-50"
              >
                {isLoading ? "処理中..." : "入力内容を確認する"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}