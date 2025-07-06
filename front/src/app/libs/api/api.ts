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



export async function fetchScreeningById(screeningId: string): Promise<Screening> {
  if (!screeningId) throw new Error("screeningIdが指定されていません");

  const res = await fetch(`http://localhost:8080/screenings/${screeningId}`, {
    method: "GET",
  });

  if (!res.ok) throw new Error(`上映情報の取得に失敗しました: ${res.status}`);

  const data = await res.json();

  return {
    id: data.id,
    screeningPeriodId: data.screeningPeriodId,
    date: data.date,
    startTime: data.startTime,
    duration: data.duration,
    movie: {
      id: data.movie.id.toString(),
      title: data.movie.title,
      description: data.movie.description,
      releaseDate: data.movie.releaseDate,
      genre: data.movie.genre,
      director: data.movie.director,
      posterPath: data.movie.posterPath,
      duration: data.movie.duration,
    },
    screen: {
      id: data.screen.id.toString(),
      maxRow: data.screen.maxRow,
      maxColumn: data.screen.maxColumn,
    },
  };
}
