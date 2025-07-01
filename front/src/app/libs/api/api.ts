import { MovieTLProps } from "@/app/types/schedule";
import { parse, format } from "date-fns";

export async function fetchScreeningsByDate(input: string): Promise<MovieTLProps[]> {
// backでは'YYYY-MM-DD'形式で処理しているためこの加工処理が必用
// "0701" → "2025-07-01" に変換（必要に応じて切り替え）
    let formattedDate: string;
    try {
        if (/^\d{4}-\d{2}-\d{2}$/.test(input)) {
            // すでに "2025-07-01" 形式ならそのまま
            formattedDate = input;
        } else if (/^\d{4}$/.test(input)) {
            // "0701" → "2025-07-01"
            const year = new Date().getFullYear();
            const parsed = parse(`${year}${input}`, "yyyyMMdd", new Date());
            formattedDate = format(parsed, "yyyy-MM-dd");
        } else {
            throw new Error("日付形式が不正です（例: '0701' または 'YYYY-MM-DD'）");
        }
    } catch (err) {
        console.error("日付変換エラー:", err);
        throw err;
    }

    const res = await fetch(`http://localhost:8080/screenings?date=${formattedDate}`, {
    method: "GET",
})

    if (!res.ok) {
        throw new Error(`データ取得に失敗: ${res.status}`)
    }
    const data = await res.json();
    console.log("取得データ", data);
    return data
}