"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { User, ChevronDown } from "lucide-react"

export default function Header() {
    // メニューとメンバーパネルの状態管理
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const [isMemberPanelOpen, setIsMemberPanelOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("login")
    const [isScrolled, setIsScrolled] = useState(false)

    // スクロール時のヘッダー背景変更
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    // メニューの開閉
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen)
        // メニューが開いている時は背景スクロールを無効化
        document.body.style.overflow = !isMenuOpen ? "hidden" : "auto"
    }

    // メンバーパネルの開閉
    const toggleMemberPanel = () => {
        setIsMemberPanelOpen(!isMemberPanelOpen)
    }

    // コンポーネントのアンマウント時にスクロールを有効化
    useEffect(() => {
        return () => {
            document.body.style.overflow = "auto"
        }
    }, [])

    return (
        <>
            {/* ヘッダー本体 */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled ? "bg-darkest/95 backdrop-blur-md shadow-luxury" : "bg-transparent"
                }`}
            >
                <div className="container-luxury">
                    <div className="flex items-center justify-between h-20">
                        {/* メニューボタン */}
                        <div className="flex-1 flex items-center">
                            <button
                                onClick={toggleMenu}
                                className="flex flex-col items-center justify-center w-16 h-16 hover:bg-accent/30 transition-all duration-300 group"
                                aria-label="メニューを開く"
                            >
                                <div className="relative w-6 h-6">
                  <span
                      className={`absolute block w-6 h-0.5 bg-text-primary transition-all duration-300 
                      ${isMenuOpen ? "rotate-45 top-3" : "top-1"}`}
                  />
                                    <span
                                        className={`absolute block w-6 h-0.5 bg-text-primary transition-all duration-300 
                      ${isMenuOpen ? "opacity-0" : "top-3"}`}
                                    />
                                    <span
                                        className={`absolute block w-6 h-0.5 bg-text-primary transition-all duration-300 
                      ${isMenuOpen ? "-rotate-45 top-3" : "top-5"}`}
                                    />
                                </div>
                                <span className="text-xs text-text-muted mt-1 font-en">MENU</span>
                            </button>
                        </div>

                        {/* ロゴ */}
                        <div className="flex-1 flex justify-center">
                            <Link
                                href="/"
                                className="text-4xl md:text-5xl text-gold hover:text-gold-light
                  transition-colors duration-300 tracking-wider font-en"
                            >
                                HAL CINEMA
                            </Link>
                        </div>

                        {/* メンバーボタン */}
                        <div className="flex-1 flex justify-end">
                            <div className="relative">
                                <button
                                    onClick={toggleMemberPanel}
                                    className="flex items-center gap-2 px-4 py-2 text-text-secondary
                  hover:text-gold transition-colors duration-300 group"
                                    aria-label="メンバーメニューを開く"
                                >
                                    <User size={20} />
                                    <span className="text-lg hidden sm:block font-en">MEMBER</span>
                                    <ChevronDown
                                        size={16}
                                        className={`transition-transform duration-300 ${isMemberPanelOpen ? "rotate-180" : ""}`}
                                    />
                                </button>

                                {/* メンバーパネル */}
                                {isMemberPanelOpen && (
                                    <div
                                        className="absolute top-full right-0 mt-2 w-80 bg-dark-lighter
                  border border-accent/20 rounded-lg shadow-luxury-lg animate-scale-in"
                                    >
                                        {/* 矢印 */}
                                        <div
                                            className="absolute -top-2 right-6 w-4 h-4 bg-dark-lighter
                    border-l border-t border-accent/20 rotate-45"
                                        />

                                        <div className="p-6">
                                            {/* タブナビゲーション */}
                                            <div className="flex border-b border-accent/20 mb-6">
                                                <button
                                                    className={`flex-1 py-3 text-center text-lg transition-colors font-en ${
                                                        activeTab === "login"
                                                            ? "text-gold border-b-2 border-gold"
                                                            : "text-text-muted hover:text-text-secondary"
                                                    }`}
                                                    onClick={() => setActiveTab("login")}
                                                >
                                                    Login
                                                </button>
                                                <button
                                                    className={`flex-1 py-3 text-center text-lg transition-colors font-en ${
                                                        activeTab === "signup"
                                                            ? "text-gold border-b-2 border-gold"
                                                            : "text-text-muted hover:text-text-secondary"
                                                    }`}
                                                    onClick={() => setActiveTab("signup")}
                                                >
                                                    Sign Up
                                                </button>
                                            </div>

                                            {/* ログインフォーム */}
                                            {activeTab === "login" && (
                                                <div className="space-y-4">
                                                    <input
                                                        type="email"
                                                        placeholder="メールアドレス"
                                                        className="w-full px-4 py-3 bg-darker border border-accent/30
                            rounded-lg text-text-primary placeholder-text-muted
                            focus:border-gold focus:outline-none transition-colors font-shippori font-jp"
                                                    />
                                                    <input
                                                        type="password"
                                                        placeholder="パスワード"
                                                        className="w-full px-4 py-3 bg-darker border border-accent/30
                            rounded-lg text-text-primary placeholder-text-muted
                            focus:border-gold focus:outline-none transition-colors font-shippori font-jp"
                                                    />
                                                    <button className="w-full btn-luxury font-shippori font-jp">ログイン</button>
                                                    <Link
                                                        href="/forgot-password"
                                                        className="block text-center text-sm text-text-muted hover:text-gold
                            transition-colors font-shippori font-jp"
                                                    >
                                                        パスワードを忘れた方
                                                    </Link>
                                                </div>
                                            )}

                                            {/* サインアップフォーム */}
                                            {activeTab === "signup" && (
                                                <div className="space-y-4">
                                                    <input
                                                        type="text"
                                                        placeholder="お名前"
                                                        className="w-full px-4 py-3 bg-darker border border-accent/30
                            rounded-lg text-text-primary placeholder-text-muted
                            focus:border-gold focus:outline-none transition-colors font-shippori font-jp"
                                                    />
                                                    <input
                                                        type="email"
                                                        placeholder="メールアドレス"
                                                        className="w-full px-4 py-3 bg-darker border border-accent/30
                            rounded-lg text-text-primary placeholder-text-muted
                            focus:border-gold focus:outline-none transition-colors font-shippori font-jp"
                                                    />
                                                    <input
                                                        type="password"
                                                        placeholder="パスワード"
                                                        className="w-full px-4 py-3 bg-darker border border-accent/30
                            rounded-lg text-text-primary placeholder-text-muted
                            focus:border-gold focus:outline-none transition-colors font-shippori font-jp"
                                                    />
                                                    <input
                                                        type="tel"
                                                        placeholder="電話番号"
                                                        className="w-full px-4 py-3 bg-darker border border-accent/30
                            rounded-lg text-text-primary placeholder-text-muted
                            focus:border-gold focus:outline-none transition-colors font-shippori font-jp"
                                                    />
                                                    <button className="w-full btn-luxury font-shippori font-jp">新規登録</button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* サイドメニュー */}
            <div
                className={`fixed inset-0 z-40 transition-opacity duration-300 ${
                    isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
            >
                {/* オーバーレイ */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={toggleMenu} />

                {/* メニューパネル */}
                <nav
                    className={`absolute left-0 top-0 h-full w-80 bg-darker border-r border-accent/20 
            shadow-luxury-lg transform transition-transform duration-300 ${
                        isMenuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                >
                    <div className="p-8 pt-24">
                        {/* メニュータイトル */}
                        <h2 className="text-2xl font-playfair text-gold mb-8 text-center">NAVIGATION</h2>

                        {/* メニューリスト */}
                        <ul className="space-y-6">
                            <li>
                                <Link href="/" className="nav-link block text-lg py-2 font-en" onClick={toggleMenu}>
                                    トップページ
                                </Link>
                            </li>
                            <li>
                                <Link href="/movies" className="nav-link block text-lg py-2 font-en" onClick={toggleMenu}>
                                    作品案内
                                </Link>
                            </li>
                            <li>
                                <Link href="/news" className="nav-link block text-lg py-2 font-jp" onClick={toggleMenu}>
                                    ニュース
                                </Link>
                            </li>
                            <li>
                                <Link href="/access" className="nav-link block text-lg font-shippori py-2" onClick={toggleMenu}>
                                    アクセス
                                </Link>
                            </li>
                            <li>
                                <Link href="/mypage" className="nav-link block text-lg font-shippori py-2" onClick={toggleMenu}>
                                    マイページ
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="nav-link block text-lg font-shippori py-2" onClick={toggleMenu}>
                                    よくある質問
                                </Link>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>

            {/* メンバーパネル外クリック時の閉じる処理 */}
            {isMemberPanelOpen && <div className="fixed inset-0 z-30" onClick={() => setIsMemberPanelOpen(false)} />}
        </>
    )
}
