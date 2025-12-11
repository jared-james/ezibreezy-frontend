// app/(marketing)/editorial/_posts/index.ts

import { ComponentType } from "react";
import * as VisualGridManifesto from "./visual-grid-manifesto";
import * as ContextSwitching from "./context-switching-is-poison";
import * as TasteIsTheMoat from "./taste-is-the-moat";
import * as InvisibleExpert from "./the-invisible-expert";

// 1. Import the new specific post wrapper
import * as InstagramCaptions from "./instagram-captions-2025/post";

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  component: ComponentType;
};

export const articles: Article[] = [
  // 2. Add it to the array
  {
    ...InstagramCaptions.metadata,
    component: InstagramCaptions.default,
  },
  {
    ...VisualGridManifesto.metadata,
    component: VisualGridManifesto.default,
  },
  {
    ...ContextSwitching.metadata,
    component: ContextSwitching.default,
  },
  {
    ...TasteIsTheMoat.metadata,
    component: TasteIsTheMoat.default,
  },
  {
    ...InvisibleExpert.metadata,
    component: InvisibleExpert.default,
  },
];

export function getAllArticles() {
  return articles.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export function getArticleBySlug(slug: string) {
  return articles.find((article) => article.slug === slug);
}
