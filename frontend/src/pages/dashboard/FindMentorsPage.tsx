import { useState } from 'react';
import { Sidebar } from '../../components/dashboard/Sidebar';
import { DashboardNavbar } from '../../components/dashboard/DashboardNavbar';

export const FindMentorsPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-8">
          <h1 className="text-3xl font-bold mb-4">Find Your Perfect Mentor</h1>
          <p className="text-muted-foreground">Mentor discovery page - Full implementation coming soon</p>
        </main>
      </div>
    </div>
  );
};
