import { PageHeader } from "@/components/PageHeader";
import { ProductForm } from "@/components/ProductForm";

export default function NewProductPage() {
  return (
    <>
      <PageHeader title="Add product" description="Upload photographs, write the details and choose whether it is visible on the website." />
      <ProductForm />
    </>
  );
}
