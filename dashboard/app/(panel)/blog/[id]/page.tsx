import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { PostForm } from "@/components/PostForm";
import { adminPost } from "@/lib/admin-data";

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await adminPost(id);
  if (!post) notFound();

  return (
    <>
      <PageHeader title={`Edit: ${post.title}`} />
      <PostForm key={post.updatedAt} post={post} today={post.date} />
    </>
  );
}
