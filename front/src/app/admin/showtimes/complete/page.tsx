"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { CheckCircle, Calendar, ArrowRight, Home } from "lucide-react"

export default function ShowtimeComplete() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    if (!token) {
      router.push("/admin/login")
      return
    }
  }, [router])

  return (
    <div className="min-h-screen bg-darker">
      <div className="container-luxury py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* 成功アイコン */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
              <CheckCircle size={48} className="text-green-400" />
            </div>
          </div>

          {/* メインメッセージ */}
          <h1 className="text-3xl font-bold text-text-primary mb-4 font-jp">
            上映情報の登録が完了しました
          </h1>

          <p className="text-lg text-text-muted mb-12 font-shippori">
            上映スケジュールの登録が正常に完了いたしました。<br />
            設定された内容は即座にシステムに反映されます。
          </p>

          {/* 完了詳細 */}
          <div className="card-luxury p-8 mb-12 text-left">
            <h2 className="text-xl font-bold text-text-primary mb-6 text-center font-jp">登録完了内容</h2>

            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle size={16} className="text-green-400" />
                </div>
                <span className="text-text-secondary font-shippori">上映期間の設定</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle size={16} className="text-green-400" />
                </div>
                <span className="text-text-secondary font-shippori">上映スケジュールの登録</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle size={16} className="text-green-400" />
                </div>
                <span className="text-text-secondary font-shippori">座席管理システムとの連携</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-8 h-8 bg-green-500/10 rounded-full flex items-center justify-center">
                  <CheckCircle size={16} className="text-green-400" />
                </div>
                <span className="text-text-secondary font-shippori">予約システムへの反映</span>
              </div>
            </div>
          </div>

          {/* 次のアクション */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-text-primary mb-6 font-jp">次に実行可能なアクション</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 新規上映情報追加 */}
              <Link
                href="/admin/showtimes/input"
                className="group card-luxury p-6 hover-glow transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center
                    group-hover:bg-gold/20 transition-colors">
                    <Calendar size={20} className="text-gold" />
                  </div>
                  <div className="text-left flex-1">
                    <h4 className="font-medium text-text-primary font-jp">新規上映情報追加</h4>
                    <p className="text-sm text-text-muted font-shippori">別の上映スケジュール追加</p>
                  </div>
                  <ArrowRight size={16} className="text-text-muted group-hover:text-gold transition-colors" />
                </div>
              </Link>

              {/* 管理者メニューに戻る */}
              <Link
                href="/admin/menu"
                className="group card-luxury p-6 hover-glow transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-accent/10 rounded-full flex items-center justify-center
                    group-hover:bg-accent/20 transition-colors">
                    <Home size={20} className="text-accent" />
                  </div>
                  <div className="text-left flex-1">
                    <h4 className="font-medium text-text-primary font-jp">管理者メニュー</h4>
                    <p className="text-sm text-text-muted font-shippori">メインメニューに戻る</p>
                  </div>
                  <ArrowRight size={16} className="text-text-muted group-hover:text-accent transition-colors" />
                </div>
              </Link>
            </div>
          </div>

          {/* サポート情報 */}
          <div className="mt-12 p-6 bg-darkest/50 rounded-lg border border-accent/20">
            <h4 className="text-md font-medium text-text-primary mb-3 font-jp">お困りの場合</h4>
            <p className="text-sm text-text-muted font-shippori">
              登録した上映情報に問題がある場合や、システムに関する質問がございましたら、<br />
              システム管理者までお問い合わせください。
            </p>
          </div>

          {/* クイックアクションボタン */}
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/admin/menu"
              className="btn-outline-luxury px-6 py-3 font-shippori"
            >
              管理者メニューに戻る
            </Link>
            <Link
              href="/admin/showtimes/input"
              className="btn-luxury px-6 py-3 font-shippori"
            >
              続けて上映情報を追加
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}