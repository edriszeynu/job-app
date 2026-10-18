import Link from "next/link";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for job seekers getting started.",
    features: [
      "Browse unlimited jobs",
      "Apply to 5 jobs/month",
      "Basic profile",
      "Email notifications",
    ],
    cta: "Get Started",
    href: "/auth/register",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "per month",
    description: "For serious job seekers and growing employers.",
    features: [
      "Everything in Free",
      "Unlimited job applications",
      "Featured profile",
      "Priority support",
      "Resume builder",
      "Analytics dashboard",
    ],
    cta: "Start Free Trial",
    href: "/auth/register",
    highlighted: true,
  },
  {
    name: "Business",
    price: "$49",
    period: "per month",
    description: "For employers who want to hire faster.",
    features: [
      "Post unlimited jobs",
      "Advanced applicant filters",
      "Company branding",
      "Team collaboration",
      "Dedicated account manager",
      "API access",
    ],
    cta: "Contact Sales",
    href: "/contact",
    highlighted: false,
  },
];

export default function PricingSection() {
  return (
    <section className="py-20 bg-muted/30 border-y border-border/40">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground">Simple, Transparent Pricing</h2>
          <p className="text-muted-foreground mt-3 max-w-xl mx-auto">
            Choose the plan that fits your needs. No hidden fees, cancel anytime.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-2xl border p-7 shadow-sm transition-shadow hover:shadow-md ${
                plan.highlighted
                  ? "border-primary bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                  : "border-border bg-card"
              }`}
            >
              {plan.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-amber-900 text-xs font-bold px-3 py-1 rounded-full">
                  Most Popular
                </span>
              )}

              <div className="mb-6">
                <p className={`text-sm font-semibold mb-1 ${plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {plan.name}
                </p>
                <div className="flex items-end gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className={`text-sm mb-1.5 ${plan.highlighted ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                    /{plan.period}
                  </span>
                </div>
                <p className={`text-sm mt-2 ${plan.highlighted ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                  {plan.description}
                </p>
              </div>

              <ul className="space-y-3 mb-8 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm">
                    <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                      plan.highlighted ? "bg-primary-foreground/20" : "bg-primary/10"
                    }`}>
                      <Check className={`h-3 w-3 ${plan.highlighted ? "text-primary-foreground" : "text-primary"}`} />
                    </span>
                    <span className={plan.highlighted ? "text-primary-foreground/90" : "text-foreground"}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={plan.href}
                className={`block text-center py-3 px-6 rounded-xl font-semibold text-sm transition-all ${
                  plan.highlighted
                    ? "bg-white text-primary hover:bg-white/90"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
