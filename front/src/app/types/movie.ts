export interface ShowingInfo {
  screening_id: number
  start_time: string
  end_time: string
}

export interface MovieTLResponse {
  id: number
  title: string
  subtitle: string
  description: string
  release_date: string
  genre: string
  director?: string
  cast: string[]
  duration?: number
  poster_path?: string
}
