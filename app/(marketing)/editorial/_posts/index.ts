// app/(marketing)/editorial/_posts/index.ts

import { ComponentType } from "react";

import * as InstagramCaptions from "./instagram-captions-2025/post";
import * as InstagramFontGenerator from "./instagram-font-generator/post";
import * as InstagramCarouselSplitter from "./instagram-carousel-splitter/post";

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  component: ComponentType;
};

export const articles: Article[] = [
  {
    ...InstagramCarouselSplitter.metadata,
    component: InstagramCarouselSplitter.default,
  },
  {
    ...InstagramFontGenerator.metadata,
    component: InstagramFontGenerator.default,
  },
  {
    ...InstagramCaptions.metadata,
    component: InstagramCaptions.default,
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
