import { notFound } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { ProductForm } from "@/components/ProductForm";
import { adminProduct } from "@/lib/admin-data";

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const product = await adminProduct(id);
  if (!product) notFound();

  return (
    <>
      <PageHeader title={`Edit: ${product.name}`} />
      <ProductForm key={product.updatedAt} product={product} />
    </>
  );
}
