"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { User, ChevronDown, AlertCircle, CheckCircle } from "lucide-react"

// フォームバリデーションの型定義
interface LoginForm {
  email: string
  password: string
}

interface SignUpForm {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  role: string
}

interface FormErrors {
  [key: string]: string
}

export default function Header() {
  // メニューとメンバーパネルの状態管理
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMemberPanelOpen, setIsMemberPanelOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("login")
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  // フォームの状態管理
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: "",
    password: "",
  })

  const [signUpForm, setSignUpForm] = useState<SignUpForm>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "",
  })

  const [loginErrors, setLoginErrors] = useState<FormErrors>({})
  const [signUpErrors, setSignUpErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // 新規登録用の区分オプション
  const roleOptions = [
    { value: "", label: "区分を選択してください" },
    { value: "general", label: "一般" },
    { value: "university", label: "大学生" },
    { value: "highschool", label: "中学生・高校生" },
    { value: "elementary", label: "小学生・幼児" },
  ]

  const roleMapping: { [key: string]: string } = {
    general: "一般",
    university: "大学生",
    highschool: "中学生・高校生",
    elementary: "小学生・幼児",
  }

  // スクロール時のヘッダー背景変更
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // ログイン状態をチェック
  useEffect(() => {
    const checkLoginStatus = () => {
      const token = localStorage.getItem("token")
      setIsLoggedIn(!!token)
    }

    checkLoginStatus()

    // ストレージの変更を監視
    window.addEventListener("storage", checkLoginStatus)

    return () => {
      window.removeEventListener("storage", checkLoginStatus)
    }
  }, [])

  // メニューの開閉
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
    document.body.style.overflow = !isMenuOpen ? "hidden" : "auto"
  }

  // メンバーパネルの開閉
  const toggleMemberPanel = () => {
    setIsMemberPanelOpen(!isMemberPanelOpen)
    // パネルが閉じるときにフォームをリセット
    if (isMemberPanelOpen) {
      resetForms()
    }
  }

  // フォームとエラーをリセット
  const resetForms = () => {
    setLoginForm({ email: "", password: "" })
    setSignUpForm({ name: "", email: "", password: "", confirmPassword: "", phone: "", role: "" })
    setLoginErrors({})
    setSignUpErrors({})
    setSubmitSuccess(false)
  }

  // タブ切り替えハンドラ
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    resetForms()
  }

  // バリデーション関数
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string): boolean => {
    return password.length >= 8
  }

  const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^[\d\-$+\s]+$/
    return phoneRegex.test(phone) && phone.replace(/\D/g, "").length >= 10
  }

  const validateName = (name: string): boolean => {
    return name.trim().length >= 2
  }

  // ログインフォームのバリデーション
  const validateLoginForm = (): boolean => {
    const errors: FormErrors = {}

    if (!loginForm.email.trim()) {
      errors.email = "メールアドレスを入力してください"
    } else if (!validateEmail(loginForm.email)) {
      errors.email = "有効なメールアドレスを入力してください"
    }

    if (!loginForm.password.trim()) {
      errors.password = "パスワードを入力してください"
    }

    setLoginErrors(errors)
    return Object.keys(errors).length === 0
  }

  // 新規登録フォームのバリデーション
  const validateSignUpForm = (): boolean => {
    const errors: FormErrors = {}

    if (!signUpForm.name.trim()) {
      errors.name = "お名前を入力してください"
    } else if (!validateName(signUpForm.name)) {
      errors.name = "お名前は2文字以上で入力してください"
    }

    if (!signUpForm.email.trim()) {
      errors.email = "メールアドレスを入力してください"
    } else if (!validateEmail(signUpForm.email)) {
      errors.email = "有効なメールアドレスを入力してください"
    }

    if (!signUpForm.password.trim()) {
      errors.password = "パスワードを入力してください"
    } else if (!validatePassword(signUpForm.password)) {
      errors.password = "パスワードは8文字以上で入力してください"
    }

    if (!signUpForm.confirmPassword.trim()) {
      errors.confirmPassword = "パスワード確認を入力してください"
    } else if (signUpForm.password !== signUpForm.confirmPassword) {
      errors.confirmPassword = "パスワードが一致しません"
    }

    if (!signUpForm.phone.trim()) {
      errors.phone = "電話番号を入力してください"
    } else if (!validatePhone(signUpForm.phone)) {
      errors.phone = "有効な電話番号を入力してください"
    }

    if (!signUpForm.role) {
      errors.role = "区分を選択してください"
    }

    setSignUpErrors(errors)
    return Object.keys(errors).length === 0
  }

  // フォーム入力ハンドラ
  const handleLoginChange = (field: keyof LoginForm, value: string) => {
    setLoginForm((prev) => ({ ...prev, [field]: value }))
    // ユーザーが入力を開始したらエラーをクリア
    if (loginErrors[field]) {
      setLoginErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const handleSignUpChange = (field: keyof SignUpForm, value: string) => {
    setSignUpForm((prev) => ({ ...prev, [field]: value }))
    // ユーザーが入力を開始したらエラーをクリア
    if (signUpErrors[field]) {
      setSignUpErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  // フォーム送信ハンドラ
  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateLoginForm()) return

    try {
      const response = await fetch("http://localhost:8080/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm), // stateから直接送信
      })

      if (response.ok) {
        const data = await response.json()
        console.log("ログイン成功レスポンス:", data)

        if (data.token) {
          localStorage.setItem("token", data.token)

          if (data.user && data.user.id !== undefined && data.user.id !== null) {
            localStorage.setItem("userId", data.user.id.toString())
            console.log("UserIDを保存しました:", data.user.id)
          } else {
            console.warn("ログイン成功レスポンスにユーザー情報またはIDが含まれていません:", data)
            alert("ログインは成功しましたが、ユーザー情報が取得できませんでした。")
          }

          setIsLoggedIn(true)
          toggleMemberPanel()
        } else {
          alert("ログインは成功しましたが、認証トークンがありませんでした。")
          console.error("ログイン成功時だがトークンなし:", data)
        }
      }
    } catch (error) {
      console.error("ログインリクエスト中にエラー:", error)
      alert("ネットワークエラーが発生しました。")
    }
  }

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateSignUpForm()) return

    setIsSubmitting(true)

    // 外側の try ブロックを削除し、直接 API 呼び出しの try-catch を開始
    try {
      // <-- ここからが実際の API 呼び出しの try ブロックです
      const roleNameForBackend = roleMapping[signUpForm.role] || signUpForm.role

      const userSignUpData = {
        name: signUpForm.name,
        email: signUpForm.email,
        password: signUpForm.password,
        // confirmPassword はバックエンドに送信不要
        phone: signUpForm.phone, // 電話番号もバックエンドに送信する場合
        role_name: roleNameForBackend,
      }

      console.log("Sending SignUp data:", userSignUpData)

      const response = await fetch("http://localhost:8080/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userSignUpData),
      })

      const responseData = await response.json() // ここで一度だけ読み込む

      console.log("API Response Status:", response.status)
      console.log("API Response Data:", responseData) // 生のJSONデータを確認

      if (!response.ok) {
        // responseDataを直接利用
        throw new Error(responseData.error || "ユーザー登録に失敗しました")
      }

      // 成功時のレスポンスデータは既に responseData に入っている
      console.log("SignUp successful:", responseData)

      setSubmitSuccess(true)
      setTimeout(() => {
        setSubmitSuccess(false)
        toggleMemberPanel()
      }, 2000)
    } catch (error) {
      console.error("SignUp error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // ログアウト処理
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:8080/users/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      })

      const data = await response.json()

      if (response.ok) {
        console.log("ログアウト成功:", data)
      } else {
        console.warn("ログアウト失敗:", data)
        alert("ログアウトに失敗しました")
      }
    } catch (error) {
      console.error("ログアウト中のエラー:", error)
      alert("ログアウト中にエラーが発生しました")
    } finally {
      localStorage.removeItem("token")
      localStorage.removeItem("userId")
      setIsLoggedIn(false)
      toggleMemberPanel()
    }
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
                    className="absolute top-full right-0 mt-2 w-80 sm:w-96 bg-dark-lighter
                                        border border-accent/20 rounded-lg shadow-luxury-lg animate-scale-in max-h-[80vh] overflow-y-auto"
                  >
                    {/* 矢印 */}
                    <div
                      className="absolute -top-2 right-6 w-4 h-4 bg-dark-lighter
                                            border-l border-t border-accent/20 rotate-45"
                    />

                    <div className="p-6">
                      {/* ログイン済みの場合はマイページリンクとログアウトボタンを表示 */}
                      {isLoggedIn ? (
                        <div className="text-center space-y-4">
                          <h3 className="text-lg font-jp text-gold mb-4">ログイン中</h3>
                          <Link
                            href="/mypage"
                            className="block w-full btn-luxury font-shippori font-jp text-center"
                            onClick={toggleMemberPanel}
                          >
                            マイページ
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full py-3 px-4 bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors font-jp border border-red-600 hover:border-red-500"
                          >
                            ログアウト
                          </button>
                        </div>
                      ) : (
                        <>
                          {/* 成功メッセージ */}
                          {submitSuccess && (
                            <div className="mb-4 p-3 bg-green-900/30 border border-green-700/50 rounded-lg flex items-center gap-2">
                              <CheckCircle size={16} className="text-green-400" />
                              <span className="text-green-300 text-sm font-jp">
                                {activeTab === "signup" ? "登録が完了しました" : "ログインしました"}
                              </span>
                            </div>
                          )}

                          {/* タブナビゲーション */}
                          <div className="flex border-b border-accent/20 mb-6">
                            <button
                              className={`flex-1 py-3 text-center text-lg transition-colors font-en ${
                                activeTab === "login"
                                  ? "text-gold border-b-2 border-gold"
                                  : "text-text-muted hover:text-text-secondary"
                              }`}
                              onClick={() => handleTabChange("login")}
                            >
                              Login
                            </button>
                            <button
                              className={`flex-1 py-3 text-center text-lg transition-colors font-en ${
                                activeTab === "signup"
                                  ? "text-gold border-b-2 border-gold"
                                  : "text-text-muted hover:text-text-secondary"
                              }`}
                              onClick={() => handleTabChange("signup")}
                            >
                              Sign Up
                            </button>
                          </div>

                          {/* ログインフォーム */}
                          {activeTab === "login" && (
                            <form onSubmit={handleLoginSubmit} className="space-y-4">
                              <div>
                                <input
                                  type="email"
                                  placeholder="メールアドレス"
                                  value={loginForm.email}
                                  onChange={(e) => handleLoginChange("email", e.target.value)}
                                  className={`w-full px-4 py-3 bg-darker border rounded-lg text-text-primary placeholder-text-muted
                                                                    focus:outline-none transition-colors font-shippori font-jp ${
                                    loginErrors.email
                                      ? "border-red-500 focus:border-red-400"
                                      : "border-accent/30 focus:border-gold"
                                  }`}
                                  disabled={isSubmitting}
                                />
                                {loginErrors.email && (
                                  <div className="mt-1 flex items-center gap-1 text-red-400 text-xs">
                                    <AlertCircle size={12} />
                                    <span className="font-jp">{loginErrors.email}</span>
                                  </div>
                                )}
                              </div>

                              <div>
                                <input
                                  type="password"
                                  placeholder="パスワード"
                                  value={loginForm.password}
                                  onChange={(e) => handleLoginChange("password", e.target.value)}
                                  className={`w-full px-4 py-3 bg-darker border rounded-lg text-text-primary placeholder-text-muted
                                                                    focus:outline-none transition-colors font-shippori font-jp ${
                                    loginErrors.password
                                      ? "border-red-500 focus:border-red-400"
                                      : "border-accent/30 focus:border-gold"
                                  }`}
                                  disabled={isSubmitting}
                                />
                                {loginErrors.password && (
                                  <div className="mt-1 flex items-center gap-1 text-red-400 text-xs">
                                    <AlertCircle size={12} />
                                    <span className="font-jp">{loginErrors.password}</span>
                                  </div>
                                )}
                              </div>

                              <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full btn-luxury font-shippori font-jp disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isSubmitting ? "ログイン中..." : "ログイン"}
                              </button>

                              <Link
                                href="/forgot-password"
                                className="block text-center text-sm text-text-muted hover:text-gold
                                                                transition-colors font-shippori font-jp"
                              >
                                パスワードを忘れた方
                              </Link>
                            </form>
                          )}

                          {/* サインアップフォーム */}
                          {activeTab === "signup" && (
                            <form onSubmit={handleSignUpSubmit} className="space-y-4">
                              <div>
                                <input
                                  type="text"
                                  placeholder="お名前"
                                  value={signUpForm.name}
                                  onChange={(e) => handleSignUpChange("name", e.target.value)}
                                  className={`w-full px-4 py-3 bg-darker border rounded-lg text-text-primary placeholder-text-muted
                                                                    focus:outline-none transition-colors font-shippori font-jp ${
                                    signUpErrors.name
                                      ? "border-red-500 focus:border-red-400"
                                      : "border-accent/30 focus:border-gold"
                                  }`}
                                  disabled={isSubmitting}
                                />
                                {signUpErrors.name && (
                                  <div className="mt-1 flex items-center gap-1 text-red-400 text-xs">
                                    <AlertCircle size={12} />
                                    <span className="font-jp">{signUpErrors.name}</span>
                                  </div>
                                )}
                              </div>

                              <div>
                                <input
                                  type="email"
                                  placeholder="メールアドレス"
                                  value={signUpForm.email}
                                  onChange={(e) => handleSignUpChange("email", e.target.value)}
                                  className={`w-full px-4 py-3 bg-darker border rounded-lg text-text-primary placeholder-text-muted
                                                                    focus:outline-none transition-colors font-shippori font-jp ${
                                    signUpErrors.email
                                      ? "border-red-500 focus:border-red-400"
                                      : "border-accent/30 focus:border-gold"
                                  }`}
                                  disabled={isSubmitting}
                                />
                                {signUpErrors.email && (
                                  <div className="mt-1 flex items-center gap-1 text-red-400 text-xs">
                                    <AlertCircle size={12} />
                                    <span className="font-jp">{signUpErrors.email}</span>
                                  </div>
                                )}
                              </div>

                              <div>
                                <input
                                  type="password"
                                  placeholder="パスワード"
                                  value={signUpForm.password}
                                  onChange={(e) => handleSignUpChange("password", e.target.value)}
                                  className={`w-full px-4 py-3 bg-darker border rounded-lg text-text-primary placeholder-text-muted
                                                                    focus:outline-none transition-colors font-shippori font-jp ${
                                    signUpErrors.password
                                      ? "border-red-500 focus:border-red-400"
                                      : "border-accent/30 focus:border-gold"
                                  }`}
                                  disabled={isSubmitting}
                                />
                                {signUpErrors.password && (
                                  <div className="mt-1 flex items-center gap-1 text-red-400 text-xs">
                                    <AlertCircle size={12} />
                                    <span className="font-jp">{signUpErrors.password}</span>
                                  </div>
                                )}
                              </div>

                              <div>
                                <input
                                  type="password"
                                  placeholder="パスワード確認"
                                  value={signUpForm.confirmPassword}
                                  onChange={(e) => handleSignUpChange("confirmPassword", e.target.value)}
                                  className={`w-full px-4 py-3 bg-darker border rounded-lg text-text-primary placeholder-text-muted
                                                                    focus:outline-none transition-colors font-shippori font-jp ${
                                    signUpErrors.confirmPassword
                                      ? "border-red-500 focus:border-red-400"
                                      : "border-accent/30 focus:border-gold"
                                  }`}
                                  disabled={isSubmitting}
                                />
                                {signUpErrors.confirmPassword && (
                                  <div className="mt-1 flex items-center gap-1 text-red-400 text-xs">
                                    <AlertCircle size={12} />
                                    <span className="font-jp">{signUpErrors.confirmPassword}</span>
                                  </div>
                                )}
                              </div>

                              <div>
                                <input
                                  type="tel"
                                  placeholder="電話番号"
                                  value={signUpForm.phone}
                                  onChange={(e) => handleSignUpChange("phone", e.target.value)}
                                  className={`w-full px-4 py-3 bg-darker border rounded-lg text-text-primary placeholder-text-muted
                                                                    focus:outline-none transition-colors font-shippori font-jp ${
                                    signUpErrors.phone
                                      ? "border-red-500 focus:border-red-400"
                                      : "border-accent/30 focus:border-gold"
                                  }`}
                                  disabled={isSubmitting}
                                />
                                {signUpErrors.phone && (
                                  <div className="mt-1 flex items-center gap-1 text-red-400 text-xs">
                                    <AlertCircle size={12} />
                                    <span className="font-jp">{signUpErrors.phone}</span>
                                  </div>
                                )}
                              </div>

                              <div>
                                <select
                                  value={signUpForm.role}
                                  onChange={(e) => handleSignUpChange("role", e.target.value)}
                                  className={`w-full px-4 py-3 bg-darker border rounded-lg text-text-primary
                                                                    focus:outline-none transition-colors font-shippori font-jp ${
                                    signUpErrors.role
                                      ? "border-red-500 focus:border-red-400"
                                      : "border-accent/30 focus:border-gold"
                                  }`}
                                  disabled={isSubmitting}
                                >
                                  {roleOptions.map((option) => (
                                    <option key={option.value} value={option.value} className="bg-darker">
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                                {signUpErrors.role && (
                                  <div className="mt-1 flex items-center gap-1 text-red-400 text-xs">
                                    <AlertCircle size={12} />
                                    <span className="font-jp">{signUpErrors.role}</span>
                                  </div>
                                )}
                              </div>

                              <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full btn-luxury font-shippori font-jp disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {isSubmitting ? "登録中..." : "新規登録"}
                              </button>
                            </form>
                          )}
                        </>
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
            <h2 className="text-2xl font-playfair text-gold mb-8 text-left">NAVIGATION</h2>

            {/* メニューリスト */}
            <ul className="space-y-6">
              <li>
                <Link href="/" className="nav-link block text-lg py-2 font-jp" onClick={toggleMenu}>
                  トップページ
                </Link>
              </li>
              <li>
                <Link href="/movies" className="nav-link block text-lg py-2 font-jp" onClick={toggleMenu}>
                  作品案内
                </Link>
              </li>
              <li>
                <Link href="/tickets/schedule" className="nav-link block text-lg py-2 font-jp" onClick={toggleMenu}>
                  上映スケジュール
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
