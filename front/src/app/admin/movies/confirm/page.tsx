"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Film, Calendar, Clock, User, FileText, Image as ImageIcon, Check } from "lucide-react"

interface MovieData {
  title: string
  subtitle: string
  description: string
  releaseDate: string
  genre: string
  director: string
  cast: string
  duration: string
}

export default function MovieConfirm() {
  const [formData, setFormData] = useState<MovieData | null>(null)
  const [posterPreview, setPosterPreview] = useState<string | null>(null)
  const [hasPosterFile, setHasPosterFile] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin/login")
      return
    }

    const storedData = sessionStorage.getItem("movieData")
    const storedPreview = sessionStorage.getItem("posterPreview")
    const hasFile = sessionStorage.getItem("hasPosterFile") === "true"

    if (!storedData) {
      router.push("/admin/movies/input")
      return
    }

    setFormData(JSON.parse(storedData))
    if (storedPreview) {
      setPosterPreview(storedPreview)
    }
    setHasPosterFile(hasFile)
  }, [router])

  const handleSubmit = async () => {
    if (!formData) return

    setIsLoading(true)
    try {
      const token = localStorage.getItem("adminToken")

      // 1. JSONオブジェクトを構築 (castとdurationの型を合わせる)
      const dataToSend = {
        title: formData.title,
        subtitle: formData.subtitle,
        description: formData.description,
        release_date: formData.releaseDate,
        genre: formData.genre,
        director: formData.director,
        // cast: 現在は文字列だが、サーバーが配列を期待するならここで配列に変換が必要
        cast: formData.cast.split(',').map(item => item.trim()), // カンマ区切り文字列を配列に変換
        // poster_path: ファイルの代わりにパスを送る場合、ここで指定
        poster_path: posterPreview ? posterPreview.replace("data:image/jpeg;base64,", "") : null, // 例としてプレビューURLを使用
        duration: parseInt(formData.duration, 10), // 文字列を数値に変換
      }

      // ポスター画像がある場合は追加（実際のファイルオブジェクトは再取得が必要）
      // 注意: セッションストレージにはファイルオブジェクトを保存できないため、
      // 実際の実装では一時的なファイルストレージやBase64エンコーディングが必要

      const response = await fetch("http://localhost:8080/admin/movies", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          // 2. Content-TypeをJSONに設定
          "Content-Type": "application/json"
        },
        // 3. JSON文字列として送信
        body: JSON.stringify(dataToSend)
      })

      if (!response.ok) {
        throw new Error("映画情報の登録に失敗しました")
      }

      // セッションストレージをクリア
      sessionStorage.removeItem("movieData")
      sessionStorage.removeItem("posterPreview")
      sessionStorage.removeItem("hasPosterFile")

      router.push("/admin/movies/complete")
    } catch (error) {
      alert(error instanceof Error ? error.message : "登録に失敗しました")
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "long",
      day: "numeric"
    })
  }

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
            <Link href="/admin/movies/input" className="text-text-muted hover:text-text-primary transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-text-primary font-jp">映画情報確認</h1>
          </div>
        </div>
      </header>

      <div className="container-luxury py-8">
        <div className="max-w-4xl mx-auto">
          {/* 確認メッセージ */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-text-primary mb-4 font-jp">入力内容をご確認ください</h2>
            <p className="text-text-muted font-shippori">
              以下の内容で映画情報を登録します。内容に間違いがないか確認してください。
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ポスター画像 */}
            <div className="lg:col-span-1">
              <div className="card-luxury p-6">
                <h3 className="text-lg font-bold text-text-primary mb-4 font-jp">ポスター画像</h3>
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
                      <p className="text-text-muted font-shippori text-sm">ポスター画像なし</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 映画情報 */}
            <div className="lg:col-span-2">
              <div className="card-luxury p-8 space-y-6">
                <h3 className="text-xl font-bold text-text-primary mb-6 font-jp">映画情報</h3>

                {/* タイトル */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Film size={20} className="text-gold" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-text-secondary mb-1 font-shippori">タイトル</h4>
                    <p className="text-xl text-text-primary font-jp mb-2">{formData.title}</p>
                    {formData.subtitle && (
                      <p className="text-lg text-text-muted font-jp">{formData.subtitle}</p>
                    )}
                  </div>
                  <div className="text-green-400">
                    <Check size={20} />
                  </div>
                </div>

                {/* あらすじ */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <FileText size={20} className="text-gold" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-text-secondary mb-2 font-shippori">あらすじ</h4>
                    <p className="text-text-primary leading-relaxed font-shippori">{formData.description}</p>
                  </div>
                  <div className="text-green-400">
                    <Check size={20} />
                  </div>
                </div>

                {/* 詳細情報 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-accent/20">
                  {/* 公開日 */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center">
                      <Calendar size={16} className="text-gold" />
                    </div>
                    <div>
                      <span className="text-sm text-text-secondary font-shippori block">公開日</span>
                      <span className="text-text-primary font-jp">{formatDate(formData.releaseDate)}</span>
                    </div>
                  </div>

                  {/* 上映時間 */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center">
                      <Clock size={16} className="text-gold" />
                    </div>
                    <div>
                      <span className="text-sm text-text-secondary font-shippori block">上映時間</span>
                      <span className="text-text-primary font-jp">{formData.duration}分</span>
                    </div>
                  </div>

                  {/* ジャンル */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center">
                      <Film size={16} className="text-gold" />
                    </div>
                    <div>
                      <span className="text-sm text-text-secondary font-shippori block">ジャンル</span>
                      <span className="text-text-primary font-jp">{formData.genre}</span>
                    </div>
                  </div>

                  {/* 監督 */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center">
                      <User size={16} className="text-gold" />
                    </div>
                    <div>
                      <span className="text-sm text-text-secondary font-shippori block">監督</span>
                      <span className="text-text-primary font-jp">{formData.director}</span>
                    </div>
                  </div>

                  {/* キャスト */}
                  {formData.cast && (
                    <div className="md:col-span-2 flex items-start gap-3">
                      <div className="w-8 h-8 bg-gold/10 rounded-full flex items-center justify-center mt-1">
                        <User size={16} className="text-gold" />
                      </div>
                      <div>
                        <span className="text-sm text-text-secondary font-shippori block mb-1">主要キャスト</span>
                        <span className="text-text-primary font-jp">{formData.cast}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* 確認チェック */}
                <div className="mt-8 p-4 bg-gold/5 border border-gold/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="text-green-400">
                      <Check size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary font-shippori">入力内容の確認完了</p>
                      <p className="text-xs text-text-muted font-shippori">
                        すべての必須項目が正しく入力されています
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* アクションボタン */}
          <div className="flex justify-center gap-4 mt-8">
            <Link
              href="/admin/movies/input"
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