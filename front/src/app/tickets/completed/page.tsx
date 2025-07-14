"use client"
import {useState} from "react";
import {useRouter,useSearchParams} from "next/navigation";
import Link from "next/link";
import "./payCompleted.css"

export default function completed() {
    const searchParams = new URLSearchParams
    const date = searchParams.get("date")
    const time = searchParams.get("time")
    const totalPrice = searchParams.get("totalPrice")
    const screen = searchParams.get("screen")
    const seatTickets = searchParams.get("seatTickets")

    return(
        <div id={"completedMain"} className={"flex flex-col mt-32 items-center justify-center"}>

            <h1 className={"text-4xl mb-5"}>購入完了</h1>
            <h2 className={"text-2xl mb-10"}>ご購入ありがとうございました</h2>

            <div id={"showDetail"} className={"bg-gray-500 w-3/4 p-5 mb-5"}>
                <div id={"admission"} className={"mb-3"}>
                    <h2 className={"text-2xl mb-2"}>チケットを発券して入場</h2>
                    <p className={" block bg-gray-700 w-20 tracking-widest text-lg text-center"}>12345</p>
                </div>
                <h3 className={"text-xl mb-5"}>購入情報</h3>
                <table id={"payList"} className={"bg-gray-300 mx-auto mb-5"}>
                    <tbody>
                        <tr>
                            <th scope="row">
                                スクリーン
                            </th>
                            <td>
                                {screen}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                作品名
                            </th>
                            <td>
                                作品
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                日時
                            </th>
                            <td>
                                {date}<br/>
                                {time}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">
                                座席
                            </th>
                            <td>
                                {seatTickets}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p className={"text-right text-lg"}>合計金額:{totalPrice}</p>
            </div>
            <p className={"mb-5"}>マイページでもご確認いただけます</p>
            <Link className={"bg-gold py-3 px-4 rounded-lg text-darkest hover:scale-90 transition-all "} href={"../mypage"}>マイページ</Link>

        </div>
    )
}