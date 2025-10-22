import { useNavigate } from "react-router";
import FavoriteButton from "./FavoriteButton";
import { getPosterUrl } from "../utils/tmdb";
// Display a single movie entry with sensible fallbacks for incomplete data.
export default function MovieCard({
  movie: {
    id,
    title,
    vote_average,
    poster_path,
    release_date,
    original_language,
  },
}) {
  // STATE
  const navigate = useNavigate();

  // COMPORTEMENTS
  const handleCardClick = () => {
    navigate(`/movie/${id}`);
  };

  // RENDER
  return (
    <div className="movie-card relative">
      <FavoriteButton movieId={id} />
      {/* Use TMDB poster when available; fallback image prevents broken UI */}
      <div className="cursor-pointer" onClick={handleCardClick}>
        <img
          src={poster_path ? getPosterUrl(poster_path) : "/no-movie.png"}
          alt={title}
        />

        <div className="mt-4">
          <h3>{title}</h3>
          <div className="content">
            <div className="rating">
              <img src="star.svg" alt="Star Icon" />
              <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
            </div>

            {/* Language and release year stay visible even when rating is missing */}
            <span>•</span>
            <p className="lang">{original_language}</p>

            <span>•</span>
            <p className="year">
              {release_date ? release_date.split("-")[0] : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
