import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export const AppShell: React.FC = () => {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('Today');

  return (
    <div className="flex min-h-screen bg-[#0B192C] text-slate-100 antialiased font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        isOpenMobile={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onToggleMobileNav={() => setIsMobileNavOpen(true)}
          selectedTimeRange={selectedTimeRange}
          onTimeRangeChange={setSelectedTimeRange}
        />

        <main className="flex-1 p-4 lg:p-8 max-w-7xl w-full mx-auto space-y-8">
          <Outlet context={{ timeRange: selectedTimeRange }} />
        </main>
      </div>
    </div>
  );
};
