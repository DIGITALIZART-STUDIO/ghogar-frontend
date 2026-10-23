import { ProjectContractPage } from "./_components/ProjectContractPage";

type ContractPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ContractPage({ params }: ContractPageProps) {
  const { id } = await params;
  return <ProjectContractPage projectId={id} />;
}
