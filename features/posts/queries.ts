import { createDb } from '@/lib/db';
import { posts, postsToTags, tags } from '@/lib/db/schema';
import { and, desc, eq } from 'drizzle-orm';

export const runtime = 'edge';

export const getLatestPublishedPosts = async () => {
  const db = createDb();
  const latestPosts = await db.query.posts.findMany({
    columns: {
      title: true,
      slug: true,
      cover: true,
      excerpt: true,
      publishedAt: true,
    },
    with: {
      postsToTags: {
        with: {
          tag: true,
        },
      },
    },
    where: and(eq(posts.status, 'published'), eq(posts.deletedFlag, false)),
    orderBy: desc(posts.publishedAt),
  });

  // 排除 about 文章
  return latestPosts
    .filter((post) => post.slug !== 'about')
    .map(({ postsToTags, ...rest }) => ({
      ...rest,
      tags: postsToTags.map((tag) => tag.tag.name),
    }));
};

export const getPostBySlug = async (slug: string) => {
  const db = createDb();
  const post = await db.query.posts.findFirst({
    with: {
      postsToTags: {
        with: {
          tag: true,
        },
      },
    },
    where: and(eq(posts.slug, slug), eq(posts.status, 'published'), eq(posts.deletedFlag, false)),
  });

  if (!post) {
    return null;
  }

  const { postsToTags, ...rest } = post;

  return {
    ...rest,
    tags: postsToTags.map((tag) => tag.tag.name),
  };
};

export const getPostsByTag = async (tagName: string) => {
  const db = createDb();

  // 解码 URL 编码的标签名
  const decodedTagName = decodeURIComponent(tagName);

  // 使用 join 查询指定标签的文章
  const tagPosts = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      cover: posts.cover,
      excerpt: posts.excerpt,
      publishedAt: posts.publishedAt,
      tagName: tags.name,
    })
    .from(posts)
    .innerJoin(postsToTags, eq(posts.id, postsToTags.postId))
    .innerJoin(tags, eq(postsToTags.tagId, tags.id))
    .where(and(eq(tags.name, decodedTagName), eq(posts.status, 'published'), eq(posts.deletedFlag, false)))
    .orderBy(desc(posts.publishedAt));

  // 获取每篇文章的所有标签
  const postsWithTags = await Promise.all(
    tagPosts.map(async (post) => {
      const postTags = await db
        .select({
          id: tags.id,
          name: tags.name,
        })
        .from(tags)
        .innerJoin(postsToTags, eq(tags.id, postsToTags.tagId))
        .where(eq(postsToTags.postId, post.id));

      return {
        ...post,
        tags: postTags.map((tag) => tag.name),
      };
    }),
  );

  return postsWithTags;
};
