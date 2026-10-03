/**
 * Place at: frontend/src/components/Hero.tsx
 */
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2000&q=80";

export function Hero() {
  return (
    <div className="relative h-[68vh] min-h-[500px] max-h-[720px] w-full overflow-hidden">
      <img
        src={HERO_IMAGE}
        alt="Luxury home exterior"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(242,211,160,0.22),_transparent_35%),linear-gradient(90deg,rgba(12,22,18,0.82)_0%,rgba(12,22,18,0.45)_40%,rgba(12,22,18,0.18)_100%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#10251e]/85 via-[#10251e]/10 to-transparent" />

      <div className="relative mx-auto grid h-full max-w-6xl items-end gap-8 px-6 pb-12 pt-16 md:grid-cols-[1.25fr_0.75fr]">
        <div className="max-w-2xl">
          <span className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.24em] text-paper/90 backdrop-blur-sm">
            WhiteLotus Residences
          </span>
          <h1 className="mt-6 font-display text-4xl leading-none text-paper sm:text-5xl lg:text-[4.2rem]">
            Bespoke homes for a calmer kind of luxury.
          </h1>
          <p className="mt-5 max-w-xl text-base text-paper/80 sm:text-lg">
            Discover elevated neighbourhoods, serene interiors, and thoughtfully designed spaces in Bengaluru.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#properties"
              className="inline-flex items-center rounded-full bg-[#d6b370] px-5 py-3 text-sm font-semibold text-[#183126] shadow-[0_18px_38px_rgba(214,179,112,0.32)] transition-transform hover:-translate-y-0.5"
            >
              Explore residences
            </a>
            <span className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-paper/80 backdrop-blur-sm">
              Private tours available
            </span>
          </div>
        </div>

        <div className="hidden justify-end md:flex">
          <div className="soft-panel w-full max-w-sm rounded-[1.75rem] border border-white/10 bg-white/10 p-5 text-paper backdrop-blur-md">
            <p className="text-[10px] uppercase tracking-[0.22em] text-paper/70">Featured collection</p>
            <div className="mt-4 rounded-2xl border border-white/10 bg-[#dfe8e3]/10 p-4">
              <p className="font-display text-2xl text-paper">Skyline Courtyard</p>
              <p className="mt-2 text-sm text-paper/75">3 BHK · 1,950 sq ft</p>
              <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-sm text-paper/80">
                <span>From</span>
                <span className="font-display text-xl text-[#f3d9a5]">₹1.85 Cr</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}