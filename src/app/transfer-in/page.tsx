import Link from "next/link";
import { Upload, ClipboardCheck, Truck, Clock, DollarSign, Zap } from "lucide-react";
import CTAButtons from "./CTAButtons";

const steps = [
  {
    number: 1,
    title: "Upload",
    description: "Take a photo or upload your prescription",
    Icon: Upload,
  },
  {
    number: 2,
    title: "We review",
    description: "Our pharmacy team verifies your prescription within 24 hours",
    Icon: ClipboardCheck,
  },
  {
    number: 3,
    title: "Get delivered",
    description: "We fill it, check your insurance, and ship it to your door",
    Icon: Truck,
  },
];

const valueProps = [
  {
    Icon: Clock,
    heading: "Skip the pharmacy line",
    points: [
      "Free delivery to your door",
      "Manage prescriptions from your phone",
      "No in-person visits needed",
    ],
  },
  {
    Icon: DollarSign,
    heading: "Know what you\u2019ll pay upfront",
    points: [
      "Direct insurance billing",
      "Price quote before we fill",
      "No hidden fees",
    ],
  },
  {
    Icon: Zap,
    heading: "Fast from upload to delivery",
    points: [
      "24-hour pharmacy review",
      "Quick and easy upload process",
      "Fast shipping across Canada",
    ],
  },
];

export default function TransferInPage() {
  return (
    <div className="tp-page min-h-screen flex flex-col">
      {/* Top nav */}
      <nav
        className="bg-white border-b"
        style={{ borderColor: "var(--tp-border)", borderWidth: "0.5px" }}
      >
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/transfer-in"
            className="text-[20px] font-bold"
            style={{ color: "var(--tp-primary)" }}
          >
            Tucker&apos;s
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/upload"
              className="text-[14px] transition-colors hover:underline"
              style={{ color: "var(--tp-text-secondary)" }}
            >
              Upload Rx
            </Link>
            <Link
              href="/pharmacy"
              className="text-[14px] transition-colors hover:underline"
              style={{ color: "var(--tp-text-secondary)" }}
            >
              Pharmacy Dashboard
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-white pt-20 pb-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h1
            className="text-[44px] leading-[1.15] font-bold tracking-tight"
            style={{ color: "var(--tp-text-primary)" }}
          >
            Get your prescriptions filled by Tucker&apos;s Pharmacy
          </h1>
          <p
            className="mt-5 text-[18px] leading-relaxed max-w-2xl mx-auto"
            style={{ color: "var(--tp-text-secondary)" }}
          >
            Already have a prescription from your doctor? Upload it and we&apos;ll
            deliver your medication to your door &mdash; no assessment needed.
          </p>
          <CTAButtons />
        </div>
      </section>

      {/* How It Works */}
      <section
        id="how-it-works"
        className="py-20 px-6"
        style={{ backgroundColor: "#FAFAF9" }}
      >
        <div className="max-w-4xl mx-auto">
          <h2
            className="text-[32px] font-bold text-center mb-14"
            style={{ color: "var(--tp-text-primary)" }}
          >
            How it works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step) => (
              <div
                key={step.number}
                className="bg-white rounded-[16px] p-8 text-center"
                style={{ border: "1px solid var(--tp-border)" }}
              >
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5"
                  style={{
                    backgroundColor: "var(--tp-primary)",
                    color: "white",
                  }}
                >
                  <step.Icon size={22} />
                </div>
                <div
                  className="text-[13px] font-semibold uppercase tracking-wider mb-2"
                  style={{ color: "var(--tp-primary)" }}
                >
                  Step {step.number}
                </div>
                <h3
                  className="text-[20px] font-bold mb-2"
                  style={{ color: "var(--tp-text-primary)" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-[15px] leading-relaxed"
                  style={{ color: "var(--tp-text-secondary)" }}
                >
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col gap-16">
          {valueProps.map((prop, i) => (
            <div
              key={i}
              className="flex flex-col md:flex-row items-start gap-6"
            >
              <div
                className="w-14 h-14 rounded-[14px] flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: "#FEF3E6",
                  color: "var(--tp-primary)",
                }}
              >
                <prop.Icon size={26} />
              </div>
              <div>
                <h3
                  className="text-[22px] font-bold mb-3"
                  style={{ color: "var(--tp-text-primary)" }}
                >
                  {prop.heading}
                </h3>
                <ul className="flex flex-col gap-2">
                  {prop.points.map((point, j) => (
                    <li
                      key={j}
                      className="text-[16px] leading-relaxed flex items-start gap-2"
                      style={{ color: "var(--tp-text-secondary)" }}
                    >
                      <span
                        className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: "var(--tp-primary)" }}
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom CTA */}
      <section
        className="py-20 px-6"
        style={{ backgroundColor: "#FAFAF9" }}
      >
        <div className="max-w-3xl mx-auto text-center">
          <h2
            className="text-[32px] font-bold mb-4"
            style={{ color: "var(--tp-text-primary)" }}
          >
            Ready to get started?
          </h2>
          <p
            className="text-[18px] mb-8"
            style={{ color: "var(--tp-text-secondary)" }}
          >
            Upload your prescription and we&apos;ll take care of the rest.
          </p>
          <Link
            href="/upload"
            className="inline-block px-8 py-4 rounded-[12px] text-[16px] font-medium text-white transition-colors"
            style={{ backgroundColor: "var(--tp-primary)" }}
          >
            Upload your prescription
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        className="border-t py-8 px-6"
        style={{ borderColor: "var(--tp-border)" }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <span
            className="text-[14px]"
            style={{ color: "var(--tp-text-tertiary)" }}
          >
            Tucker&apos;s Pharmacy &mdash; Demo Prototype
          </span>
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-[14px] transition-colors hover:underline"
              style={{ color: "var(--tp-text-tertiary)" }}
            >
              Patient Demo
            </Link>
            <Link
              href="/pharmacy"
              className="text-[14px] transition-colors hover:underline"
              style={{ color: "var(--tp-text-tertiary)" }}
            >
              Pharmacy Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
