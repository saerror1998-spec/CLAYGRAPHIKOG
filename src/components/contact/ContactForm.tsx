"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import StarBorder from "@/components/ui/StarBorder";
import LiquidButton from "@/components/ui/LiquidButton";
import { services } from "@/data/services";
import { site, waLink } from "@/data/siteContent";

type FormState = { status: "idle" } | { status: "submitting" };

interface FieldErrors {
  name?: string;
  contact?: string;
  email?: string;
  service?: string;
  details?: string;
}

const BUDGETS = ["UNDER $5K", "$5K – $15K", "$15K – $30K", "$30K+", "PREFER NOT TO SAY"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface ContactFormProps {
  /** Prefill the Service select (e.g. from a service page CTA). Editable. */
  defaultService?: string;
  /** Extra reference (e.g. "Similar project enquiry — …"), prefilled into Service. */
  reference?: string;
}

export default function ContactForm({ defaultService, reference }: ContactFormProps) {
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [errors, setErrors] = useState<FieldErrors>({});

  // If a reference was passed (case-study CTA) it becomes the prefilled
  // service value; the visitor can still switch to a standard option.
  const serviceValue = reference || defaultService || "";
  const referenceOption =
    serviceValue && !services.some((s) => s.title === serviceValue) ? serviceValue : null;

  const buildMessage = (p: {
    name: string;
    company: string;
    email: string;
    phone: string;
    service: string;
    budget: string;
    details: string;
  }) =>
    [
      "Hello Clay Graphik,",
      "",
      "I'd like to discuss a new project.",
      "",
      `Name: ${p.name}`,
      `Company / Brand: ${p.company || "Not provided"}`,
      `Email: ${p.email || "Not provided"}`,
      `Phone / WhatsApp: ${p.phone || "Not provided"}`,
      `Service: ${p.service}`,
      `Budget Range: ${p.budget || "Not specified"}`,
      "",
      "Project Details:",
      p.details,
      "",
      "Source: Clay Graphik Website",
      "",
      "Please let me know the next step.",
    ].join("\n");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? "").trim(),
      company: String(data.get("company") ?? "").trim(),
      email: String(data.get("email") ?? "").trim(),
      phone: String(data.get("phone") ?? "").trim(),
      service: String(data.get("service") ?? ""),
      budget: String(data.get("budget") ?? ""),
      details: String(data.get("details") ?? "").trim(),
    };

    // Local validation — WhatsApp only opens when the essentials are present.
    const nextErrors: FieldErrors = {};
    if (payload.name.length < 2) nextErrors.name = "Please enter your name.";
    if (payload.email && !EMAIL_RE.test(payload.email))
      nextErrors.email = "Please enter a valid email address.";
    if (!payload.email && !payload.phone)
      nextErrors.contact = "Please enter an email or phone number so we can reach you.";
    if (!payload.service) nextErrors.service = "Please select a service.";
    if (payload.details.length < 20)
      nextErrors.details = "Please add a little more detail (at least 20 characters).";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setState({ status: "submitting" });
    const url = waLink(buildMessage(payload));

    // Brief labelled pause so the button state is visible, then open WhatsApp.
    // If the popup is blocked, fall back to navigating the current tab —
    // the form is never left frozen and never fakes a "sent" state.
    window.setTimeout(() => {
      const win = window.open(url, "_blank", "noopener,noreferrer");
      if (!win) window.location.href = url;
      window.setTimeout(() => setState({ status: "idle" }), 600);
    }, 300);
  };

  const inputClass = (hasError?: string) =>
    `w-full border-b bg-transparent px-0 py-3 text-base text-offwhite placeholder:text-softgray/50 focus:outline-none focus:border-lime transition-colors ${
      hasError ? "border-red-400/70" : "border-white/15"
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="label text-offwhite/60">
            NAME *
          </label>
          <input
            id="cf-name"
            name="name"
            type="text"
            autoComplete="name"
            className={inputClass(errors.name)}
            placeholder="Your name"
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "cf-name-error" : undefined}
          />
          {errors.name ? (
            <p id="cf-name-error" role="alert" className="mt-2 text-xs text-red-300">
              {errors.name}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="cf-company" className="label text-offwhite/60">
            COMPANY / BRAND
          </label>
          <input
            id="cf-company"
            name="company"
            type="text"
            autoComplete="organization"
            className={inputClass()}
            placeholder="Company or brand"
          />
        </div>

        <div>
          <label htmlFor="cf-email" className="label text-offwhite/60">
            EMAIL *
          </label>
          <input
            id="cf-email"
            name="email"
            type="email"
            autoComplete="email"
            className={inputClass(errors.email || errors.contact)}
            placeholder="you@company.com"
            aria-invalid={Boolean(errors.email || errors.contact)}
            aria-describedby={
              errors.email || errors.contact ? "cf-email-error" : undefined
            }
          />
          {errors.email ? (
            <p id="cf-email-error" role="alert" className="mt-2 text-xs text-red-300">
              {errors.email}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="cf-phone" className="label text-offwhite/60">
            PHONE / WHATSAPP
          </label>
          <input
            id="cf-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className={inputClass()}
            placeholder="+971 ..."
          />
          {errors.contact ? (
            <p id="cf-contact-error" role="alert" className="mt-2 text-xs text-red-300">
              {errors.contact}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="cf-service" className="label text-offwhite/60">
            SERVICE *
          </label>
          <select
            id="cf-service"
            name="service"
            defaultValue={serviceValue}
            className={inputClass(errors.service)}
            aria-invalid={Boolean(errors.service)}
            aria-describedby={errors.service ? "cf-service-error" : undefined}
          >
            <option value="">Select a service</option>
            {referenceOption ? <option value={referenceOption}>{referenceOption}</option> : null}
            {services.map((s) => (
              <option key={s.slug} value={s.title}>
                {s.title}
              </option>
            ))}
            <option value="Multiple Services">Multiple Services</option>
            <option value="Not Sure Yet">Not Sure Yet</option>
          </select>
          {errors.service ? (
            <p id="cf-service-error" role="alert" className="mt-2 text-xs text-red-300">
              {errors.service}
            </p>
          ) : null}
        </div>

        <div>
          <label htmlFor="cf-budget" className="label text-offwhite/60">
            BUDGET RANGE
          </label>
          <select id="cf-budget" name="budget" className={inputClass()}>
            <option value="">Select a range</option>
            {BUDGETS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="cf-details" className="label text-offwhite/60">
            PROJECT DETAILS *
          </label>
          <textarea
            id="cf-details"
            name="details"
            rows={5}
            className={inputClass(errors.details)}
            placeholder="What are you building? What does success look like?"
            aria-invalid={Boolean(errors.details)}
            aria-describedby={errors.details ? "cf-details-error" : undefined}
          />
          {errors.details ? (
            <p id="cf-details-error" role="alert" className="mt-2 text-xs text-red-300">
              {errors.details}
            </p>
          ) : null}
        </div>
      </div>

      <div className="mt-10 flex flex-col items-start gap-4">
        <StarBorder
          as="div"
          className="inline-block"
          style={{ padding: 0 }}
        >
          <LiquidButton
            as="button"
            type="submit"
            disabled={state.status === "submitting"}
            className="inline-flex items-center gap-3 px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {state.status === "submitting" ? "PREPARING WHATSAPP…" : "SEND VIA WHATSAPP"}
            <ArrowUpRight
              aria-hidden="true"
              className="h-4 w-4"
            />
          </LiquidButton>
        </StarBorder>
        <p className="max-w-md text-xs leading-relaxed text-softgray/60">
          Your details stay in your browser — submitting opens WhatsApp with your message
          ready to send to {site.email}.
        </p>
      </div>
    </form>
  );
}
