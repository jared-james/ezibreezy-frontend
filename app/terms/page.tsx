// app/terms/page.tsx

import Link from "next/link";

export default function TermsPage() {
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
            <h2 className="headline font-serif mb-4">Terms of Service</h2>
            <p className="dateline">Last updated: January 2025</p>
          </div>

          {/* Article body */}
          <div className="article-body space-y-6">
            <section>
              <h3 className="font-serif text-xl font-bold mb-3">
                1. Acceptance of Terms
              </h3>
              <p>
                By accessing and using EziBreezy, you accept and agree to be
                bound by the terms and provision of this agreement. If you do
                not agree to these terms, please do not use our service.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl font-bold mb-3">
                2. Description of Service
              </h3>
              <p>
                EziBreezy provides a platform for users to manage and organize
                their tasks and activities. We reserve the right to modify,
                suspend, or discontinue any aspect of the service at any time.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl font-bold mb-3">
                3. User Accounts
              </h3>
              <p>
                To access certain features of the service, you must register
                for an account. You agree to:
              </p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Provide accurate and complete information</li>
                <li>Maintain the security of your account credentials</li>
                <li>
                  Notify us immediately of any unauthorized use of your account
                </li>
                <li>
                  Be responsible for all activities under your account
                </li>
              </ul>
            </section>

            <section>
              <h3 className="font-serif text-xl font-bold mb-3">
                4. User Conduct
              </h3>
              <p>You agree not to:</p>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
                <li>Use the service for any illegal purpose</li>
                <li>Violate any laws in your jurisdiction</li>
                <li>
                  Infringe upon the rights of others
                </li>
                <li>Transmit any harmful or malicious code</li>
                <li>
                  Interfere with or disrupt the service or servers
                </li>
                <li>Attempt to gain unauthorized access to the service</li>
              </ul>
            </section>

            <section>
              <h3 className="font-serif text-xl font-bold mb-3">
                5. Intellectual Property
              </h3>
              <p>
                The service and its original content, features, and
                functionality are owned by EziBreezy and are protected by
                international copyright, trademark, and other intellectual
                property laws.
              </p>
              <p className="mt-3">
                You retain ownership of any content you submit to the service,
                but grant us a license to use, store, and display such content
                as necessary to provide the service.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl font-bold mb-3">
                6. Termination
              </h3>
              <p>
                We may terminate or suspend your account and access to the
                service immediately, without prior notice or liability, for any
                reason, including breach of these terms.
              </p>
              <p className="mt-3">
                Upon termination, your right to use the service will cease
                immediately. You may also delete your account at any time.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl font-bold mb-3">
                7. Disclaimer of Warranties
              </h3>
              <p>
                The service is provided on an &ldquo;AS IS&rdquo; and &ldquo;AS
                AVAILABLE&rdquo; basis without warranties of any kind, either
                express or implied, including but not limited to implied
                warranties of merchantability, fitness for a particular purpose,
                or non-infringement.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl font-bold mb-3">
                8. Limitation of Liability
              </h3>
              <p>
                In no event shall EziBreezy, its directors, employees, partners,
                or suppliers be liable for any indirect, incidental, special,
                consequential, or punitive damages arising out of your use of
                the service.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl font-bold mb-3">
                9. Changes to Terms
              </h3>
              <p>
                We reserve the right to modify or replace these terms at any
                time. We will provide notice of any material changes by posting
                the new terms on this page and updating the &ldquo;Last
                updated&rdquo; date.
              </p>
              <p className="mt-3">
                Your continued use of the service after any changes constitutes
                acceptance of the new terms.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl font-bold mb-3">
                10. Governing Law
              </h3>
              <p>
                These terms shall be governed by and construed in accordance
                with applicable laws, without regard to conflict of law
                provisions.
              </p>
            </section>

            <section>
              <h3 className="font-serif text-xl font-bold mb-3">
                11. Contact Us
              </h3>
              <p>
                If you have any questions about these terms, please contact us
                at:
              </p>
              <p className="mt-2 font-medium">legal@ezibreezy.com</p>
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
                className="hover:underline text-[--foreground]"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hover:underline text-[--foreground] font-bold"
              >
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
