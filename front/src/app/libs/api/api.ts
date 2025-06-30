export async function fetchScreeningsByDate(date: string) {
    const res = await fetch('screenings/daily?date=${date}')

    if (!res.ok) {
        throw new Error(`データ取得に失敗: ${res.status}`)
    }

    return await res.json();
}