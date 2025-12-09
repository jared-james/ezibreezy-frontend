import { Suspense } from "react";
import CheckoutPageContent from "./checkout-page-content";

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-[60vh] bg-[#fdfbf7]" />}>
      <CheckoutPageContent />
    </Suspense>
  );
}
