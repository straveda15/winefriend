import { connection } from "next/server";
import { PageHeader } from "@/components/PageHeader";
import { PostForm } from "@/components/PostForm";

export default async function NewPostPage() {
  await connection();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <>
      <PageHeader title="New article" description="Write the article and choose when it is published. Adding photos is optional." />
      <PostForm today={today} />
    </>
  );
}
