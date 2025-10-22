import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "./AuthContext";

/**
 * Share favorite toggle logic between cards and detail pages.
 * Handles login redirects, deduplicates concurrent clicks, and delegates to the context.
 */
const useFavoriteToggle = (movieId) => {
  const navigate = useNavigate();
  const { user, favorites, addFavorite, removeFavorite } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  // Normalize the ID once to avoid multiple String() conversions
  const normalizedId = useMemo(() => String(movieId), [movieId]);
  // Determine favorite state based on the derived favorites array from context
  const isFavorite = useMemo(
    () => favorites.includes(normalizedId),
    [favorites, normalizedId]
  );

  /**
   * Toggle favorite status, redirecting to login when needed and preventing double submissions.
   */
  const toggleFavorite = useCallback(async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    if (isProcessing) return;

    setIsProcessing(true);
    try {
      if (isFavorite) {
        await removeFavorite(normalizedId);
      } else {
        await addFavorite(normalizedId);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsProcessing(false);
    }
  }, [
    user,
    navigate,
    isProcessing,
    isFavorite,
    removeFavorite,
    normalizedId,
    addFavorite,
  ]);

  return { isFavorite, toggleFavorite, isProcessing };
};

export default useFavoriteToggle;
