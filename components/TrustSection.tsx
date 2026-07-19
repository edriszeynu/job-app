import { CheckCircle2 } from "lucide-react";

export default function TrustSection() {
  const features = [
    "100% remote jobs available",
    "Verified employers",
    "Free and easy application",
    "AI-powered job matching",
  ];

  return (
    <section className="py-12 border-y border-border/40 bg-muted/10">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {features.map((feature) => (
            <div key={feature} className="flex items-center justify-center gap-2 text-sm">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}