import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardLayout from "./pages/DashboardLayout";
import LoginPage from "./pages/LoginPage";
import DashboardHome from "./pages/DashboardHome";
import MarketsPage from "./pages/MarketsPage";
import ChartsPage from "./pages/ChartsPage";
import AIEnginePage from "./pages/AIEnginePage";
import StrategiesPage from "./pages/StrategiesPage";
import JournalPage from "./pages/JournalPage";
import PortfolioPage from "./pages/PortfolioPage";
import SignalsPage from "./pages/SignalsPage";
import CommunityPage from "./pages/CommunityPage";
import MarketplacePage from "./pages/MarketplacePage";
import AcademyPage from "./pages/AcademyPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
            <Route index element={<DashboardHome />} />
            <Route path="markets" element={<MarketsPage />} />
            <Route path="charts" element={<ChartsPage />} />
            <Route path="ai" element={<AIEnginePage />} />
            <Route path="strategies" element={<StrategiesPage />} />
            <Route path="journal" element={<JournalPage />} />
            <Route path="portfolio" element={<PortfolioPage />} />
            <Route path="signals" element={<SignalsPage />} />
            <Route path="community" element={<CommunityPage />} />
            <Route path="marketplace" element={<MarketplacePage />} />
            <Route path="academy" element={<AcademyPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
