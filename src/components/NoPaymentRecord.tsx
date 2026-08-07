import {
  Coins,
  CreditCard,
  Download,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  LucideIcon,
} from "lucide-react";
import Link from "next/link";

type FeatureType = {
  icon: LucideIcon;
  iconColor: string;
  heading: string;
  subHeading: string;
};
const NoPaymentRecord = ({ error }: { error: string | undefined }) => {
  const features: FeatureType[] = [
    {
      icon: ShieldCheck,
      iconColor: "text-teal-400",
      heading: "Secure Checkout",
      subHeading: "100% secure payments powered by Stripe.",
    },
    {
      icon: Download,
      iconColor: "text-purple-400",
      heading: "Instant Receipts",
      subHeading: "Download official PDF receipts for your accounting.",
    },
    {
      icon: Coins,
      iconColor: "text-blue-400",
      heading: "Instant Top-ups",
      subHeading: "Credits are added to your balance immediately.",
    },
  ];

  return (
    <div className="flex flex-col items-center justify-center text-center py-12 px-4">
      <div className="relative mb-6">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-full bg-teal-500/10 blur-xl animate-pulse" />
        {/* Icon container */}
        <div className="relative flex items-center justify-center w-20 h-20 rounded-full bg-slate-950/60 border border-slate-800/80 shadow-inner group">
          <CreditCard className="h-10 w-10 text-teal-400 group-hover:scale-110 transition-transform duration-300" />
          <Sparkles className="absolute -top-1 -right-1 h-5 w-5 text-teal-300 animate-float" />
        </div>
      </div>

      <h4 className="text-xl font-semibold text-slate-200 tracking-tight mb-2">
        No billing history {!error ? "yet" : "found"}
      </h4>
      <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-8">
        When you buy credits, your transactions and receipt downloads will
        appear here.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <Link
          href="/#pricing"
          className="flex items-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl text-slate-950 bg-teal-400 hover:bg-teal-300 hover:scale-[1.02] shadow-lg shadow-teal-500/10 transition-all duration-200 cursor-pointer group"
        >
          <ShoppingCart className="h-4 w-4 transition-transform group-hover:scale-110" />
          <span>View Pricing Plans</span>
        </Link>
        <div className="text-xs text-slate-500 font-medium px-4 py-2 bg-slate-950/30 rounded-lg border border-slate-900">
          🎁 Every new user gets 50 free credits
        </div>
      </div>

      {/* Value Props Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 w-full max-w-2xl border-t border-slate-900/60 pt-8">
        {features.map((feature, index) => {
          return (
            <div
              key={index}
              className="flex flex-col items-center text-center p-3"
            >
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-lg bg-teal-950/20 border border-teal-500/10 ${feature.iconColor} mb-3`}
              >
                <feature.icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-bold text-slate-300 mb-1">
                {feature.heading}
              </span>
              <span className="text-[11px] text-slate-500">
                {feature.subHeading}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NoPaymentRecord;
