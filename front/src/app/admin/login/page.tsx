"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Lock, User } from "lucide-react"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:8080/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      })

      if (!response.ok) {
        throw new Error("ログインに失敗しました")
      }

      const data = await response.json()

      // トークンをローカルストレージに保存
      if (data.token) {
        localStorage.setItem("adminToken", data.token)
      }

      router.push("/admin/menu")
    } catch (err) {
      setError(err instanceof Error ? err.message : "ログインエラーが発生しました")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-darkest flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="card-luxury p-8">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2 font-jp">管理者ログイン</h1>
            <p className="text-text-muted font-shippori">システム管理者としてログインしてください</p>
          </div>

          {/* エラーメッセージ */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded text-red-400 text-sm font-shippori">
              {error}
            </div>
          )}

          {/* ログインフォーム */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* メールアドレス */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-2 font-shippori">
                メールアドレス
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={18} className="text-text-muted" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-accent/20 bg-darker/50
                    rounded-lg text-text-primary placeholder-text-muted
                    focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50
                    transition-all duration-200"
                  placeholder="admin@example.com"
                />
              </div>
            </div>

            {/* パスワード */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-2 font-shippori">
                パスワード
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={18} className="text-text-muted" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-accent/20 bg-darker/50
                    rounded-lg text-text-primary placeholder-text-muted
                    focus:outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold/50
                    transition-all duration-200"
                  placeholder="パスワードを入力"
                />
              </div>
            </div>

            {/* ログインボタン */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-luxury py-3 font-shippori disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "ログイン中..." : "ログイン"}
            </button>
          </form>

          {/* フッター */}
          <div className="mt-8 text-center">
            <p className="text-text-subtle text-sm font-shippori">
              管理者権限が必要です
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}