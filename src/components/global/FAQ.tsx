import { faqs } from "@/data/siteContent";

/**
 * FAQ accordion — native <details>/<summary> (zero JS, fully accessible,
 * keyboard friendly). Used on /services and /contact.
 */
export default function FAQ() {
  return (
    <div className="border-t border-white/[0.08]">
      {faqs.map((faq) => (
        <details key={faq.question} className="group border-b border-white/[0.08]">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-7 [&::-webkit-details-marker]:hidden">
            <span className="text-lg font-medium tracking-tight text-offwhite transition-colors duration-300 group-open:text-lime sm:text-xl">
              {faq.question}
            </span>
            <span
              aria-hidden="true"
              className="relative block h-4 w-4 shrink-0 transition-transform duration-300 group-open:rotate-45"
            >
              <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-lime" />
              <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-lime" />
            </span>
          </summary>
          <p className="max-w-2xl pb-8 text-base leading-relaxed text-softgray">
            {faq.answer}
          </p>
        </details>
      ))}
    </div>
  );
}
