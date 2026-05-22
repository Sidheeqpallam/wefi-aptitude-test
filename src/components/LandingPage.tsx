import { Link, useSearchParams } from "react-router-dom";
import { SsfLogo } from "./SsfLogo";
import { ArrowRight, Sparkles } from "lucide-react";
import { Footer } from "./Footer";

export default function LandingPage() {
  const [searchParams] = useSearchParams();
  const queryString = searchParams.toString();
  const registerHref = `/register${queryString ? `?${queryString}` : ''}`;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f5f5f7] text-[#172033]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(17,88,168,0.18),transparent_34%),radial-gradient(circle_at_85%_15%,rgba(238,45,46,0.14),transparent_24%),linear-gradient(180deg,#faff8_0%,#eef5ff_52%,#f6f8fc_100%)]" />
      <div className="absolute inset-x-0 top-0 h-72 bg-[linear-gradient(135deg,rgba(255,255,255,0.7),rgba(255,255,255,0))]" />
      <div className="absolute -left-24 top-28 h-56 w-56 rounded-full bg-[#ffd9c5]/40 blur-3xl" />
      <div className="absolute -right-16 top-14 h-64 w-64 rounded-full bg-[#bdd8ff]/50 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4 rounded-full border border-white/70 bg-white/70 px-5 py-3 shadow-[0_18px_44px_rgba(17,88,168,0.09)] backdrop-blur-xl">
          <SsfLogo className="h-10 sm:h-11" />
          <Link
            to={registerHref}
            className="inline-flex items-center gap-2 rounded-full bg-[linear-gradient(135deg,#1158a8_0%,#0a376b_100%)] px-4 py-2.5 text-sm font-semibold text-white! shadow-[0_12px_28px_rgba(17,88,168,0.22)] transition hover:-translate-y-px"
          >
            Start now
          </Link>
        </header>

        <section className="grid flex-1 items-center gap-10 py-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(340px,0.85fr)] lg:py-12">
          <div className="animate-fade-in">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#b9d3f5] bg-white/80 px-4 py-2 text-xs font-bold uppercase tracking-[0.24em] text-primary shadow-sm">
              <Sparkles className="h-3.5 w-3.5" />
              Career aptitude experience
            </div>

            <h1 className="max-w-3xl text-5xl font-black leading-[0.96] tracking-tighter text-[#162033] sm:text-6xl lg:text-7xl">
              Discover your direction through a sharper, faster aptitude journey.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-[#4f5f79] sm:text-lg">
              Built for individual exploration and counseling events, this experience moves from profile capture to test completion and result clarity without the noise of a check-in workflow.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to={registerHref}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[linear-gradient(135deg,#1158a8_0%,#0a376b_100%)] px-6 py-4 text-base font-semibold text-white! shadow-[0_18px_40px_rgba(17,88,168,0.28)] transition hover:-translate-y-px"
              >
                Begin aptitude test
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>

        <Footer className="pb-2" />
      </div>
    </div>
  );
}