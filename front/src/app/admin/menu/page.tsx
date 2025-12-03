"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Film, Calendar, LogOut, Settings, Users, Armchair } from "lucide-react"

export default function AdminMenu() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin/login")
      return
    }
    setIsAuthenticated(true)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    router.push("/admin/login")
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
      {/* ヘッダー */}
      <header className="bg-darkest border-b border-accent/20">
        <div className="container-luxury">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-xl font-bold text-text-primary font-jp">管理者メニュー</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-text-muted hover:text-text-primary
                transition-colors font-shippori"
            >
              <LogOut size={18} />
              ログアウト
            </button>
          </div>
        </div>
      </header>

      <div className="container-luxury py-12">
        <div className="max-w-4xl mx-auto">
          {/* ウェルカムメッセージ */}
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary mb-4 font-jp">映画館管理システム</h2>
            <p className="text-text-muted font-shippori">
              映画情報と上映スケジュールの管理を行うことができます
            </p>
          </div>

          {/* メニューカード */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 映画情報管理 */}
            <Link href="/admin/movies/input" className="group">
              <div className="card-luxury p-8 hover-glow transition-all duration-300 group-hover:scale-105">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-6
                    group-hover:bg-gold/20 transition-colors">
                    <Film size={32} className="text-gold" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-3 font-jp">映画情報入力</h3>
                  <p className="text-text-muted text-sm font-shippori">
                    新しい映画作品の基本情報を登録します
                  </p>
                </div>
              </div>
            </Link>

            {/* 上映情報管理 */}
            <Link href="/admin/showtimes/input" className="group">
              <div className="card-luxury p-8 hover-glow transition-all duration-300 group-hover:scale-105">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mb-6
                    group-hover:bg-gold/20 transition-colors">
                    <Calendar size={32} className="text-gold" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-3 font-jp">上映情報入力</h3>
                  <p className="text-text-muted text-sm font-shippori">
                    映画の上映スケジュールとスクリーン情報を設定します
                  </p>
                </div>
              </div>
            </Link>

            {/* 座席管理 */}
            <Link href="/admin/seats" className="group">
              <div className="card-luxury p-8 hover-glow transition-all duration-300 group-hover:scale-105">
                <div className="flex flex-col items-center text-center">
                  <div
                    className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6
                    group-hover:bg-accent/20 transition-colors"
                  >
                    <Armchair size={32} className="text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-text-primary mb-3 font-jp">座席表登録</h3>
                  <p className="text-text-muted text-sm font-shippori">
                    スクリーン別に座席を一括登録・確認できます
                  </p>
                </div>
              </div>
            </Link>

            {/* システム設定 */}
            <div className="group">
              <div className="card-luxury p-8 transition-all duration-300 opacity-50 cursor-not-allowed">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                    <Settings size={32} className="text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-text-muted mb-3 font-jp">システム設定</h3>
                  <p className="text-text-subtle text-sm font-shippori">
                    システム全般の設定（開発予定）
                  </p>
                </div>
              </div>
            </div>

            {/* ユーザー管理 */}
            <div className="group">
              <div className="card-luxury p-8 transition-all duration-300 opacity-50 cursor-not-allowed">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6">
                    <Users size={32} className="text-accent" />
                  </div>
                  <h3 className="text-xl font-bold text-text-muted mb-3 font-jp">ユーザー管理</h3>
                  <p className="text-text-subtle text-sm font-shippori">
                    システムユーザーの管理（開発予定）
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
