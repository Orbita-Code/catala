import TemaContent from "./TemaContent";

export default async function TemaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <TemaContent slug={slug} />;
}
