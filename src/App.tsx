import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/app/Dashboard";
import Randomizers from "./pages/app/Randomizers";
import RandomizerDetail from "./pages/app/RandomizerDetail";
import Bots from "./pages/app/Bots";
import Reports from "./pages/app/Reports";
import Account from "./pages/app/Account";
import PaymentSettings from "./pages/app/PaymentSettings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner position="top-right" />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            
            {/* Protected app routes */}
            <Route path="/app" element={<Navigate to="/app/dashboard" replace />} />
            <Route path="/app/dashboard" element={<Dashboard />} />
            <Route path="/app/randomizadores" element={<Randomizers />} />
            <Route path="/app/randomizadores/:id" element={<RandomizerDetail />} />
            <Route path="/app/bots" element={<Bots />} />
            <Route path="/app/relatorios" element={<Reports />} />
            <Route path="/app/pagamento" element={<PaymentSettings />} />
            <Route path="/app/conta" element={<Account />} />
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
