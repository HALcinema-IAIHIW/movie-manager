export type ShowingInfo = {
  screening_id: number;
  start_time: string;
  end_time: string;
  date: string;
};

export type MovieTLProps = {
  movie_id: number;
  title: string;
  screen_id: number;
  date: string;
  showings: ShowingInfo[];
};

// 将来的にrestSeatを復活させる