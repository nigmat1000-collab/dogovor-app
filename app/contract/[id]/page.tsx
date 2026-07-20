import ContractForm from "@/components/contract-form";

export default async function ContractPage(props: { params: Promise<{ id: string }>; searchParams: Promise<{ draft?: string }> }) {
  const { id } = await props.params;
  const { draft } = await props.searchParams;
  return <ContractForm contractId={id} draftId={draft} />;
}
