import { Link } from "react-router";

export default function NotFound() {
  // RENDER
  // Displayed when no other route matches the requested URL.
  return (
    <div className="mt-20 flex flex-col items-center">
      <h2>Page not found</h2>
      <p>The page you are looking for no longer exists or has been moved.</p>
      <Link to="/">Back to home</Link>
    </div>
  );
}
