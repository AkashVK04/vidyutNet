import { HashRouter, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { ToastProvider } from './context/ToastContext.jsx';
import { AppProvider, useApp } from './context/AppContext.jsx';
import Header from './components/Header.jsx';
import { SimulationBanner, SubNav, MobileNav, Footer } from './components/Chrome.jsx';
import AlertModal from './components/AlertModal.jsx';
import CreateAlertModal from './components/CreateAlertModal.jsx';
import SettingsDrawer from './components/SettingsDrawer.jsx';
import PresentationMode from './components/PresentationMode.jsx';
import Landing from './pages/Landing.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Nowcast from './pages/Nowcast.jsx';
import Lightning from './pages/Lightning.jsx';
import Alerts from './pages/Alerts.jsx';
import DataSources from './pages/DataSources.jsx';
import Analytics from './pages/Analytics.jsx';
import PublicWarning from './pages/PublicWarning.jsx';

function AppLayout() {
  const { presentation } = useApp();
  const location = useLocation();
  return (
    <div className="min-h-screen pb-16 md:pb-0">
      <Header />
      <div className="pt-14">
        <SimulationBanner />
        <SubNav />
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="mx-auto max-w-[1920px] px-3 py-3 md:px-4"
        >
          <Outlet />
        </motion.main>
        <Footer />
      </div>
      <MobileNav />
      <AlertModal />
      <CreateAlertModal />
      <SettingsDrawer />
      <AnimatePresence>{presentation && <PresentationMode />}</AnimatePresence>
    </div>
  );
}

export default function App() {
  return (
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <ToastProvider>
        <AppProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/public" element={<PublicWarning />} />
            <Route path="/app" element={<AppLayout />}>
              <Route index element={<Navigate to="overview" replace />} />
              <Route path="overview" element={<Dashboard />} />
              <Route path="nowcast" element={<Nowcast />} />
              <Route path="lightning" element={<Lightning />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="data-sources" element={<DataSources />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppProvider>
      </ToastProvider>
    </HashRouter>
  );
}
