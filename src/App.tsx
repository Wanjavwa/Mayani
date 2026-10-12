import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { PlatformProvider } from '@/context/PlatformState'
import { AppShell } from '@/layout/AppShell'
import { OverviewPage } from '@/pages/Overview'
import { DigitalTwinPage } from '@/pages/DigitalTwin'
import { MaterialsPage } from '@/pages/Materials'
import { EnvironmentalRisksPage } from '@/pages/EnvironmentalRisks'
import { SimulatorPage } from '@/pages/Simulator'
import { PreservationPlanPage } from '@/pages/PreservationPlan'
import { MonitoringPage } from '@/pages/Monitoring'

export default function App() {
  return (
    <PlatformProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/twin" element={<DigitalTwinPage />} />
            <Route path="/materials" element={<MaterialsPage />} />
            <Route path="/risks" element={<EnvironmentalRisksPage />} />
            <Route path="/simulator" element={<SimulatorPage />} />
            <Route path="/plan" element={<PreservationPlanPage />} />
            <Route path="/monitoring" element={<MonitoringPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PlatformProvider>
  )
}
