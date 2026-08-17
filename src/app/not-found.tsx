import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center px-6 py-24 text-center">
      <p className="label-lime">ERROR 404</p>
      <h1 className="mt-6 text-[clamp(3.5rem,10vw,8rem)] font-semibold uppercase leading-none tracking-[-0.03em] text-offwhite">
        LOST IN
        <br />
        <span className="text-lime">THE CANVAS.</span>
      </h1>
      <p className="mt-8 max-w-md text-base leading-relaxed text-softgray">
        This page doesn&apos;t exist — or it moved. Either way, the way back is
        clear.
      </p>
      <Link
        href="/"
        className="group mt-12 inline-flex items-center gap-3 border border-lime/60 px-8 py-4 text-[11px] font-medium uppercase tracking-[0.18em] text-lime transition-colors duration-300 hover:bg-lime hover:text-carbon"
      >
        <ArrowLeft
          aria-hidden="true"
          className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-0.5"
        />
        BACK TO HOME
      </Link>
    </div>
  );
}
