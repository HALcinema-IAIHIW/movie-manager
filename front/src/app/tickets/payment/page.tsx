"use client"
import {use, useEffect, useState} from "react";
import {useRouter,useSearchParams} from "next/navigation";
import "./payment.css"

export default function payment() {

    // typesから送られてきたparamsの取得

    type SeatTicketForPayment = {
        seatId: string;
        roleId: string; // roleId を型に追加
        price: number;
        seatIdStr: string;
        ticketTypeName: string;
    }


    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false); // ★ ローディング状態
    const [error, setError] = useState<string | null>(null); // ★ エラーメッセージ状態


    const movieId=searchParams.get("movieId")
    const date = searchParams.get("date")
    const time = searchParams.get("time")
    const screeningId = searchParams.get("screeningId")
    const seatTicketsParam = searchParams.get("seatTickets");
    const parsedSeatTickets: SeatTicketForPayment[] = seatTicketsParam ? JSON.parse(seatTicketsParam) : [];


    const allRoleIds = parsedSeatTickets
        .map(ticket => ticket.roleId)
        .filter(Boolean) // null や undefined の roleId を取り除く
        .join(',');
    const screen=searchParams.get("screen")
    const seatTickets=searchParams.get("seatTickets")
    const totalPrice=searchParams.get("totalPrice")

    const TestUser = {
        name: "none",
        email: "test@test.com",
        password: "test",
        RoleName: "一般"
    }

    // ユーザー情報
    const [userId,setUserId] = useState('');

    const [authToken,setauthToken] = useState('');

    useEffect(() => {
        const getUserId = localStorage.getItem("userId")
        if(getUserId){
            setUserId(getUserId);
        }
    },[]);
    console.log(userId);
    useEffect(() => {
        const getauthToken = localStorage.getItem("token")
        if(getauthToken){
            setauthToken(getauthToken);
        }
    },[]);
    // console.log(authToken);




    // ラジオボタン処理
    const [selCard,setCard] = useState("new")
    // ユーザーが無い時は初期値をnewの方にしてほしいです
    const HandleRadio = (data:any) =>{
        setCard(data.target.id);
        console.log("Changed"+data.target.value)
    }

    const handlePayment = async () => {
        setIsLoading(true);
        setError(null);

        try {
            // --- 1. localStorageから認証情報を取得 ---
            // ページを開いたときにuseEffectで取得するようにしました

            // 認証情報がない場合は処理を中断
            if (!userId || !authToken) {
                throw new Error('ログイン情報が見つかりません。再度ログインしてください。');
            }

            // --- 2. /purchases/ へのリクエストボディを生成 ---
            const roleCounts = parsedSeatTickets.reduce((acc, ticket) => {
                const roleId = Number(ticket.roleId);
                if (!roleId) return acc;
                acc[roleId] = (acc[roleId] || 0) + 1;
                return acc;
            }, {} as Record<number, number>);

            const purchaseDetails = Object.entries(roleCounts).map(([role_id, quantity]) => ({
                role_id: Number(role_id),
                quantity,
            }));

            const purchaseRequestBody = {
                user_id: Number(userId), // ★ localStorageから取得したuserIdを使用
                screening_id: Number(screeningId),
                purchase_time: new Date().toISOString(),
                purchase_details: purchaseDetails,
            };

            console.log("Sending to /purchases/:", JSON.stringify(purchaseRequestBody, null, 2));


            // --- 3. /purchases/ へのAPIリクエストを送信 (認証ヘッダー付き) ---
            const purchaseResponse = await fetch('http://localhost:8080/purchases/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}`, // ★ 認証トークンをヘッダーに追加
                },
                body: JSON.stringify(purchaseRequestBody),
            });

            if (!purchaseResponse.ok) {
                // エラーレスポンスの本文をテキストとして読み込む試み
                const errorText = await purchaseResponse.text();
                try {
                    // JSONとしてパースできればパースする
                    const errorData = JSON.parse(errorText);
                    throw new Error(errorData.message || '購入情報の作成に失敗しました。');
                } catch {
                    // パースできなければテキストをそのまま表示
                    throw new Error(errorText || '購入情報の作成に失敗しました。');
                }
            }

            const purchaseResult = await purchaseResponse.json();
            const purchaseId = purchaseResult.PurchaseID;

            if (!purchaseId) {
                throw new Error('レスポンスから購入IDが取得できませんでした。');
            }

            console.log("Purchase successful. Purchase ID:", purchaseId);


            // --- 4. /reservationseats へのリクエストを送信 (認証ヘッダー付き) ---
            const reservationPromises = parsedSeatTickets.map(ticket => {
                const reservationRequestBody = {
                    purchase_id: purchaseId,
                    seat_id: Number(ticket.seatId),
                };

                return fetch('http://localhost:8080/reservationseats/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${authToken}`, // ★ 認証トークンをヘッダーに追加
                    },
                    body: JSON.stringify(reservationRequestBody),
                });
            });

            const reservationResponses = await Promise.all(reservationPromises);

            for (const res of reservationResponses) {
                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(errorText || '座席の予約に失敗しました。');
                }
            }

            console.log("All seats reserved successfully.");

            // --- 5. 成功した場合、完了ページに遷移 ---
            sessionStorage.removeItem("seatSelection");

            const params = new URLSearchParams()
            params.set("date",date || "")
            params.set("time",time || "")
            params.set("totalPrice",totalPrice || "")
            params.set("screen",screen || "")
            params.set("seatTickets",seatTickets || "")

            router.push(`/tickets/completed?${params.toString()}`);

        } catch (err: any) {
            console.error("Payment failed:", err);
            setError(err.message || '決済処理中に予期せぬエラーが発生しました。');
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        // typesに必要な情報はsessionStrageにあるのでそのまま遷移で問題なさそう？
        // 後でなんか起きたら怖いかも
        router.push(`/tickets/types?`)
    }
    return(
        <div id={"payment"}>
            <h1 className={"text-3xl "}>お支払方法選択</h1><br/>
            {userId}/
            {movieId}/
            {date}/
            {time}/
            {screen}/
            roleId:{allRoleIds}/
            {totalPrice}/
            {screeningId}
            {!userId && (
                <div id={"inputPurchaser"}>
                    {/*  ログインしていない場合  */}

                    <h2>購入者情報入力</h2>
                    <hr/>
                    <form action="#" id={"Purchaser"}>
                        <label htmlFor="PurName" className={"payLabel"}>氏名</label>
                        <input type="text" className={"payInput"} id={"PurName"} name={"PurName"}/><br/>
                        <label htmlFor="PurMail" className={"payLabel"}>メールアドレス</label>
                        <input type="email" className={"payInput"} id={"PurMail"} name={"Purmail"}/><br/>
                        <label htmlFor="PurTel" className={"payLabel"}>電話番号</label>
                        <input type="text" className={"payInput"} id={"PurTel"} name={"PurTel"}/>
                    </form>
                </div>
            )}

            {/*会員の場合この範囲を表示*/}
            {userId && (
                <div id={"userRadio"} className={"mb-10"}>
                    <div className={"flex w-3/4 mx-auto"}>
                        <input type="radio" name={"selectCredit"} id={"registed"} className={"mr-2"}
                               checked={selCard === "registed"} onChange={HandleRadio}/>登録されたクレジットで支払う
                    </div>
                    <div className={"flex w-3/4 mx-auto"}>
                        <input type={"radio"} name={"selectCredit"} id={"new"} className={"mr-2"}
                               checked={selCard === "new"} onChange={HandleRadio}/>新しくクレジット情報を入力する
                    </div>
                </div>
            )}

            {/*  会員表示ここまで */}

            {selCard === "registed" ? (
                // 登録済みを使うとき
                <div id={"viewCredit"}>
                    <div className={"bg-gray-500 p-1.5 mb-5"}>
                        ここに登録済みのデータを表示
                    </div>

                </div>
            ) : (
                <div id={"inputCredit"}>
                    {/*    クレジット情報を入力*/}

                    <h2>クレジット情報入力</h2>
                    <hr/>
                    <form action="#" className={"mb-5"}>
                        <label htmlFor="method" className={"payLabel"}>決済方法</label>
                        <input type="text" className={"payInput"} id={"method"} name={"method"}/><br/>
                        <label htmlFor="cardNum" className={"payLabel"}>カード番号</label>
                        <input type="text" className={"payInput"} id={"cardNum"} name={"cardNum"}/><br/>
                        <label htmlFor="cardLim" className={"payLabel"}>カード有効期限</label>
                        <input type="text" className={"payInput"} id={"cardLim"} name={"cardlim"}/><br/>
                        <label htmlFor="secCode" className={"payLabel"}>セキュリティコード</label>
                        <input type="password" className={"payInput"} id={"secCode"} name={"secCode"}/><br/>
                        <label htmlFor="cardName" className={"payLabel"}>カード名義人</label>
                        <input type="text" className={"payInput"} id={"cardName"} name={"cardName"}/><br/>
                        <input type="checkbox" id={"toRegist"} name={"toRegist"}/>
                        このクレジットカードを登録する
                    </form>


                </div>
            )

            }
            <div id={"decision"} className={"flex flex-col"}>
                {/* ★ エラーメッセージの表示 */}
                {error && <p className="text-red-500 mb-4">{error}</p>}

                <h3 id={"price"} className={"w-3/4 mx-auto"}>決済金額:<span>¥{Number(totalPrice).toLocaleString()}</span></h3>
                <div id={"decisionButtons"}  className={"w-full flex flex-row justify-between align-items-center gap-80"}>
                <button
                    onClick={handleBack}
                    disabled={isLoading}
                    className={"w-50 bg-dark-lighter flex items-center justify-center gap-2 py-3 px-4 border border-accent/30text-text-secondary hover:text-text-primary hover:border-accent/50 rounded-lg transition-all duration-300 font-jp"}
                >
                券種選択に戻る
                </button>

                {/* ★ 決済ボタンにonClickとdisabledを追加 */}
                <button
                    onClick={handlePayment}
                    disabled={isLoading}
                    className={"w-100 flex items-center justify-center gap-2 py-3 px-4 bg-gradient-to-r from-gold to-gold-light text-darkest hover:shadow-gold-glow rounded-lg font-medium transition-all duration-300 font-jp disabled:opacity-50 disabled:cursor-not-allowed"}
                >
                    {isLoading ? '処理中...' : '決済'}
                </button>
            </div>


            </div>

        </div>
    )
};

