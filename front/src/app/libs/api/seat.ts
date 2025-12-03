export const getSeatsByScreenId = async (screenId: number)=> {
  const res = await fetch(`http://localhost:8080/seats/by-screen/${screenId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })

  if (!res.ok) {
    throw new Error("座席データの取得に失敗しました")
  }

  return res.json()
}