import DocumentView from "@/components/document-view";

export default async function DocumentPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return <DocumentView draftId={id} />;
}
