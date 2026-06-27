import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect} from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import React, { useState } from "react";
import Dashboard from "./pages/Dashboard";
import DraftSystem from "./pages/DraftSystem";
import MillingSystem from "./pages/MillingSystem";
import CWPumps from "./pages/CWPumps";
import BfpSystems from "./pages/BFP";
import CCPumpsSystems from "./pages/CCPumps"
import CEPSystems from "./pages/CEP";
import CompressorSystem from "./pages/Compressors";
import TrendPage from "./pages/TrendPage";
import { TrendProvider } from "./context/TrendContext";
import TestTrend from "./pages/TestTrend";
import PowerDistribution from "./pages/PowerDistribution";
import { HashRouter } from "react-router-dom";
import  Footer  from "./components/footer";

function RouteChangeHandler() {

  const location = useLocation();
  const { clearTags } = useTrend();

  useEffect(() => {

    clearTags();

  }, [location.pathname]);

  return null;
}

export default function App() {
const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  return (
    
    <TrendProvider>
      <HashRouter>
        <div className="app">
          <Header
            collapsed={sidebarCollapsed}
            setCollapsed={setSidebarCollapsed}
          />

          <div className="main-layout">
            <Sidebar
              collapsed={sidebarCollapsed}
            />

            <Routes>
              <Route
                path="/"
                element={<PowerDistribution />}
              />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/DraftSystem" element={<DraftSystem />} />
              <Route path="/MillingSystem" element={<MillingSystem />} />
              <Route path="/CWPumps" element={<CWPumps />} />
              <Route path="/BFP" element={<BfpSystems />} />
              <Route path="/CCPumps" element={<CCPumpsSystems />} />
              <Route path="/CEP" element={<CEPSystems />} />
              <Route path="/Compressors" element={<CompressorSystem />} />
              <Route path="/trends" element={<TrendPage />} />
              <Route path="/TestTrend" element={<TestTrend />} />
              
            </Routes>
          </div>
          <Footer />
        </div>
      </HashRouter>
    </TrendProvider>
  );
}