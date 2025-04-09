import DashboardPage from "./(admin)/dashboard/page";
import AdminLayoutWrapper from "./(admin)/layout";

export default function Home() {
  return (
    <AdminLayoutWrapper>
      <DashboardPage />
    </AdminLayoutWrapper>
  );
}
