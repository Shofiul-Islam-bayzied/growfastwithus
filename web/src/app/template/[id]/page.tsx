import TemplateDetail from "@/pages/template-detail-new";
import { notFound } from "next/navigation";

export default async function TemplateDetailPage({ params }: { params: Promise<{ id?: string }> }) {
  const { id } = await params;
  if (!id) notFound();
  return <TemplateDetail id={id} />;
}


