import BlocksServerComponent from "./_components/ServerBlockPage";

type BlocksPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    projectId?: string;
  }>;
};

export default async function BlocksPage({ params }: BlocksPageProps) {
    const { id } = await params;

    return <BlocksServerComponent id={id} />;
}
