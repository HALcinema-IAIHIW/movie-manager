"use client"
import {useState, useEffect} from "react";
import {useSearchParams} from "next/navigation";
import Link from "next/link";
import "./payCompleted.css"
import {QrCode} from "lucide-react";

type SeatTicketParam = {
    seatId: string
    seatIdStr: string // 表示用 (例: A1)
    ticketTypeName: string
    price: number
}

export default function Completed() {
    const searchParams = useSearchParams();

    // パラメータ取得
    const movieId = searchParams.get("movieId");
    const date = searchParams.get("date");
    const time = searchParams.get("time");
    const totalPrice = searchParams.get("totalPrice");
    const screen = searchParams.get("screen");
    const seatTicketsStr = searchParams.get("seatTickets");

    const ticketDec: SeatTicketParam[] = seatTicketsStr ? JSON.parse(seatTicketsStr) : [];

    // 映画タイトルを管理するState
    const [movieTitle, setMovieTitle] = useState("読み込み中...");

    // 映画情報を取得する
    useEffect(() => {
        if (movieId) {
            fetch(`http://localhost:8080/movies/${movieId}`)
                .then(res => res.json())
                .then(data => {
                    setMovieTitle(data.title);
                })
                .catch(err => {
                    console.error("映画情報の取得に失敗:", err);
                    setMovieTitle("不明な作品");
                });
        }
    }, [movieId]);

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
                            {movieTitle}
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
                            {ticketDec.map((ticket, index) => (
                                <div key={index} className={"flex flex-row flex-nowrap justify-end gap-4"}>
                                    {/* DB ID(seatId)ではなく、表示用(seatIdStr)を使用 */}
                                    <p className={"w-12 text-center"}>{ticket.seatIdStr || ticket.seatId}</p>
                                    <p className={"w-28"}>{ticket.ticketTypeName}</p>
                                    <p>{ticket.price.toLocaleString()} 円</p>
                                </div>
                            ))}
                        </td>
                    </tr>
                    </tbody>
                </table>
                <p className={"text-base text-center mb-10"}>合計金額 :
                    <span className={"text-xl mx-2.5"}>{Number(totalPrice).toLocaleString()}</span> 円
                </p>
            </div>
            <p className={"mb-5"}>マイページでもご確認いただけます</p>
            <Link className={"bg-gold py-3 px-4 rounded-lg text-darkest hover:scale-90 transition-all "}
                  href={"../mypage"}>マイページ</Link>
        </div>
    )
}