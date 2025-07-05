export type CreateSeatRequest = {
  screen_id: number
  row: string
  column: number
}

export async function createSeat(seat: CreateSeatRequest): Promise<void> {
  const res = await fetch("http://localhost:8080/seats/", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(seat),
  })

  if (!res.ok) {
    throw new Error(`座席の作成に失敗しました: ${res.statusText}`)
  }
}
