import { HashRouter, Route, Routes } from "react-router-dom";
import CampaignDetail from "@/pages/CampaignDetail";
import CreateCampaign from "@/pages/CreateCampaign";
import Dashboard from "@/pages/Dashboard";
import Explore from "@/pages/Explore";
import Home from "@/pages/Home";

export function AppRouter() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/campaign/:id" element={<CampaignDetail />} />
        <Route path="/create" element={<CreateCampaign />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </HashRouter>
  );
}
