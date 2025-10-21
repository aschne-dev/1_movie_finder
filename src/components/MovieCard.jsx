import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../utils/AuthContext";
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
  const { user, addFavorite, removeFavorite, favorites } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);

  // COMPORTEMENTS
  const handleCardClick = () => {
    navigate(`/movie/${id}`);
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      alert("You need to be logged in");
      return;
    }

    try {
      if (isFavorite) {
        await removeFavorite(id);
      } else {
        await addFavorite(id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setIsFavorite(favorites.includes(String(id)));
  }, [favorites, id]);

  // RENDER
  return (
    <div className="movie-card relative">
      <div
        className="absolute right-6 top-6 cursor-pointer"
        onClick={handleToggleFavorite}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="32px"
          viewBox="0 -960 960 960"
          width="32px"
          className={isFavorite ? "fill-yellow-400" : "fill-white"}
        >
          <path d="m480-120-58-52q-101-91-167-157T150-447.5Q111-500 95.5-544T80-634q0-94 63-157t157-63q52 0 99 22t81 62q34-40 81-62t99-22q94 0 157 63t63 157q0 46-15.5 90T810-447.5Q771-395 705-329T538-172l-58 52Zm0-108q96-86 158-147.5t98-107q36-45.5 50-81t14-70.5q0-60-40-100t-100-40q-47 0-87 26.5T518-680h-76q-15-41-55-67.5T300-774q-60 0-100 40t-40 100q0 35 14 70.5t50 81q36 45.5 98 107T480-228Zm0-273Z" />
        </svg>
      </div>
      {/* Use TMDB poster when available; fallback image prevents broken UI */}
      <div className="cursor-pointer" onClick={handleCardClick}>
        <img
          src={
            poster_path
              ? `https://image.tmdb.org/t/p/w500/${poster_path}`
              : "/no-movie.png"
          }
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
