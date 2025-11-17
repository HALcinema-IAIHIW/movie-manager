"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Film, Clock, Calendar, User, FileText, Image as ImageIcon } from "lucide-react"

interface MovieData {
  title: string
  subtitle: string
  description: string
  releaseDate: string
  genre: string
  director: string
  cast: string
  duration: string
  posterFile: File | null
}

export default function MovieInput() {
  const [formData, setFormData] = useState<MovieData>({
    title: "",
    subtitle: "",
    description: "",
    releaseDate: "",
    genre: "",
    director: "",
    cast: "",
    duration: "",
    posterFile: null
  })
  const [isLoading, setIsLoading] = useState(false)
  const [posterPreview, setPosterPreview] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin/login")
      return
    }
  }, [router])

  const handleInputChange = (field: keyof MovieData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData(prev => ({ ...prev, posterFile: file }))

      // プレビュー画像の作成
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        sessionStorage.setItem("posterPreview", result)
      }
      reader.readAsDataURL(file)
    } else {
      // ファイル選択がキャンセルされた場合の処理
      setFormData(prev => ({ ...prev, posterFile: null }))
      setPosterPreview(null)
      sessionStorage.removeItem("posterPreview")
      sessionStorage.removeItem("hasPosterFile")
    }
  }

  const validateForm = () => {
    const requiredFields = ['title', 'description', 'releaseDate', 'genre', 'director', 'duration']

    for (const field of requiredFields) {
      if (!formData[field as keyof MovieData]) {
        return false
      }
    }

    const duration = parseInt(formData.duration)
    if (isNaN(duration) || duration <= 0) {
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      alert("すべての必須項目を正しく入力してください")
      return
    }

    // 確認ページに遷移
    sessionStorage.setItem("movieData", JSON.stringify({
      ...formData,
      posterFile: null // ファイルオブジェクトは保存できないので除外
    }))

    // ポスター画像がある場合はプレビューデータも保存
    if (posterPreview) {
      sessionStorage.setItem("posterPreview", posterPreview)
    }

    // ファイルオブジェクトは別途セッションストレージに保存
    if (formData.posterFile) {
      sessionStorage.setItem("hasPosterFile", "true")
    }

    router.push("/admin/movies/confirm")
  }

  const genreOptions = [
    "アクション",
    "コメディ",
    "ドラマ",
    "ホラー",
    "SF",
    "ロマンス",
    "スリラー",
    "アニメーション",
    "ドキュメンタリー",
    "ミュージカル",
    "ファンタジー",
    "ミステリー",
    "アドベンチャー",
    "ファミリー"
  ]

  return (
    <div className="min-h-screen bg-darker">
      {/* ヘッダー */}
      <header className="bg-darkest border-b border-accent/20">
        <div className="container-luxury">
          <div className="flex items-center gap-4 h-16">
            <Link href="/admin/menu" className="text-text-muted hover:text-text-primary transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-text-primary font-jp">映画情報入力</h1>
          </div>
        </div>
      </header>

      <div className="container-luxury py-8">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 基本情報 */}
            <div className="card-luxury p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6 font-jp">基本情報</h2>

              <div className="space-y-6">
                {/* タイトル */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2 font-shippori">
                    映画タイトル <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Film size={18} className="text-text-muted" />
                    </div>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-accent/20 bg-darker/50
                        rounded-lg text-text-primary placeholder-text-muted
                        focus:outline-none focus:ring-2 focus:ring-gold/50"
                      placeholder="映画のタイトルを入力してください"
                    />
                  </div>
                </div>

                {/* サブタイトル */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2 font-shippori">
                    サブタイトル
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => handleInputChange("subtitle", e.target.value)}
                    className="block w-full px-3 py-3 border border-accent/20 bg-darker/50
                      rounded-lg text-text-primary placeholder-text-muted
                      focus:outline-none focus:ring-2 focus:ring-gold/50"
                    placeholder="サブタイトル（任意）"
                  />
                </div>

                {/* あらすじ */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2 font-shippori">
                    あらすじ・説明 <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <FileText size={18} className="text-text-muted" />
                    </div>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      required
                      rows={6}
                      className="block w-full pl-10 pr-3 py-3 border border-accent/20 bg-darker/50
                        rounded-lg text-text-primary placeholder-text-muted
                        focus:outline-none focus:ring-2 focus:ring-gold/50 resize-none"
                      placeholder="映画のあらすじや説明を入力してください"
                    />
                  </div>
                  <div className="mt-1 text-sm text-text-muted font-shippori">
                    {formData.description.length}/500文字
                  </div>
                </div>
              </div>
            </div>

            {/* 詳細情報 */}
            <div className="card-luxury p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6 font-jp">詳細情報</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 公開日 */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2 font-shippori">
                    公開日 <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Calendar size={18} className="text-text-muted" />
                    </div>
                    <input
                      type="date"
                      value={formData.releaseDate}
                      onChange={(e) => handleInputChange("releaseDate", e.target.value)}
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-accent/20 bg-darker/50
                        rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50"
                    />
                  </div>
                </div>

                {/* ジャンル */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2 font-shippori">
                    ジャンル <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={formData.genre}
                    onChange={(e) => handleInputChange("genre", e.target.value)}
                    required
                    className="block w-full px-3 py-3 border border-accent/20 bg-darker/50
                      rounded-lg text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50"
                  >
                    <option value="">ジャンルを選択してください</option>
                    {genreOptions.map((genre) => (
                      <option key={genre} value={genre}>{genre}</option>
                    ))}
                  </select>
                </div>

                {/* 監督 */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2 font-shippori">
                    監督 <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-text-muted" />
                    </div>
                    <input
                      type="text"
                      value={formData.director}
                      onChange={(e) => handleInputChange("director", e.target.value)}
                      required
                      className="block w-full pl-10 pr-3 py-3 border border-accent/20 bg-darker/50
                        rounded-lg text-text-primary placeholder-text-muted
                        focus:outline-none focus:ring-2 focus:ring-gold/50"
                      placeholder="監督名を入力してください"
                    />
                  </div>
                </div>

                {/* 上映時間 */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2 font-shippori">
                    上映時間 <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock size={18} className="text-text-muted" />
                    </div>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <span className="text-text-muted text-sm font-shippori">分</span>
                    </div>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => handleInputChange("duration", e.target.value)}
                      required
                      min="1"
                      max="600"
                      className="block w-full pl-10 pr-10 py-3 border border-accent/20 bg-darker/50
                        rounded-lg text-text-primary placeholder-text-muted
                        focus:outline-none focus:ring-2 focus:ring-gold/50"
                      placeholder="120"
                    />
                  </div>
                </div>

                {/* キャスト */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-text-secondary mb-2 font-shippori">
                    主要キャスト
                  </label>
                  <input
                    type="text"
                    value={formData.cast}
                    onChange={(e) => handleInputChange("cast", e.target.value)}
                    className="block w-full px-3 py-3 border border-accent/20 bg-darker/50
                      rounded-lg text-text-primary placeholder-text-muted
                      focus:outline-none focus:ring-2 focus:ring-gold/50"
                    placeholder="主演俳優名、共演者名など（カンマ区切りで入力）"
                  />
                </div>
              </div>
            </div>

            {/* ポスター画像 */}
            <div className="card-luxury p-8">
              <h2 className="text-2xl font-bold text-text-primary mb-6 font-jp">ポスター画像</h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* アップロード部分 */}
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2 font-shippori">
                    ポスター画像をアップロード
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-sm text-text-secondary
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-lg file:border-0
                        file:text-sm file:font-medium
                        file:bg-gold/10 file:text-gold
                        hover:file:bg-gold/20 transition-colors
                        border border-accent/20 bg-darker/50 rounded-lg p-3
                        focus:outline-none focus:ring-2 focus:ring-gold/50"
                    />
                  </div>
                  <p className="mt-2 text-sm text-text-muted font-shippori">
                    JPG, PNG, WebP形式の画像をアップロードできます
                  </p>
                </div>

                {/* プレビュー */}
                <div>
                  <span className="block text-sm font-medium text-text-secondary mb-2 font-shippori">
                    プレビュー
                  </span>
                  <div className="aspect-[2/3] bg-darkest/50 border border-accent/20 rounded-lg
                    flex items-center justify-center overflow-hidden">
                    {posterPreview ? (
                      <img
                        src={posterPreview}
                        alt="ポスタープレビュー"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center">
                        <ImageIcon size={48} className="text-text-muted mx-auto mb-4" />
                        <p className="text-text-muted font-shippori">ポスター画像のプレビュー</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* 送信ボタン */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading || !validateForm()}
                className="btn-luxury px-8 py-3 font-shippori disabled:opacity-50 disabled:cursor-not-allowed"
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