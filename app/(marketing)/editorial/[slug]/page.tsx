// app/(marketing)/editorial/[slug]/page.tsx

import { notFound } from "next/navigation";
import { getAllArticles, getArticleBySlug } from "../_posts";
import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Calendar } from "lucide-react";
import LandingPageHeader from "@/components/landing-page/landing-page-header";
import LandingPageFooter from "@/components/landing-page/landing-page-footer";

export async function generateStaticParams() {
  const articles = getAllArticles();
  return articles.map((article) => ({
    slug: article.slug,
  }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  return {
    title: `${article.title} | EziBreezy Editorial`,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      type: "article",
      publishedTime: article.publishedAt,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  // Await params for Next.js 15 compatibility
  const { slug } = await params;
  const article = getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const ArticleBody = article.component;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    author: {
      "@type": "Organization",
      name: "EziBreezy",
      url: "https://www.ezibreezy.com",
    },
    publisher: {
      "@type": "Organization",
      name: "EziBreezy",
      logo: {
        "@type": "ImageObject",
        url: "https://www.ezibreezy.com/icon.png",
      },
    },
  };

  return (
    <div className="flex flex-col min-h-screen bg-background-editorial text-foreground font-serif">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <LandingPageHeader />

      <main className="grow pt-12 pb-24 px-6">
        <article className="max-w-3xl mx-auto">
          <div className="mb-12">
            <Link
              href="/editorial"
              className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-foreground/50 hover:text-brand-primary transition-colors border-b border-transparent hover:border-brand-primary pb-0.5"
            >
              <ArrowLeft className="w-3 h-3" />
              Back to Editorial
            </Link>
          </div>

          <header className="mb-12 border-b-2 border-foreground pb-8">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-[0.95] tracking-tight mb-8">
              {article.title}
            </h1>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 font-mono text-xs uppercase tracking-wider text-foreground/60">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" />
                <time dateTime={article.publishedAt}>
                  {article.publishedAt}
                </time>
              </div>
            </div>
          </header>

          <div className="prose prose-lg prose-stone max-w-none font-serif text-foreground/90 prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-foreground prose-p:leading-relaxed prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline prose-blockquote:border-l-4 prose-blockquote:border-brand-primary prose-blockquote:bg-surface-hover/30 prose-blockquote:p-4 prose-blockquote:not-italic">
            <ArticleBody />
          </div>

          <div className="mt-24 pt-8 border-t border-dashed border-foreground/30 flex justify-between items-center opacity-60 hover:opacity-100 transition-opacity">
            <span className="font-mono text-xs uppercase tracking-widest">
              EziBreezy Editorial Desk
            </span>
            <Link
              href="/auth/signup"
              className="font-mono text-xs uppercase tracking-widest font-bold hover:text-brand-primary"
            >
              Start Publishing →
            </Link>
          </div>
        </article>
      </main>

      <LandingPageFooter />
    </div>
  );
}
