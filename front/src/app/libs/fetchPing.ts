export async function fetchPing(): Promise<string> {
    const res = await fetch("http://localhost:8080/api/ping")

    if (!res.ok) throw new Error("API fetch failed")

    const data = await res.json()
    return data.message // "pong" が返る
}