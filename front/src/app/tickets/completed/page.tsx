"use client"
import {useState} from "react";
import {useRouter,useSearchParams} from "next/navigation";
import Link from "next/link";
import "./payCompleted.css"
import {Calendar, Clock, Info, MapPin, QrCode,CircleX} from "lucide-react";
import Image from "next/image";

export default function completed() {
    const searchParams = useSearchParams();
    const date = searchParams.get("date")
    const time = searchParams.get("time")
    const totalPrice = searchParams.get("totalPrice")
    const screen = searchParams.get("screen")
    const seatTickets = (searchParams.get("seatTickets"))

    var ticketDec =JSON.parse(seatTickets);
    console.log(ticketDec)


    return(
        <div id={"completedMain"} className={"flex flex-col mt-32 items-center justify-center"}>

            <h1 className={"text-4xl mb-6 font-semibold tracking-wide"}>購入手続きが完了しました</h1>
            <h2 className={"text-2xl mb-16"}>ご購入ありがとうございました</h2>

            <div id={"toEnter"} className={"bg-dark-lighter w-3/4 p-5 mb-8"}>
                <h2 className={"text-2xl mb-5 text-gold font-semibold tracking-wide"}>入場方法</h2>
                <div id={"admission-number"} className={"mb-5 w-3/4 flex justify-between mx-auto"}>
                    <h2 className={"text-xl mb-2"}>チケットを発券して入場</h2>
                    <p className={" block bg-gray-700 px-6 py-3 tracking-widest text-lg  text-center text-gold"}>12345</p>
                </div>

                <div id={"admission-qr"} className={"mb-3 w-3/4 flex justify-between mx-auto"}>
                    <h2 className={"text-xl mb-2"}>QRコードで入場</h2>
                    <button className="btn-outline-luxury flex items-center justify-center gap-2 font-jp">
                        <QrCode size={18}/>
                        QRコード
                    </button>
                </div>
            </div>

            <div id={"showDetail"} className={"bg-dark-lighter w-3/4 p-5 mb-5"}>
                <h3 className={"text-2xl mb-5 text-gold font-semibold tracking-wide"}>購入情報</h3>
                <table id={"payList"} className={" mx-auto mb-10"}>
                    <tbody>
                    <tr className={"border-accent/30 border-b"}>
                        <th scope="row">
                            スクリーン
                        </th>
                        <td>
                            {screen}
                        </td>
                    </tr>
                    <tr className={"border-accent/30 border-b"}>
                        <th scope="row">
                            作品名
                        </th>
                        <td>
                            作品
                        </td>
                    </tr>
                    <tr className={"border-accent/30 border-b"}>
                        <th scope="row">
                            日時
                        </th>
                        <td>
                            {date}<br/>
                            {time}~
                        </td>
                    </tr>
                    <tr className={"border-accent/30 border-b"}>
                        <th scope="row">
                            座席
                        </th>
                        <td>
                            {ticketDec.map(ticket => (
                                <div key={ticket.seatId} className={"flex flex-row flex-nowrap justify-end"}>
                                    <p className={"w-12　"}>{ticket.seatId}</p>
                                    <p className={"w-28 mr-5"}>{ticket.ticketTypeName}</p>
                                    <p>{ticket.price} 円</p>


                                </div>
                            ))}
                            {/*<div className={"flex flex-row flex-nowrap"}> 文字数確認用*/}
                            {/*    <p className={"w-12"}>H2</p>*/}
                            {/*    <p className={"w-28"}>小学生、幼児</p>*/}
                            {/*    <p>1000 円</p>*/}
                            {/*</div>*/}
                        </td>
                    </tr>
                    </tbody>
                </table>
                <p className={"text-base text-center mb-10"}>合計金額 :<span
                    className={"text-xl mx-2.5"}>{totalPrice}</span> 円</p>
            </div>
            <p className={"mb-5"}>マイページでもご確認いただけます</p>
            <Link className={"bg-gold py-3 px-4 rounded-lg text-darkest hover:scale-90 transition-all "}
                  href={"../mypage"}>マイページ</Link>




        </div>
    )
}