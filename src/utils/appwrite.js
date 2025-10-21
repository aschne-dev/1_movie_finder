import { Account, Client, ID, Query, TablesDB } from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DATABASE_ID = import.meta.env.VITE_APPWRITE_DATABSE_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_TABLE_NAME;
const FAVORITES_TABLE_ID =
  import.meta.env.VITE_APPWRITE_FAVORITES_TABLE_NAME ?? "favorites";

// Shared Appwrite client powering account and tables interactions
const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(PROJECT_ID);

const tables = new TablesDB(client);
export const account = new Account(client);

export const updateSearchCount = async (searchTerm, movie) => {
  // Track how often each search term is used by updating TablesDB rows
  try {
    const result = await tables.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      queries: [Query.equal("searchTerm", searchTerm)],
    });

    // 2. If it does, update the count
    if (result.rows.length > 0) {
      const row = result.rows[0];

      await tables.updateRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: row.$id,
        data: {
          count: row.count + 1,
        },
      });
      // 3. If it doesn't, create a new row with the search term and count as 1
    } else {
      await tables.createRow({
        databaseId: DATABASE_ID,
        tableId: TABLE_ID,
        rowId: ID.unique(),
        data: {
          searchTerm,
          count: 1,
          movie_id: movie.id,
          poster_url: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
            : null,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getTrendingMovies = async () => {
  try {
    // Fetch top searches ordered by popularity to drive the carousel
    const result = await tables.listRows({
      databaseId: DATABASE_ID,
      tableId: TABLE_ID,
      queries: [Query.limit(5), Query.orderDesc("count")],
    });

    return result.rows;
  } catch (error) {
    console.log(error);
  }
};

export const addAppwriteFavorite = async (userId, movieId) => {
  if (!userId || !movieId) {
    throw new Error("userId and movie.id are required to store a favorite");
  }

  const normalizedUserId = String(userId);
  const normalizedMovieId = String(movieId);

  try {
    const existing = await tables.listRows({
      databaseId: DATABASE_ID,
      tableId: FAVORITES_TABLE_ID,
      queries: [
        Query.equal("user_id", normalizedUserId),
        Query.equal("movie_id", normalizedMovieId),
        Query.limit(1),
      ],
    });

    if (existing.rows.length > 0) {
      return String(existing.rows[0].movie_id);
    }

    const payload = {
      user_id: normalizedUserId,
      movie_id: normalizedMovieId,
    };

    await tables.createRow({
      databaseId: DATABASE_ID,
      tableId: FAVORITES_TABLE_ID,
      rowId: ID.unique(),
      data: payload,
    });

    //return normalizedMovieId;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const removeAppwriteFavorite = async (userId, movieId) => {
  if (!userId || !movieId) {
    throw new Error("userId and movie.id are required to remove a favorite");
  }

  const normalizedUserId = String(userId);
  const normalizedMovieId = String(movieId);

  try {
    const existing = await tables.listRows({
      databaseId: DATABASE_ID,
      tableId: FAVORITES_TABLE_ID,
      queries: [
        Query.equal("user_id", normalizedUserId),
        Query.equal("movie_id", normalizedMovieId),
        Query.limit(1),
      ],
    });

    if (existing.rows.length === 0) {
      return null;
    }

    await tables.deleteRow({
      databaseId: DATABASE_ID,
      tableId: FAVORITES_TABLE_ID,
      rowId: existing.rows[0].$id,
    });

    return normalizedMovieId;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const loadUserFavorites = async (userId) => {
  if (!userId) {
    throw new Error("userId is required to store a favorite");
  }

  const normalizedUserId = String(userId);

  try {
    const result = await tables.listRows({
      databaseId: DATABASE_ID,
      tableId: FAVORITES_TABLE_ID,
      queries: [Query.equal("user_id", normalizedUserId)],
    });

    return result.rows;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
