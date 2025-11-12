import Image from "next/image";
import Link from "next/link";
import { Play, Info, Calendar } from "lucide-react";
import type { MovieTLResponse } from "@/app/types/movie";

interface MovieCardProps {
  movie: MovieTLResponse;
  type?: "nowShowing" | "comingSoon";
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, type = "nowShowing" }) => {
  return (
    <div className="group">
      <div className="card-luxury p-0 overflow-hidden">
        
        {/* 映画ポスター */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={movie.poster_path || "/placeholder.svg"}
            alt={movie.title}
            fill
            className={`object-cover transition-all duration-500 ${
              type === "nowShowing"
                ? "group-hover:scale-110"
                : "grayscale group-hover:grayscale-0 group-hover:scale-110"
            }`}
          />

          {type === "comingSoon" && (
            <div className="absolute top-3 left-3 px-2 py-1 bg-gold text-darkest text-xs font-bold rounded font-playfair">
              COMING SOON
            </div>
          )}

          {/* ホバーオーバーレイ */}
          <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
            {type === "nowShowing" ? (
              <div className="flex flex-col items-center gap-3">
                <Link
                  href={`/movies/${movie.id}`}
                  className="w-12 h-12 bg-gold/20 hover:bg-gold/30 text-gold rounded-full flex items-center justify-center transition-colors"
                >
                  <Play size={20} />
                </Link>
                <Link
                  href={`/movies/${movie.id}`}
                  className="w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors"
                >
                  <Info size={20} />
                </Link>
              </div>
            ) : (
              <Link
                href={`/movies/${movie.id}`}
                className="w-12 h-12 bg-white/20 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-colors"
              >
                <Info size={20} />
              </Link>
            )}
          </div>
        </div>

        {/* 映画情報 */}
        <div className="p-4">
          <h3 className="font-medium text-text-primary mb-2 line-clamp-2 font-shippori font-jp">
            {movie.title}
          </h3>

          {type === "nowShowing" ? (
            <div className="flex items-center justify-between text-sm text-text-muted mb-3">
              <span className="font-shippori font-jp">{movie.genre}</span>
              <span className="font-shippori font-jp">{movie.duration}分</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-text-muted mb-3">
              <Calendar size={14} />
              <span className="font-playfair">{movie.release_date}</span>
            </div>
          )}

          {type === "nowShowing" && (
            <Link
              href={`/tickets/schedule/${movie.id}`}
              className="block w-full text-center py-2 bg-gold/10 hover:bg-gold/20 text-gold text-sm font-medium transition-colors rounded font-shippori font-jp"
            >
              チケット購入
            </Link>
          )}

          {type === "comingSoon" && (
            <p className="text-sm text-text-muted font-shippori font-jp">{movie.genre}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
