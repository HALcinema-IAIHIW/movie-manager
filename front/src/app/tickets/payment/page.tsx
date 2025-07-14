"use client"
import { useState} from "react";
import {useRouter,useSearchParams} from "next/navigation";
import "./payment.css"

export default function payment() {

    // typesから送られてきたparamsの取得

    const router = useRouter();
    const searchParams = useSearchParams();


    const movieId=searchParams.get("movieId")
    const date = searchParams.get("date")
    const time = searchParams.get("time")
    const screen=searchParams.get("screen")
    const seatTickets=searchParams.get("seatTickets")
    const totalPrice=searchParams.get("totalPrice")

    


    const TestUser = {
        name: "none",
        email: "test@test.com",
        password: "test",
        RoleName: "一般"
    }

    // ラジオボタン処理
    const [selCard,setCard] = useState("new")
    // ユーザーが無い時は初期値をnewの方にしてほしいです
    const HandleRadio = (data:any) =>{
        setCard(data.target.id);
        console.log("Changed"+data.target.value)
    }

    // 次ページに送る
    const HandleComplete = () => {
        const params = new URLSearchParams()
        params.set("movieId","movieId")
        params.set("totalPrice",totalPrice || "")
        params.set("time",time || "")
        params.set("date",date || "")
        params.set("screen",screen || "")
        params.set("seatTickets",seatTickets || "")


        router.push(`/tickets/payment?${params.toString()}`)

    }

    return(
        <div id={"payment"}>
            <h1 className={"text-3xl "}>お支払方法選択</h1><br/>
            {TestUser.name}
            {movieId}
            {time}
            {date}
            {seatTickets}
            {totalPrice}
            {screen}
            {!TestUser.name && (
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
            {TestUser.name && (
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
            <div id={"decision"}>
                <h3 id={"price"}>決済金額:<span>{totalPrice}</span></h3>
                <button className={"w-100 flex items-center justify-center gap-2 py-3 px-4\n" +
                    "                      bg-gradient-to-r from-gold to-gold-light text-darkest hover:shadow-gold-glow\n" +
                    "                      rounded-lg font-medium transition-all duration-300 font-jp"}>
                    決済
                </button>
            </div>

        </div>
    )
};

