import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { OverviewPage } from './pages/OverviewPage';
import { RiskMapPage } from './pages/RiskMapPage';
import { LocationsPage } from './pages/LocationsPage';
import { LocationDetailPage } from './pages/LocationDetailPage';
import { CompoundRisksPage } from './pages/CompoundRisksPage';
import { AlertsPage } from './pages/AlertsPage';
import { MitigationPage } from './pages/MitigationPage';
import { WhatIfPage } from './pages/WhatIfPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { ModelTransparencyPage } from './pages/ModelTransparencyPage';
import { SettingsPage } from './pages/SettingsPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppShell />}>
          <Route index element={<OverviewPage />} />
          <Route path="risk-map" element={<RiskMapPage />} />
          <Route path="locations" element={<LocationsPage />} />
          <Route path="locations/:id" element={<LocationDetailPage />} />
          <Route path="compound-risks" element={<CompoundRisksPage />} />
          <Route path="alerts" element={<AlertsPage />} />
          <Route path="mitigation" element={<MitigationPage />} />
          <Route path="what-if" element={<WhatIfPage />} />
          <Route path="admin/data-sources" element={<DataSourcesPage />} />
          <Route path="admin/model-transparency" element={<ModelTransparencyPage />} />
          <Route path="admin/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
