
import { Link, Outlet, useLocation } from "react-router-dom";

export function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-paper text-ink flex flex-col">
      <header className="border-b border-stone">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="font-display text-xl tracking-tight">
            Mu-Sigma Residences
          </Link>
          <nav className="flex items-center gap-6 text-sm font-sans">
            <Link
              to="/"
              className={`transition-colors hover:text-brass ${
                !isAdmin ? "text-ink" : "text-taupe"
              }`}
            >
              Showcase
            </Link>
            <Link
              to="/admin"
              className={`transition-colors hover:text-brass ${
                isAdmin ? "text-ink" : "text-taupe"
              }`}
            >
              Admin
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-stone mt-16">
        <div className="max-w-6xl mx-auto px-6 py-6 text-sm text-taupe">
          Internal sales tool — Mu-Sigma Residences
        </div>
      </footer>
    </div>
  );
}