// Centralise TMDB configuration so headers stay consistent across requests
const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const buildEndpoint = (query) =>
  query
    ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
    : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

// Shared TMDB fetcher used by screens to keep network logic consistent.
export const fetchMovies = async (query = "") => {
  const endpoint = buildEndpoint(query);
  const response = await fetch(endpoint, API_OPTIONS);
  let data;

  try {
    data = await response.json();
  } catch (error) {
    throw new Error("TMDB response could not be parsed." + error);
  }

  if (!response.ok) {
    const message =
      data?.status_message ||
      `TMDB request failed (${response.status} ${response.statusText})`;
    throw new Error(message);
  }

  if (data.Response === "False") {
    throw new Error(data.Error || "TMDB returned an error response.");
  }

  return Array.isArray(data.results) ? data.results : [];
};

export const getPosterUrl = (posterPath, size = "w500") =>
  posterPath ? `https://image.tmdb.org/t/p/${size}/${posterPath}` : null;

// Retrieve a fully fledged movie record, raising surfaced API errors when needed
export const getMovieDetail = async (movieId) => {
  if (!movieId) {
    throw new Error("A movie identifier is required.");
  }

  const endpoint = `${API_BASE_URL}/movie/${movieId}`;
  const response = await fetch(endpoint, API_OPTIONS);
  let data;

  try {
    data = await response.json();
  } catch (error) {
    throw new Error(`TMDB response could not be parsed. ${error}`);
  }

  if (!response.ok) {
    const message =
      data?.status_message ||
      `TMDB request failed (${response.status} ${response.statusText})`;
    throw new Error(message);
  }

  return data;
};

// Ask TMDB for recommended titles and return the original payload upstream
export const getMovieRecommendations = async (movieId) => {
  if (!movieId) {
    throw new Error("A movie identifier is required.");
  }

  const endpoint = `${API_BASE_URL}/movie/${movieId}/recommendations?language=en-US&page=1`;
  const response = await fetch(endpoint, API_OPTIONS);

  let data;

  try {
    data = await response.json();
  } catch (error) {
    throw new Error(`TMDB response could not be parsed. ${error}`);
  }

  if (!response.ok) {
    const message =
      data?.status_message ||
      `TMDB request failed (${response.status} ${response.statusText})`;
    throw new Error(message);
  }

  return data.results;
};
