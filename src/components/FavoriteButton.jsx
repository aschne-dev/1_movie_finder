import useFavoriteToggle from "../utils/useFavoriteToggle";

/**
 * Heart icon button shared across cards and detail views.
 * Relies on the favorite toggle hook, stops event bubbling, and exposes a11y labels.
 */
const FavoriteButton = ({ movieId, className }) => {
  // STATE
  const { isFavorite, toggleFavorite, isProcessing } =
    useFavoriteToggle(movieId);

  // COMPORTEMENTS
  const handleClick = async (event) => {
    // Prevent parent click handlers from navigating while toggling
    event.stopPropagation();
    if (isProcessing) return;
    await toggleFavorite();
  };

  // RENDER
  return (
    <button
      type="button"
      className={`absolute right-6 top-6 cursor-pointer ${className ?? ""}`}
      onClick={handleClick}
      disabled={isProcessing}
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
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
    </button>
  );
};

export default FavoriteButton;
