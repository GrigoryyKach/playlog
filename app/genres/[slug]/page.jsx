"use client";

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { renderContent } from '../../../lib/renderContent';
import { Skeleton } from '../../../components/ui/skeleton';

export default function PostPage() {
  const { slug } = useParams();
  const router = useRouter();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    async function fetchPost() {
      try {
        const res = await fetch(`/api/genres/${slug}`);

        if (res.status === 404) {
          router.replace('/404');
          return;
        }

        const data = await res.json();

        if (!data) {
          router.replace('/404');
        } else {
          setPost(data);
        }
      } catch (error) {
        console.error('Ошибка при загрузке поста:', error);
        router.replace('/404');
      } finally {
        setIsLoading(false);
      }
    }

    fetchPost();
  }, [slug, router]);

  if (isLoading) {
    return (
      <div className="post container mx-auto">
        <article className="w-full">
          <Skeleton className="h-10 w-2/3 mb-5" />
          <Skeleton className="h-6 w-1/3 mb-4" />
          <Skeleton className="h-6 w-1/4 mb-8" />
          <Skeleton className="h-36 w-full mb-2" />
        </article>
      </div>
    );
  };

  if (!post) {
    return null;
  }

  return (
    <div className="post container mx-auto mb-14">
      <article className="w-full md:w-5/6">
        <h1 className="text-4xl font-bold mb-5">{post.name}</h1>

        {/* author */}
        <p className="text-[#696A75] mb-8">
          {post.author_name}
        </p>

        {/* content */}
        <div className='text-[#BABABF] post-content'>
          {renderContent(post.content)}
        </div>
      </article>
    </div>
  );
}
