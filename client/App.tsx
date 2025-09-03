import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import NewRequest from "./pages/NewRequest";
import MyRequests from "./pages/MyRequests";
import Approvals from "./pages/Approvals";
import Admin from "./pages/Admin";
import RequestSelect from "./pages/RequestSelect";
import NotFound from "./pages/NotFound";


const App = () => (
  <>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/request/select" element={<RequestSelect />} />
            <Route path="/request/new" element={<NewRequest />} />
            <Route path="/request/accident" element={<RequestSelect />} />
            <Route path="/request/business-car" element={<RequestSelect />} />
            <Route path="/request/expense" element={<RequestSelect />} />
            <Route path="/request/bereavement" element={<RequestSelect />} />
            <Route path="/request/mail" element={<RequestSelect />} />
            <Route path="/request/cellphone" element={<RequestSelect />} />
            <Route path="/requests" element={<MyRequests />} />
            <Route path="/approvals" element={<Approvals />} />
            <Route path="/admin" element={<Admin />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </>
);

createRoot(document.getElementById("root")!).render(<App />);
