
import { Link, Outlet, useLocation } from "react-router-dom";

export function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-transparent text-ink flex flex-col">
      <header className="sticky top-0 z-50 border-b border-[#e8dfd2] bg-[#f8f4ee]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-4 py-4 sm:px-6 lg:px-10">
          <Link to="/" className="brand-lockup" aria-label="WhiteLotus Residences home">
            <span className="brand-mark">
              <img src="/whitelotus-mark.svg" alt="WhiteLotus logo" />
            </span>
            <span className="brand-copy">
              <span className="brand-name">WhiteLotus</span>
              <span className="brand-tag">Residences</span>
            </span>
          </Link>

         
          <nav className="hidden items-center gap-2 rounded-full border border-[#eadfce] bg-white/60 p-1.5 shadow-[0_8px_24px_rgba(24,49,38,0.04)] md:flex">
           <Link
              to="/"
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                !isAdmin
                  ? "bg-[#183126] text-[#f8f4ee] shadow-[0_12px_28px_rgba(17,30,24,0.18)]"
                  : "text-[#5e6a62] hover:bg-[#f3eee7] hover:text-[#183126]"
              }`}
            >
              Showcase
            </Link>
            <Link
              to="/admin"
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                isAdmin
                  ? "bg-[#183126] text-[#f8f4ee] shadow-[0_12px_28px_rgba(17,30,24,0.18)]"
                  : "text-[#5e6a62] hover:bg-[#f3eee7] hover:text-[#183126]"
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

      <footer className="mt-20 border-t border-[#dfece2] bg-[#eaf4ee]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[1.4fr_1fr_1fr] lg:px-10">
          <div>
            <div className="brand-lockup mb-4">
              <span className="brand-mark">
                <img src="/whitelotus-mark.svg" alt="WhiteLotus logo" />
              </span>
              <span className="brand-copy">
                <span className="brand-name">WhiteLotus</span>
                <span className="brand-tag">Residences</span>
              </span>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#5e6a62]">
              Curated residences shaped for slow mornings, thoughtful living, and a stronger sense of place.
            </p>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#1f5a4a]">
              Visit
            </p>
            <ul className="mt-4 space-y-3 text-sm text-[#5e6a62]">
              <li>12 Lila Avenue, Bengaluru</li>
              <li>Mon–Sat · 9:00 AM – 7:00 PM</li>
              <li>+91 98765 43210</li>
            </ul>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#1f5a4a]">
              Explore
            </p>
            <div className="mt-4 flex flex-col gap-3 text-sm text-[#5e6a62]">
              <Link to="/" className="transition-colors hover:text-[#183126]">
                Portfolio
              </Link>
              <Link to="/admin" className="transition-colors hover:text-[#183126]">
                Admin dashboard
              </Link>
              <a href="mailto:hello@whitelotusresidences.com" className="transition-colors hover:text-[#183126]">
                hello@whitelotusresidences.com
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#dfece2] bg-[#edf7f0]">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 text-xs uppercase tracking-[0.18em] text-[#5e6a62] sm:px-6 lg:px-10">
            <span>WhiteLotus Residences</span>
            <span>Private Sales</span>
          </div>
        </div>
      </footer>
    </div>
  );
}