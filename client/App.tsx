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
import ShippingRequest from "./pages/ShippingRequest";
import Bereavement from "./pages/Bereavement";
import OfficeSupplyIndex from "./pages/OfficeSupplyIndex";
import OfficeSupplyStandard from "./pages/OfficeSupplyStandard";
import OfficeSupplyNonStandard from "./pages/OfficeSupplyNonStandard";
import NotFound from "./pages/NotFound";
import GARequestManagement from "./pages/GARequestManagement";
import AccidentIncident from "./pages/AccidentIncident";


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
            <Route path="/request/accident" element={<AccidentIncident />} />
            <Route path="/request/business-car" element={<RequestSelect />} />
            <Route path="/request/expense" element={<RequestSelect />} />
            <Route path="/request/bereavement" element={<Bereavement />} />
            <Route path="/request/mail" element={<ShippingRequest />} />
            <Route path="/request/office-supply" element={<OfficeSupplyIndex />} />
            <Route path="/request/office-supply/standard" element={<OfficeSupplyStandard />} />
            <Route path="/request/office-supply/non-standard" element={<OfficeSupplyNonStandard />} />
            <Route path="/request/cellphone" element={<RequestSelect />} />
            <Route path="/request/office-supply" element={<RequestSelect />} />
            <Route path="/requests" element={<MyRequests />} />
            <Route path="/requests/pending" element={<MyRequests />} />
            <Route path="/requests/approved" element={<MyRequests />} />
            <Route path="/requests/returned" element={<MyRequests />} />
            <Route path="/requests/draft" element={<MyRequests />} />
            <Route path="/approvals" element={<Approvals />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/ga/requests" element={<GARequestManagement />} />
            <Route path="/ga/requests/business-card" element={<GARequestManagement />} />
            <Route path="/ga/requests/office-supply" element={<GARequestManagement />} />
            <Route path="/ga/requests/trip" element={<GARequestManagement />} />
            <Route path="/ga/requests/mail" element={<GARequestManagement />} />
            <Route path="/ga/requests/expense" element={<GARequestManagement />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </>
);

createRoot(document.getElementById("root")!).render(<App />);
