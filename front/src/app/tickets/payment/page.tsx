"use client"
// import {useState,useEffect} from "react";
import {useRouter,useSearchParams} from "next/navigation";
import "./payment.css"


export default function payment() {
    // typesから送られてきたparamsの取得
    const router = useRouter();
    const searchParams = useSearchParams();

    const movieId = searchParams.get("movieId")
    const date = searchParams.get("date")
    const time = searchParams.get("time")
    const screen = searchParams.get("screen")
    const seatTickets = searchParams.get("seatTickets")
    const totalPrice = searchParams.get("totalPrice")

    return(
        <div id={"payment"}>
            {movieId}
            {date}
            {time}
            {screen}
            {seatTickets}
            {totalPrice}
            <div id={"inputPurchaser"}>
            {/*  ログインしていない場合  */}
                <h2>購入者情報入力</h2>
                <hr/>
                <form action="#" id={"Purchaser"}>
                    <label htmlFor="PurName">氏名</label>
                    <input type="text" id={"PurName"} name={"PurName"}/><br/>
                    <label htmlFor="PurMail">メールアドレス</label>
                    <input type="email" id={"PurMail"} name={"Purmail"}/><br/>
                    <label htmlFor="PurTel">電話番号</label>
                    <input type="text" id={"PurTel"} name={"PurTel"}/>
                </form>
            </div>
            {/*会員の場合この範囲を表示*/}
            <div className={"flex w-3/4 mx-auto"}>
                <input type="radio" name={"selectCredit"} id={"registed"} className={"mr-2"}/>登録されたクレジットで支払う
            </div>
            <div className={"flex w-3/4 mx-auto"}>
                <input type={"radio"} name={"selectCredit"} id={"new"} className={"mr-2"}/>新しくクレジット情報を入力する
            </div>
            {/*  会員表示ここまで */}
            <div id={"inputCredit"}>
                {/*    クレジット情報を入力*/}

                <h2>クレジット情報入力</h2>
                <hr/>
                <h3>決済金額:<span>{totalPrice}</span></h3>
                <form action="#" className={"mb-5"}>
                    <label htmlFor="method">決済方法</label>
                    <input type="text" id={"method"} name={"method"}/><br/>
                    <label htmlFor="cardNum">カード番号</label>
                    <input type="text" id={"cardNum"} name={"cardNum"}/><br/>
                    <label htmlFor="cardLim">カード有効期限</label>
                    <input type="text" id={"cardLim"} name={"cardlim"}/><br/>
                    <label htmlFor="secCode">セキュリティコード</label>
                    <input type="password" id={"secCode"} name={"secCode"}/><br/>
                    <label htmlFor="cardName">カード名義人</label>
                    <input type="text" id={"cardName"} name={"cardName"}/><br/>
                    <input type="checkbox" id={"toRegist"} name={"toRegist"}/>
                    このクレジットカードを登録する
                </form>
                <button　className={"w-100 flex items-center justify-center gap-2 py-3 px-4\n" +
                    "                      bg-gradient-to-r from-gold to-gold-light text-darkest hover:shadow-gold-glow\n" +
                    "                      rounded-lg font-medium transition-all duration-300 font-jp"}>
                    決済</button>
            </div>
        </div>
    )
};

