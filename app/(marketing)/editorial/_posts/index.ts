// app/(marketing)/editorial/_posts/index.ts

import { ComponentType } from "react";

import * as InstagramCaptions from "./instagram-captions-2025/post";
import * as InstagramFontGenerator from "./instagram-font-generator/post";
import * as InstagramCarouselSplitter from "./instagram-carousel-splitter/post";
import * as InstagramGridMaker from "./instagram-grid-maker/post";
import * as InstagramGridPlanner from "./instagram-grid-planner/post";
import * as LinkedInTextFormatter from "./linkedin-text-formatter/post";
import * as ScreenshotStudio from "./screenshot-studio/post";

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  component: ComponentType;
};

export const articles: Article[] = [
  {
    ...ScreenshotStudio.metadata,
    component: ScreenshotStudio.default,
  },
  {
    ...LinkedInTextFormatter.metadata,
    component: LinkedInTextFormatter.default,
  },
  {
    ...InstagramGridPlanner.metadata,
    component: InstagramGridPlanner.default,
  },
  {
    ...InstagramGridMaker.metadata,
    component: InstagramGridMaker.default,
  },
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
