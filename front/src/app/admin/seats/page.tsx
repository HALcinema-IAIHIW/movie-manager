"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Loader2, Armchair } from "lucide-react"

export default function ScreenCreatePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [screenMaxRow, setScreenMaxRow] = useState("J")
  const [screenMaxColumn, setScreenMaxColumn] = useState(10)
  const [screenCreating, setScreenCreating] = useState(false)
  const [screenStatus, setScreenStatus] = useState<string | null>(null)
  const [screenError, setScreenError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin/login")
      return
    }
    setIsAuthenticated(true)
  }, [router])

  const handleCreateScreen = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setScreenStatus(null)
    setScreenError(null)

    const normalizedRow = screenMaxRow.trim().toUpperCase()
    if (!/^[A-Z]$/.test(normalizedRow)) {
      setScreenError("最大行は A〜Z の1文字で入力してください")
      return
    }
    if (screenMaxColumn <= 0) {
      setScreenError("最大列は1以上を指定してください")
      return
    }

    setScreenCreating(true)
    try {
      const res = await fetch("http://localhost:8080/screens/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ max_row: normalizedRow, max_column: screenMaxColumn }),
      })
      if (!res.ok) {
        const errText = await res.text()
        throw new Error(errText || "スクリーン登録に失敗しました")
      }
      const created = await res.json()
      setScreenStatus(`スクリーン${created?.id ?? ""}を登録しました`)
    } catch (error) {
      setScreenError(error instanceof Error ? error.message : "スクリーン登録に失敗しました")
    } finally {
      setScreenCreating(false)
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-darkest flex items-center justify-center">
        <div className="text-text-muted font-shippori">認証確認中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-darker">
      <header className="bg-darkest border-b border-accent/20">
        <div className="container-luxury">
          <div className="flex items-center gap-4 h-16">
            <Link href="/admin/menu" className="text-text-muted hover:text-text-primary transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="text-xl font-bold text-text-primary font-jp">スクリーン登録</h1>
          </div>
        </div>
      </header>

      <div className="container-luxury py-10">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="card-luxury p-6 flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-accent/15 flex items-center justify-center">
              <Armchair size={22} className="text-accent" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text-primary mb-2 font-jp">上映スクリーンを登録</h2>
              <p className="text-text-muted text-sm font-shippori">
                最大行（A〜Z）と最大列を指定してスクリーンを追加します。
              </p>
            </div>
          </div>

          <div className="card-luxury p-8 space-y-6">
            <form onSubmit={handleCreateScreen} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2 font-shippori">
                    最大行 (例: J)
                  </label>
                  <input
                    type="text"
                    maxLength={1}
                    value={screenMaxRow}
                    onChange={(e) => setScreenMaxRow(e.target.value.toUpperCase())}
                    className="w-full px-3 py-3 rounded-lg border border-accent/20 bg-darker/50 text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2 font-shippori">
                    最大列 (例: 12)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={screenMaxColumn}
                    onChange={(e) => setScreenMaxColumn(Number(e.target.value))}
                    className="w-full px-3 py-3 rounded-lg border border-accent/20 bg-darker/50 text-text-primary focus:outline-none focus:ring-2 focus:ring-gold/50"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    disabled={screenCreating}
                    className="btn-luxury w-full py-3 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {screenCreating ? (
                      <span className="flex items-center gap-2 justify-center">
                        <Loader2 size={18} className="animate-spin" />
                        登録中...
                      </span>
                    ) : (
                      "スクリーンを登録"
                    )}
                  </button>
                </div>
              </div>
            </form>

            {screenError && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-200 text-sm">
                {screenError}
              </div>
            )}
            {screenStatus && (
              <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-200 text-sm">
                {screenStatus}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
