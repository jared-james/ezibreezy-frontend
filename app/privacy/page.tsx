// app/privacy/page.tsx

import Link from "next/link";

export default function PrivacyPage() {
  return (
    <main className="bg-[--background] min-h-screen">
      {/* Header */}
      <header className="px-4 pt-8">
        <div className="mx-auto w-full max-w-5xl">
          {/* Top bar */}
          <div className="mb-4 flex items-center justify-between border-b-2 border-[--foreground] pb-2 text-xs uppercase tracking-wider">
            <Link
              href="/"
              className="text-[--foreground] font-serif font-normal tracking-[0.15em] hover:underline"
            >
              Breezy Times
            </Link>

            <div className="flex items-center space-x-6">
              <Link
                href="/auth/signup"
                className="hover:underline text-[--foreground]"
              >
                Sign Up
              </Link>
              <Link
                href="/auth/login"
                className="hover:underline text-[--foreground]"
              >
                Login
              </Link>
            </div>
          </div>

          {/* Masthead */}
          <h1 className="mb-8 border-b-4 border-double border-[--foreground] pb-4 text-center font-serif text-6xl md:text-8xl font-bold uppercase tracking-tight">
            EziBreezy
          </h1>
        </div>
      </header>

      {/* Content */}
      <article className="px-4 py-12">
        <div className="mx-auto w-full max-w-3xl">
          {/* Article header */}
          <div className="mb-8 border-b border-[--border] pb-6">
            <p className="eyebrow mb-3">Legal Notice</p>
            <h2 className="headline font-serif mb-4">Privacy Policy</h2>
            <p className="dateline">Last updated: January 2025</p>
          </div>

          {/* Article body */}
          <div className="article-body space-y-6">
            <section>
              <h3 className="font-serif text-xl font-bold mb-3">
                1. Introduction
              </h3>
              <p>
                Welcome to EziBreezy. This privacy policy explains how we
                collect, use, and protect your personal information when you use
                our service.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl font-bold mb-3">
                2. Information We Collect
              </h3>
              <p>
                We collect information that you provide directly to us,
                including but not limited to:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Account information (name, email address)</li>
                <li>Profile information</li>
                <li>Content you create or upload</li>
                <li>Communications with us</li>
              </ul>
            </section>

            <section>
              <h3 className="font-serif text-xl font-bold mb-3">
                3. How We Use Your Information
              </h3>
              <p>We use the information we collect to:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Provide, maintain, and improve our services</li>
                <li>Process your requests and transactions</li>
                <li>Send you technical notices and support messages</li>
                <li>Respond to your comments and questions</li>
              </ul>
            </section>

            <section>
              <h3 className="font-serif text-xl font-bold mb-3">
                4. Information Sharing
              </h3>
              <p>
                We do not sell your personal information. We may share your
                information only in the following circumstances:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>With your consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and prevent fraud</li>
                <li>With service providers who assist our operations</li>
              </ul>
            </section>

            <section>
              <h3 className="font-serif text-xl font-bold mb-3">
                5. Data Security
              </h3>
              <p>
                We implement appropriate technical and organizational measures
                to protect your personal information against unauthorized access,
                alteration, disclosure, or destruction.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl font-bold mb-3">
                6. Your Rights
              </h3>
              <p>You have the right to:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Object to processing of your information</li>
                <li>Export your data</li>
              </ul>
            </section>

            <section>
              <h3 className="font-serif text-xl font-bold mb-3">
                7. Cookies and Tracking
              </h3>
              <p>
                We use cookies and similar tracking technologies to collect
                information about your browsing activities and to provide a
                better user experience.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl font-bold mb-3">
                8. Changes to This Policy
              </h3>
              <p>
                We may update this privacy policy from time to time. We will
                notify you of any changes by posting the new policy on this page
                and updating the &ldquo;Last updated&rdquo; date.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl font-bold mb-3">
                9. Contact Us
              </h3>
              <p>
                If you have any questions about this privacy policy, please
                contact us at:
              </p>
              <p className="mt-2 font-medium">privacy@ezibreezy.com</p>
            </section>
          </div>

          {/* Back link */}
          <div className="mt-12 pt-6 border-t border-[--border]">
            <Link
              href="/"
              className="text-[--brand-accent] hover:text-[--brand-accent-hover] hover:underline text-sm uppercase tracking-wide"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </article>

      {/* Footer */}
      <footer className="bg-[--background] px-4 pb-10 pt-12 mt-16">
        <div className="mx-auto w-full max-w-5xl">
          {/* Top footer bar */}
          <div className="mb-4 flex items-center justify-between border-t-2 border-[--foreground] pt-2 text-xs uppercase tracking-wider">
            <span className="text-[--foreground] font-serif font-normal tracking-[0.15em]">
              Breezy Times
            </span>

            <div className="flex items-center space-x-6">
              <Link
                href="/privacy"
                className="hover:underline text-[--foreground] font-bold"
              >
                Privacy
              </Link>
              <Link href="/terms" className="hover:underline text-[--foreground]">
                Terms
              </Link>
            </div>
          </div>

          {/* Publication line */}
          <p className="border-t-4 border-double border-[--foreground] pt-3 text-center font-serif text-[0.7rem] md:text-xs uppercase tracking-[0.25em] text-[--muted-foreground]">
            Edition No. 01 · EziBreezy · 2025 · All Rights Reserved
          </p>
        </div>
      </footer>
    </main>
  );
}
