"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CreditCard, User, ArrowLeft, Lock, Calendar, Clock, MapPin } from "lucide-react"
import Image from "next/image"
import "./payment.css"

export default function Payment() {
    // typesから送られてきたparamsの取得

    type SeatTicketForPayment = {
        seatId: string
        roleId: string // roleId を型に追加
        price: number
        seatIdStr: string
        ticketTypeName: string
    }

    const router = useRouter()
    const searchParams = useSearchParams()
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const movieId = searchParams.get("movieId")
    const date = searchParams.get("date")
    const time = searchParams.get("time")
    const screeningId = searchParams.get("screeningId")
    const seatTicketsParam = searchParams.get("seatTickets")
    const parsedSeatTickets: SeatTicketForPayment[] = seatTicketsParam ? JSON.parse(seatTicketsParam) : []
    const [creditCardForm, setCreditCardForm] = useState({
        cardNumber: "",
        cardExpiration: "",
        saveCard: false, // チェックボックスの状態
    })
    const [userData, setUserData] = useState<any>(null)
    const [isUserChecked, setIsUserChecked] = useState(false) // ログイン状態のチェック完了を管理
    // フォーム入力値を更新するハンドラ
    const handleCardFormChange = (field: keyof typeof creditCardForm, value: string | boolean) => {
        setCreditCardForm((prev) => ({ ...prev, [field]: value }))
    }

    const allRoleIds = parsedSeatTickets
      .map((ticket) => ticket.roleId)
      .filter(Boolean) // null や undefined の roleId を取り除く
      .join(",")
    const screen = searchParams.get("screen")
    const seatTickets = searchParams.get("seatTickets")
    const totalPrice = searchParams.get("totalPrice")

    const TestUser = {
        name: "none",
        email: "test@test.com",
        password: "test",
        RoleName: "一般",
    }

    // ユーザー情報
    const [userId, setUserId] = useState("")

    const [token, setauthToken] = useState("")

    useEffect(() => {
        const getUserId = localStorage.getItem("userId")
        if (getUserId) {
            setUserId(getUserId)
        }
    }, [])
    console.log(userId)
    useEffect(() => {
        const initialize = async () => {
            const userId = localStorage.getItem("userId")
            const token = localStorage.getItem("token")

            if (userId && token) {
                try {
                    const response = await fetch(`http://localhost:8080/users/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    })
                    if (response.ok) {
                        const data = await response.json()
                        setUserData(data)
                        // 取得したデータにカード番号があれば'registed'を初期値に
                        if (data.card_number) {
                            setCard("registed")
                        }
                    } else {
                        // トークン切れなどで取得失敗した場合
                        setUserData(null)
                    }
                } catch (err) {
                    console.error("ユーザー情報取得APIエラー:", err)
                    setUserData(null)
                }
            }
            setIsUserChecked(true)
        }

        initialize()
    }, [])

    // ラジオボタン処理
    const [selCard, setCard] = useState("new")
    // ユーザーが無い時は初期値をnewの方にしてほしいです
    const HandleRadio = (data: any) => {
        setCard(data.target.id)
        console.log("Changed" + data.target.value)
    }

    const handlePayment = async () => {
        setIsLoading(true)
        setError(null)

        try {
            // --- 1. localStorageから認証情報を取得 ---
            const userId = localStorage.getItem("userId")
            const token = localStorage.getItem("token")

            // 認証情報がない場合は処理を中断
            if (!userId || !token) {
                throw new Error("ログイン情報が見つかりません。再度ログインしてください。")
            }

            // --- 2. /purchases/ へのリクエストボディを生成 ---
            const roleCounts = parsedSeatTickets.reduce(
              (acc, ticket) => {
                  const roleId = Number(ticket.roleId)
                  if (!roleId) return acc
                  acc[roleId] = (acc[roleId] || 0) + 1
                  return acc
              },
              {} as Record<number, number>,
            )

            const purchaseDetails = Object.entries(roleCounts).map(([role_id, quantity]) => ({
                role_id: Number(role_id),
                quantity,
            }))

            const purchaseRequestBody = {
                user_id: Number(userId), // ★ localStorageから取得したuserIdを使用
                screening_id: Number(screeningId),
                purchase_time: new Date().toISOString(),
                purchase_details: purchaseDetails,
            }

            console.log("Sending to /purchases/:", JSON.stringify(purchaseRequestBody, null, 2))

            // --- 3. /purchases/ へのAPIリクエストを送信 (認証ヘッダー付き) ---
            const purchaseResponse = await fetch("http://localhost:8080/purchases/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`, // ★ 認証トークンをヘッダーに追加
                },
                body: JSON.stringify(purchaseRequestBody),
            })

            if (!purchaseResponse.ok) {
                // エラーレスポンスの本文をテキストとして読み込む試み
                const errorText = await purchaseResponse.text()
                try {
                    // JSONとしてパースできればパースする
                    const errorData = JSON.parse(errorText)
                    throw new Error(errorData.message || "購入情報の作成に失敗しました。")
                } catch {
                    // パースできなければテキストをそのまま表示
                    throw new Error(errorText || "購入情報の作成に失敗しました。")
                }
            }

            const purchaseResult = await purchaseResponse.json()
            const purchaseId = purchaseResult.PurchaseID

            if (!purchaseId) {
                throw new Error("レスポンスから購入IDが取得できませんでした。")
            }

            console.log("Purchase successful. Purchase ID:", purchaseId)

            // --- 4. /reservationseats へのリクエストを送信 (認証ヘッダー付き) ---
            const reservationPromises = parsedSeatTickets.map((ticket) => {
                const reservationRequestBody = {
                    purchase_id: purchaseId,
                    seat_id: Number(ticket.seatId),
                }

                return fetch("http://localhost:8080/reservationseats/", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`, // ★ 認証トークンをヘッダーに追加
                    },
                    body: JSON.stringify(reservationRequestBody),
                })
            })

            const reservationResponses = await Promise.all(reservationPromises)

            for (const res of reservationResponses) {
                if (!res.ok) {
                    const errorText = await res.text()
                    throw new Error(errorText || "座席の予約に失敗しました。")
                }
            }

            console.log("All seats reserved successfully.")

            if (selCard === "new" && creditCardForm.saveCard) {
                const updatePayload = {
                    card_number: creditCardForm.cardNumber,
                    card_expiration: creditCardForm.cardExpiration,
                }

                console.log(`ユーザー(ID: ${userId})のカード情報を更新します:`, updatePayload)

                // ユーザー更新APIを呼び出す (PATCHメソッド)
                // 決済自体は成功しているので、ここでのエラーはコンソールに出力するに留め、ユーザーの画面遷移は妨げない
                try {
                    console.log("APIに送信するuserId:", userId)
                    console.log("APIに送信するtoken:", token)
                    const updateUserResponse = await fetch(`http://localhost:8080/users/update/${userId}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify(updatePayload),
                    })

                    if (!updateUserResponse.ok) {
                        const updateErrorData = await updateUserResponse.json()
                        console.warn("カード情報の更新に失敗しました:", updateErrorData)
                    } else {
                        console.log("カード情報が正常に更新されました。")
                    }
                } catch (updateError) {
                    console.error("カード情報の更新API呼び出し中にネットワークエラーが発生:", updateError)
                }
            }

            // --- 5. 成功した場合、完了ページに遷移 ---
            sessionStorage.removeItem("seatSelection")

            const params = new URLSearchParams()
            params.set("date", date || "")
            params.set("time", time || "")
            params.set("totalPrice", totalPrice || "")
            params.set("screen", screen || "")
            params.set("seatTickets", seatTickets || "")

            router.push(`/tickets/completed?${params.toString()}`)
        } catch (err: any) {
            console.error("Payment failed:", err)
            setError(err.message || "決済処理中に予期せぬエラーが発生しました。")
        } finally {
            setIsLoading(false)
        }
    }

    const handleBack = () => {
        // typesに必要な情報はsessionStrageにあるのでそのまま遷移で問題なさそう？
        // 後でなんか起きたら怖いかも
        router.push(`/tickets/types?`)
    }

    const movieInfo = {
        title: "インターステラー",
        poster: "/images/movie-poster-1.jpg",
    }

    return (
      <div className="min-h-screen pt-24">
          <section className="relative h-[20vh] md:h-[30vh] overflow-hidden">
              <div className="absolute inset-0">
                  <Image src="/images/theater-interior.jpg" alt="劇場内観" fill className="object-cover" priority />
                  <div className="absolute inset-0 bg-gradient-to-r from-darkest/90 via-darkest/60 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-darkest/80 via-transparent to-darkest/40" />
              </div>

              <div className="relative h-full flex items-center">
                  <div className="container-luxury">
                      <div className="max-w-2xl animate-fade-in">
                          <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-4 font-en">PAYMENT</h1>
                          <p className="text-xl md:text-2xl text-gold mb-4 font-jp">お支払い</p>
                      </div>
                  </div>
              </div>
          </section>

          <section className="py-16">
              <div className="container-luxury">
                  {/* 映画情報 */}
                  <div className="card-luxury p-6 mb-8">
                      <div className="flex items-center gap-6">
                          <div className="relative w-20 h-28 flex-shrink-0">
                              <Image
                                src={movieInfo.poster || "/placeholder.svg"}
                                alt={movieInfo.title}
                                fill
                                className="object-cover rounded"
                              />
                          </div>
                          <div className="flex-1">
                              <h2 className="text-2xl font-bold text-gold mb-2 font-jp">{movieInfo.title}</h2>
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-text-secondary">
                                  <div className="flex items-center gap-2">
                                      <Calendar size={16} className="text-gold" />
                                      <span className="font-jp">{date}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                      <Clock size={16} className="text-gold" />
                                      <span className="font-jp">{time}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                      <MapPin size={16} className="text-gold" />
                                      <span className="font-jp">{screen}</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                      {/* メインコンテンツエリア */}
                      <div className="xl:col-span-2 space-y-8">
                          {/* デバッグ情報（開発用） */}
                          <div className="hidden">
                              {userId}/{movieId}/{date}/{time}/{screen}/roleId:{allRoleIds}/{totalPrice}/{screeningId}
                          </div>

                          {isUserChecked && (
                            <>
                                {/* ログインしていない場合 (userDataがnull) */}
                                {!userData && (
                                  <div className="card-luxury p-8">
                                      <div className="flex items-center gap-3 mb-6">
                                          <User className="text-gold" size={24} />
                                          <h2 className="text-2xl font-bold text-text-primary font-jp">購入者情報入力</h2>
                                      </div>
                                      <div className="border-t border-accent/20 pt-6">
                                          <form action="#" className="space-y-6">
                                              {/* フォーム内容は既存のまま維持 */}
                                          </form>
                                      </div>
                                  </div>
                                )}

                                {/* 会員の場合 (userDataが存在する) */}
                                {userData && (
                                  <div className="card-luxury p-8 m-0">
                                      <div className="flex items-center gap-3 mb-6">
                                          <CreditCard className="text-gold" size={24} />
                                          <h2 className="text-2xl font-bold text-text-primary font-jp">お支払い方法選択</h2>
                                      </div>
                                      <div className="border-t border-accent/20 pt-6">
                                          <div className="space-y-4">
                                              <label className="flex items-center gap-3 p-4 border border-accent/30 rounded-lg hover:border-gold/50 transition-colors cursor-pointer">
                                                  <input
                                                    type="radio"
                                                    name="selectCredit"
                                                    id="registed"
                                                    className="w-4 h-4 text-gold bg-darker border-accent/30 accent-gold"
                                                    checked={selCard === "registed"}
                                                    onChange={HandleRadio}
                                                  />
                                                  <span className="text-text-primary font-jp">登録されたクレジットカードで支払う</span>
                                              </label>
                                              <label className="flex items-center gap-3 p-4 border border-accent/30 rounded-lg hover:border-gold/50 transition-colors cursor-pointer">
                                                  <input
                                                    type="radio"
                                                    name="selectCredit"
                                                    id="new"
                                                    className="w-4 h-4 text-gold bg-darker border-accent/30 accent-gold"
                                                    checked={selCard === "new"}
                                                    onChange={HandleRadio}
                                                  />
                                                  <span className="text-text-primary font-jp">新しくクレジット情報を入力する</span>
                                              </label>
                                          </div>
                                      </div>
                                  </div>
                                )}
                            </>
                          )}

                          {selCard === "registed" ? (
                            // 登録済みを使うとき
                            <div className="card-luxury p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <Lock className="text-gold" size={24} />
                                    <h3 className="text-xl font-bold text-text-primary font-jp">登録済みカード情報</h3>
                                </div>
                                <div className="border-t border-accent/20 pt-6">
                                    {userData ? (
                                      <div className="bg-darker p-6 rounded-lg border border-accent/20">
                                          {userData.card_number ? (
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <CreditCard className="text-gold" size={20} />
                                                    <p className="text-text-primary font-jp">
                                                        カード番号: **** **** **** {userData.card_number.slice(-4)}
                                                    </p>
                                                </div>
                                                <p className="text-text-secondary font-jp ml-8">有効期限: {userData.card_expiration}</p>
                                            </div>
                                          ) : (
                                            <p className="text-text-muted font-jp">登録済みのカード情報はありません。</p>
                                          )}
                                      </div>
                                    ) : (
                                      <p className="text-text-muted font-jp">カード情報を読み込み中...</p>
                                    )}
                                </div>
                            </div>
                          ) : (
                            <div className="card-luxury p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <CreditCard className="text-gold" size={24} />
                                    <h3 className="text-xl font-bold text-text-primary font-jp">クレジット情報入力</h3>
                                </div>
                                <div className="border-t border-accent/20 pt-6">
                                    <form action="#" className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label
                                                  htmlFor="method"
                                                  className="block text-sm font-medium text-text-secondary mb-2 font-jp"
                                                >
                                                    決済方法
                                                </label>
                                                <input
                                                  type="text"
                                                  className="w-full px-4 py-3 bg-darker border border-accent/30 rounded-lg text-text-primary placeholder-text-muted focus:border-gold focus:outline-none transition-colors"
                                                  id="method"
                                                  name="method"
                                                  // placeholder="クレジットカード"
                                                />
                                            </div>
                                            <div>
                                                <label
                                                  htmlFor="cardNum"
                                                  className="block text-sm font-medium text-text-secondary mb-2 font-jp"
                                                >
                                                    カード番号
                                                </label>
                                                <input
                                                  type="text"
                                                  className="w-full px-4 py-3 bg-darker border border-accent/30 rounded-lg text-text-primary placeholder-text-muted focus:border-gold focus:outline-none transition-colors"
                                                  id="cardNum"
                                                  name="cardNum"
                                                  value={creditCardForm.cardNumber}
                                                  onChange={(e) => handleCardFormChange("cardNumber", e.target.value)}
                                                  placeholder="1234 5678 9012 3456"
                                                />
                                            </div>
                                            <div>
                                                <label
                                                  htmlFor="cardLim"
                                                  className="block text-sm font-medium text-text-secondary mb-2 font-jp"
                                                >
                                                    カード有効期限
                                                </label>
                                                <input
                                                  type="text"
                                                  className="w-full px-4 py-3 bg-darker border border-accent/30 rounded-lg text-text-primary placeholder-text-muted focus:border-gold focus:outline-none transition-colors"
                                                  id="cardLim"
                                                  name="cardlim"
                                                  value={creditCardForm.cardExpiration}
                                                  onChange={(e) => handleCardFormChange("cardExpiration", e.target.value)}
                                                  placeholder="MM/YY"
                                                />
                                            </div>
                                            <div>
                                                <label
                                                  htmlFor="secCode"
                                                  className="block text-sm font-medium text-text-secondary mb-2 font-jp"
                                                >
                                                    セキュリティコード
                                                </label>
                                                <input
                                                  type="password"
                                                  className="w-full px-4 py-3 bg-darker border border-accent/30 rounded-lg text-text-primary placeholder-text-muted focus:border-gold focus:outline-none transition-colors"
                                                  id="secCode"
                                                  name="secCode"
                                                  placeholder="123"
                                                />
                                            </div>
                                            <div className="md:col-span-2">
                                                <label
                                                  htmlFor="cardName"
                                                  className="block text-sm font-medium text-text-secondary mb-2 font-jp"
                                                >
                                                    カード名義人
                                                </label>
                                                <input
                                                  type="text"
                                                  className="w-full px-4 py-3 bg-darker border border-accent/30 rounded-lg text-text-primary placeholder-text-muted focus:border-gold focus:outline-none transition-colors"
                                                  id="cardName"
                                                  name="cardName"
                                                  placeholder="TARO YAMADA"
                                                />
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3 pt-4">
                                            <input
                                              type="checkbox"
                                              id="toRegist"
                                              name="toRegist"
                                              checked={creditCardForm.saveCard}
                                              onChange={(e) => handleCardFormChange("saveCard", e.target.checked)}
                                              className="w-4 h-4 text-gold bg-darker border-accent/30 rounded focus:ring-gold focus:ring-2"
                                            />
                                            <label htmlFor="toRegist" className="text-text-secondary font-jp">
                                                このクレジットカードを登録する
                                            </label>
                                        </div>
                                    </form>
                                </div>
                            </div>
                          )}
                      </div>

                      {/* サイドバー（注文確認・決済セクション） */}
                      <div className="xl:col-span-1">
                          <div className="card-luxury p-6 sticky top-32">
                              {/* 注文確認 */}
                              <h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2 font-jp">
                                  <User size={20} className="text-gold" />
                                  注文確認
                              </h3>

                              {/* 選択座席・券種一覧 */}
                              <div className="space-y-3 mb-6">
                                  {parsedSeatTickets.map((ticket) => (
                                    <div key={ticket.seatIdStr} className="flex items-center justify-between p-3 bg-darker rounded-lg">
                                        <div>
                                            <p className="text-text-primary font-medium font-en">{ticket.seatIdStr}</p>
                                            <p className="text-sm text-text-muted font-jp">{ticket.ticketTypeName}</p>
                                        </div>
                                        <p className="text-gold font-medium font-playfair">¥{ticket.price.toLocaleString()}</p>
                                    </div>
                                  ))}
                              </div>

                              <div className="space-y-6">
                                  {/* エラーメッセージの表示 */}
                                  {error && (
                                    <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                                        <p className="text-red-400 font-jp">{error}</p>
                                    </div>
                                  )}

                                  {/* 合計金額 */}
                                  <div className="border-t border-accent/20 pt-4">
                                      <div className="flex items-center justify-between mb-4">
                                          <span className="text-lg font-medium text-text-primary font-jp">合計金額</span>
                                          <span className="text-2xl font-bold text-gold font-playfair">
                        ¥{Number(totalPrice).toLocaleString()}
                      </span>
                                      </div>
                                      <p className="text-sm text-text-muted font-jp text-center">上記金額でお支払いを行います</p>
                                  </div>

                                  {/* アクションボタン */}
                                  <div className="space-y-3">
                                      <button
                                        onClick={handlePayment}
                                        disabled={isLoading}
                                        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-gold to-gold-light text-darkest hover:shadow-gold-glow rounded-lg font-medium transition-all duration-300 font-jp disabled:opacity-50 disabled:cursor-not-allowed"
                                      >
                                          {/*<Lock size={18} />*/}
                                          {isLoading ? "処理中..." : "決済を完了する"}
                                      </button>

                                      <button
                                        onClick={handleBack}
                                        disabled={isLoading}
                                        className="w-full flex items-center justify-center gap-2 py-3 px-4 border border-accent/30 text-text-secondary hover:text-text-primary hover:border-accent/50 rounded-lg transition-all duration-300 font-jp"
                                      >
                                          <ArrowLeft size={18} />
                                          券種選択に戻る
                                      </button>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </section>
      </div>
    )
}
