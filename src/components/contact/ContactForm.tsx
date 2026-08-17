"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { services } from "@/data/services";

type FormState =
  | { status: "idle" }
  | { status: "submitting" }
  | { status: "success" }
  | { status: "error"; message: string };

interface FieldErrors {
  name?: string;
  email?: string;
  details?: string;
}

const BUDGETS = ["UNDER $5K", "$5K – $15K", "$15K – $30K", "$30K+", "PREFER NOT TO SAY"];

export default function ContactForm() {
  const [state, setState] = useState<FormState>({ status: "idle" });
  const [errors, setErrors] = useState<FieldErrors>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

    // Client validation
    const nextErrors: FieldErrors = {};
    if (payload.name.length < 2) nextErrors.name = "Please enter your name.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email))
      nextErrors.email = "Please enter a valid email address.";
    if (payload.details.length < 20)
      nextErrors.details = "Please add a little more detail (at least 20 characters).";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    setState({ status: "submitting" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setState({ status: "success" });
        return;
      }
      const body = (await res.json().catch(() => null)) as { message?: string } | null;
      setState({
        status: "error",
        message:
          body?.message ||
          "Something went wrong sending your message. Please try again or email connect@claygraphik.com directly.",
      });
    } catch {
      setState({
        status: "error",
        message:
          "Network error — your message was not sent. Please try again or email connect@claygraphik.com directly.",
      });
    }
  };

  if (state.status === "success") {
    return (
      <div className="border border-lime/40 bg-lime/[0.04] p-10">
        <p className="label-lime">MESSAGE RECEIVED</p>
        <h2 className="mt-4 text-2xl font-medium uppercase tracking-tight text-offwhite">
          Thanks — we&apos;ll get back to you shortly.
        </h2>
        <p className="mt-3 max-w-md text-sm leading-relaxed text-softgray">
          We usually reply within one business day. For anything urgent, email
          connect@claygraphik.com directly.
        </p>
      </div>
    );
  }

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
            className={inputClass(errors.email)}
            placeholder="you@company.com"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "cf-email-error" : undefined}
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
        </div>

        <div>
          <label htmlFor="cf-service" className="label text-offwhite/60">
            SERVICE
          </label>
          <select id="cf-service" name="service" className={inputClass()}>
            <option value="">Select a service</option>
            {services.map((s) => (
              <option key={s.slug} value={s.title}>
                {s.title}
              </option>
            ))}
            <option value="Not sure yet">Not sure yet</option>
          </select>
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

      <div className="mt-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={state.status === "submitting"}
          className="group inline-flex cursor-pointer items-center gap-3 bg-lime px-8 py-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-carbon transition-colors duration-300 hover:bg-offwhite disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state.status === "submitting" ? "SENDING…" : "SEND MESSAGE"}
          <ArrowUpRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
          />
        </button>
        {state.status === "error" ? (
          <p role="alert" className="max-w-md text-sm leading-relaxed text-red-300">
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
