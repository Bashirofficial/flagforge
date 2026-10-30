import { Developers } from "../components/landing/Developers";
import { Features } from "../components/landing/Features";
import { FinalCta } from "../components/landing/FinalCta";
import { Footer } from "../components/landing/Footer";
import { Hero } from "../components/landing/Hero";
import { LiveDemo } from "../components/landing/LiveDemo";
import { LogoStrip } from "../components/landing/LogoStrip";
import { MarqueeBand } from "../components/landing/MarqueeBand";
import { Navbar } from "../components/landing/Navbar";
import { Pricing } from "../components/landing/Pricing";
import { ScrollStatement } from "../components/landing/ScrollStatement";
import { UseCases } from "../components/landing/UseCases";

export function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-canvas text-ink">
      <a
        href="#main"
        className="sr-only rounded-full bg-ink px-4 py-2 text-sm text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60]"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <LogoStrip />
        <ScrollStatement />
        <LiveDemo />
        <Features />
        <UseCases />
        <Developers />
        <Pricing />
        <MarqueeBand />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
