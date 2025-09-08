"use client"
import {useState} from "react"
import {useRouter, useSearchParams} from "next/navigation"
import Image from "next/image"
import {ArrowLeft, CreditCard, User, Calendar, Clock, MapPin, CheckCircle} from "lucide-react"
// import "./payment.css"

export default function payment() {
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
	const [isLoading, setIsLoading] = useState(false) // ★ ローディング状態
	const [error, setError] = useState<string | null>(null) // ★ エラーメッセージ状態

	const movieId = searchParams.get("movieId")
	const date = searchParams.get("date")
	const time = searchParams.get("time")
	const screeningId = searchParams.get("screeningId")
	const seatTicketsParam = searchParams.get("seatTickets")
	const parsedSeatTickets: SeatTicketForPayment[] = seatTicketsParam ? JSON.parse(seatTicketsParam) : []

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

			// --- 5. 成功した場合、完了ページに遷移 ---
			sessionStorage.removeItem("seatSelection")
			router.push("/tickets/complete")
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

	return (
		<div className="min-h-screen pt-24">
			<section className="relative h-[20vh] md:h-[30vh] overflow-hidden">
				<div className="absolute inset-0">
					<Image src="/images/theater-interior-1.png" alt="劇場内観" fill className="object-cover" priority/>
					<div className="absolute inset-0 bg-gradient-to-r from-darkest/90 via-darkest/60 to-transparent"/>
					<div className="absolute inset-0 bg-gradient-to-t from-darkest/80 via-transparent to-darkest/40"/>
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
					<div className="card-luxury p-6 mb-8">
						<div className="flex items-center gap-6">
							<div className="relative w-20 h-28 flex-shrink-0">
								<Image src="/images/movie-poster-1.jpg" alt="映画ポスター" fill className="object-cover rounded"/>
							</div>
							<div className="flex-1">
								<h2 className="text-2xl font-bold text-gold mb-2 font-jp">{movieId}</h2>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-text-secondary">
									<div className="flex items-center gap-2">
										<Calendar size={16} className="text-gold"/>
										<span className="font-jp">{date}</span>
									</div>
									<div className="flex items-center gap-2">
										<Clock size={16} className="text-gold"/>
										<span className="font-jp">{time}</span>
									</div>
									<div className="flex items-center gap-2">
										<MapPin size={16} className="text-gold"/>
										<span className="font-jp">スクリーン {screen}</span>
									</div>
								</div>
							</div>
						</div>
					</div>

					<div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
						<div className="xl:col-span-2 space-y-8">
							{/* 購入者情報入力 */}
							{!TestUser.name && (
								<div className="card-luxury p-8">
									<h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2 font-jp">
										<User size={24} className="text-gold"/>
										購入者情報入力
									</h3>

									<div className="space-y-6">
										<div>
											<label htmlFor="PurName" className="block text-sm font-medium text-text-secondary mb-2 font-jp">
												氏名
											</label>
											<input
												type="text"
												id="PurName"
												name="PurName"
												className="w-full px-4 py-3 bg-darker border border-accent/30 rounded-lg
                                                         text-text-primary placeholder-text-muted focus:border-gold
                                                         focus:outline-none transition-colors font-jp"
											/>
										</div>
										<div>
											<label htmlFor="PurMail" className="block text-sm font-medium text-text-secondary mb-2 font-jp">
												メールアドレス
											</label>
											<input
												type="email"
												id="PurMail"
												name="Purmail"
												className="w-full px-4 py-3 bg-darker border border-accent/30 rounded-lg
                                                         text-text-primary placeholder-text-muted focus:border-gold
                                                         focus:outline-none transition-colors font-jp"
											/>
										</div>
										<div>
											<label htmlFor="PurTel" className="block text-sm font-medium text-text-secondary mb-2 font-jp">
												電話番号
											</label>
											<input
												type="text"
												id="PurTel"
												name="PurTel"
												className="w-full px-4 py-3 bg-darker border border-accent/30 rounded-lg
                                                         text-text-primary placeholder-text-muted focus:border-gold
                                                         focus:outline-none transition-colors font-jp"
											/>
										</div>
									</div>
								</div>
							)}

							{/* 支払い方法選択 */}
							{TestUser.name && (
								<div className="card-luxury p-8">
									<h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2 font-jp">
										<CreditCard size={24} className="text-gold"/>
										支払い方法選択
									</h3>

									<div className="space-y-4">
										<label
											className="flex items-center p-4 border border-accent/30 rounded-lg cursor-pointer hover:border-gold/50 transition-colors">
											<input
												type="radio"
												name="selectCredit"
												id="registed"
												checked={selCard === "registed"}
												onChange={HandleRadio}
												className="mr-3 accent-gold text-gold focus:ring-gold"
											/>
											<span className="text-text-primary font-jp">登録されたクレジットで支払う</span>
										</label>
										<label
											className="flex items-center p-4 border border-accent/30 rounded-lg cursor-pointer hover:border-gold/50 transition-colors">
											<input
												type="radio"
												name="selectCredit"
												id="new"
												checked={selCard === "new"}
												onChange={HandleRadio}
												className="mr-3 accent-gold text-gold focus:ring-gold"
											/>
											<span className="text-text-primary font-jp">新しくクレジット情報を入力する</span>
										</label>
									</div>
								</div>
							)}

							{/* クレジット情報 */}
							{selCard === "registed" ? (
								<div className="card-luxury p-8">
									<h3 className="text-xl font-bold text-text-primary mb-4 font-jp">登録済みクレジットカード</h3>
									<div className="bg-darker p-6 rounded-lg border border-accent/20">
										<div className="flex items-center gap-3 mb-2">
											<CreditCard size={20} className="text-gold"/>
											<span className="text-text-primary font-jp">登録済みカード情報</span>
										</div>
										<p className="text-text-muted font-jp">ここに登録済みのデータを表示</p>
									</div>
								</div>
							) : (
								<div className="card-luxury p-8">
									<h3 className="text-2xl font-bold text-text-primary mb-6 flex items-center gap-2 font-jp">
										<CreditCard size={24} className="text-gold"/>
										クレジット情報入力
									</h3>

									<div className="space-y-6">
										<div>
											<label htmlFor="method" className="block text-sm font-medium text-text-secondary mb-2 font-jp">
												決済方法
											</label>
											<input
												type="text"
												id="method"
												name="method"
												className="w-full px-4 py-3 bg-darker border border-accent/30 rounded-lg
                                                         text-text-primary placeholder-text-muted focus:border-gold
                                                         focus:outline-none transition-colors font-jp"
											/>
										</div>
										<div>
											<label htmlFor="cardNum" className="block text-sm font-medium text-text-secondary mb-2 font-jp">
												カード番号
											</label>
											<input
												type="text"
												id="cardNum"
												name="cardNum"
												className="w-full px-4 py-3 bg-darker border border-accent/30 rounded-lg
                                                         text-text-primary placeholder-text-muted focus:border-gold
                                                         focus:outline-none transition-colors font-jp"
											/>
										</div>
										<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
											<div>
												<label htmlFor="cardLim" className="block text-sm font-medium text-text-secondary mb-2 font-jp">
													カード有効期限
												</label>
												<input
													type="text"
													id="cardLim"
													name="cardlim"
													placeholder="MM/YY"
													className="w-full px-4 py-3 bg-darker border border-accent/30 rounded-lg
                                                             text-text-primary placeholder-text-muted focus:border-gold
                                                             focus:outline-none transition-colors font-jp"
												/>
											</div>
											<div>
												<label htmlFor="secCode" className="block text-sm font-medium text-text-secondary mb-2 font-jp">
													セキュリティコード
												</label>
												<input
													type="password"
													id="secCode"
													name="secCode"
													className="w-full px-4 py-3 bg-darker border border-accent/30 rounded-lg
                                                             text-text-primary placeholder-text-muted focus:border-gold
                                                             focus:outline-none transition-colors font-jp"
												/>
											</div>
										</div>
										<div>
											<label htmlFor="cardName" className="block text-sm font-medium text-text-secondary mb-2 font-jp">
												カード名義人
											</label>
											<input
												type="text"
												id="cardName"
												name="cardName"
												className="w-full px-4 py-3 bg-darker border border-accent/30 rounded-lg
                                                         text-text-primary placeholder-text-muted focus:border-gold
                                                         focus:outline-none transition-colors font-jp"
											/>
										</div>
										<label className="flex items-center gap-3 cursor-pointer">
											<input type="checkbox" id="toRegist" name="toRegist" className="text-gold focus:ring-gold"/>
											<span className="text-text-secondary font-jp">このクレジットカードを登録する</span>
										</label>
									</div>
								</div>
							)}
						</div>

						<div className="xl:col-span-1">
							<div className="card-luxury p-6 sticky top-32">
								<h3 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2 font-jp">
									<CheckCircle size={20} className="text-gold"/>
									注文確認
								</h3>

								{/* エラーメッセージ */}
								{error && (
									<div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6">
										<p className="text-red-400 font-jp">{error}</p>
									</div>
								)}

								{/* 決済金額 */}
								<div className="border-t border-accent/20 pt-4 mb-6">
									<div className="flex items-center justify-between">
										<span className="text-lg font-medium text-text-primary font-jp">決済金額</span>
										<span className="text-2xl font-bold text-gold font-playfair">
                      ¥{Number(totalPrice).toLocaleString()}
                    </span>
									</div>
								</div>

								{/* ナビゲーションボタン */}
								<div className="space-y-3">
									<button
										onClick={handlePayment}
										disabled={isLoading}
										className="w-full btn-luxury flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed font-jp"
									>
										{isLoading ? "処理中..." : "決済"}
									</button>

									<button
										onClick={handleBack}
										disabled={isLoading}
										className="w-full btn-outline-luxury flex items-center justify-center gap-2 font-jp"
									>
										<ArrowLeft size={18}/>
										券種選択に戻る
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>
		</div>
	)
}
