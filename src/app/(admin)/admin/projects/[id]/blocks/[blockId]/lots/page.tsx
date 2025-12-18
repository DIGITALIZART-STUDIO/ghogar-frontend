import LotsPageProvider from "./_components/LotsPageProvider";

type LotsPageProps = {
  params: Promise<{
    id: string;
    blockId: string;
  }>;
};

export default async function LotsPage({ params }: LotsPageProps) {
  const { id: projectId, blockId } = await params;

  return <LotsPageProvider projectId={projectId} blockId={blockId} />;
}
