import { join } from "path";
import { readFileSync, readdirSync } from "fs";
import { bundleMDX } from "mdx-bundler";
import readingTime from "reading-time";

import * as matter from "gray-matter";

import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypeCodeTitles from "rehype-code-titles";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypePrism from "rehype-prism-plus";

export async function getFiles(type) {
  const path = join(process.cwd(), "data", type);
  return readdirSync(path);
}

export async function getFileBySlug(type, slug?) {
  const source = slug
    ? readFileSync(join(process.cwd(), "data", type, `${slug}.mdx`), "utf8")
    : readFileSync(join(process.cwd(), "data", `${type}.mdx`), "utf8");

  const { code, frontmatter } = await bundleMDX(source, {
    xdmOptions(options) {
      options.remarkPlugins = [...(options?.remarkPlugins ?? []), remarkGfm];
      options.rehypePlugins = [
        ...(options?.rehypePlugins ?? []),
        rehypeSlug,
        rehypeCodeTitles,
        rehypePrism,
        [
          rehypeAutolinkHeadings,
          {
            properties: {
              className: ["anchor"],
            },
          },
        ],
      ] as any;
      return options;
    },
  });

  const tweetMatches = source.match(/<StaticTweet\sid="[0-9]+"\s\/>/g);
  const tweetIDs = tweetMatches?.map((tweet) => tweet.match(/[0-9]+/g)[0]);

  return {
    code,
    tweetIDs: tweetIDs || [],
    frontMatter: {
      wordCount: source.split(/\s+/gu).length,
      readingTime: readingTime(source),
      slug: slug || null,
      ...frontmatter,
    },
  };
}

export async function getAllFilesFrontMatter(type) {
  const files = readdirSync(join(process.cwd(), "data", type));
  const posts = files.map((file) => {
    const fileContents = readFileSync(
      join(process.cwd(), "data", type, file),
      "utf8"
    );
    return {
      content: fileContents,
      slug: file.replace(".mdx", ""),
    };
  });
  return posts;
}
