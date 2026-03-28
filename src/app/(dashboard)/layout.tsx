import { Sidebar } from "../../components/features/Sidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <Sidebar />
      {/* Push content right to sit beside the fixed 240px sidebar */}
      <main className="ml-60 flex-1 p-8">
        {children}
      </main>
    </div>
  );
}
