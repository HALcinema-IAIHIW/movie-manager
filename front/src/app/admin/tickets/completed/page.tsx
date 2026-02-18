"use client"
import {useState, useEffect, Suspense} from "react";
import {useSearchParams} from "next/navigation";
import Link from "next/link";
import {QrCode} from "lucide-react";
import { buildReceiptPdf, buildTicketPdf } from "@/lib/pdf";
import "./admincompleted.css"

type SeatTicketParam = {
    seatId: string
    seatIdStr: string // 表示用 (例: A1)
    ticketTypeName: string
    price: number
}

function CompletedContent() {
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

    const buildPdfData = () => {
        const totalNumber = totalPrice ? Number(totalPrice) : undefined;
        const normalizedTotal =
            typeof totalNumber === "number" && Number.isFinite(totalNumber) ? totalNumber : undefined;

        return {
            screen: screen ?? "",
            movieTitle,
            date: date ?? "",
            time: time ?? "",
            seatTickets: ticketDec,
            totalPrice: normalizedTotal,
        };
    };

    const openPdfInNewTab = async (builder: () => Promise<Uint8Array>) => {
        const newTab = window.open("", "_blank");
        if (!newTab) {
            alert("ポップアップがブロックされました。ブラウザ設定を確認してください。");
            return;
        }

        if (newTab.opener) {
            newTab.opener = null;
        }

        newTab.document.write("<p style=\"font-family: sans-serif;\">PDFを生成中...</p>");
        newTab.document.close();

        try {
            const pdfBytes = await builder();
            const blob = new Blob([pdfBytes], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            newTab.location.href = url;
            window.setTimeout(() => URL.revokeObjectURL(url), 60000);
        } catch (err) {
            console.error("PDF生成に失敗:", err);
            newTab.document.body.innerText = "PDFの生成に失敗しました。";
        }
    };

    const handleTicketPdf = () => openPdfInNewTab(() => buildTicketPdf(buildPdfData()));
    const handleReceiptPdf = () => openPdfInNewTab(() => buildReceiptPdf(buildPdfData()));

    return(
        <div id={"completedMain"} className={"flex flex-col mt-32 items-center justify-center"}>
            <h1 className={"text-4xl mb-6 font-semibold tracking-wide"}>購入完了</h1>


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

                            {ticketDec.map(ticket => (
                                <div key={ticket.seatId} className={"flex flex-row flex-nowrap justify-end"}>
                                    <p className={"w-12"}>{ticket.seatId}</p>
                                    <p className={"w-28 mr-5"}>{ticket.ticketTypeName}</p>
                                    <p>{ticket.price} 円</p>
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
            <div id={"pdf"} className={"flex flex-row gap-20 mb-10"}>
                <button
                    type={"button"}
                    onClick={handleTicketPdf}
                    className={"py-3 px-4 rounded-lg border-2 border-dark-lighter bg-gold text-dark hover:shadow-accent"}
                >
                    チケット発券
                </button>
                <button
                    type={"button"}
                    onClick={handleReceiptPdf}
                    className={"py-3 px-4 rounded-lg border-2 border-dark-lighter bg-gold text-dark hover:shadow-white"}
                >
                    領収書発行
                </button>
            </div>
            <Link className={"bg-dark-lighter py-3 px-4 rounded-lg text-gold border-2 border-gold hover:scale-90 transition-all "}
                  href={"../tickets/schedule"}>上映回選択に戻る</Link>
        </div>
    )
}

export default function AdminCompleted() {
    return (
        <Suspense fallback={<div className="mt-32 text-center text-white">読み込み中...</div>}>
            <CompletedContent />
        </Suspense>
    );
}
