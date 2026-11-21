import { Navigate, Route, Routes } from "react-router-dom";
import { AppHeader } from "./components/AppHeader";
import { ClassificationBanner } from "./components/ClassificationBanner";
import { AircraftLoadPlanForm } from "./pages/AircraftLoadPlan";
import { AirliftStep } from "./pages/AirliftStep";
import { Form1385 } from "./pages/Form1385";
import { Form1387 } from "./pages/Form1387";
import { Form13872 } from "./pages/Form13872";
import { Form1750 } from "./pages/Form1750";
import { Form2133 } from "./pages/Form2133";
import { Form2768 } from "./pages/Form2768";
import { Form2775 } from "./pages/Form2775";
import { Form2776 } from "./pages/Form2776";
import { Form4080 } from "./pages/Form4080";
import { FormCatalog } from "./pages/FormCatalog";
import { LoadPlanList } from "./pages/LoadPlanList";
import { SavedData } from "./pages/SavedData";

export default function App() {
  return (
    <div className="app-shell">
      <a className="usa-skipnav" href="#main-content">
        Skip to main content
      </a>
      <ClassificationBanner />
      <AppHeader />
      <main id="main-content">
        <Routes>
          <Route path="/" element={<LoadPlanList />} />
          <Route path="/load-plans" element={<LoadPlanList />} />
          <Route path="/saved-data" element={<SavedData />} />
          <Route path="/form-catalog" element={<FormCatalog />} />
          <Route path="/load-plans/:id" element={<Form4080 />} />
          <Route path="/load-plans/:id/cargo-manifests" element={<Form1385 />} />
          <Route path="/load-plans/:id/military-shipment-label" element={<Form1387 />} />
          <Route path="/load-plans/:id/special-services-label" element={<Form13872 />} />
          <Route path="/load-plans/:id/c17-load-plan" element={<AircraftLoadPlanForm variant="c17" />} />
          <Route path="/load-plans/:id/c130-load-plan" element={<AircraftLoadPlanForm variant="c130" />} />
          <Route path="/load-plans/:id/joint-airlift-inspection" element={<Form2133 />} />
          <Route path="/load-plans/:id/air-passenger-cargo-request" element={<Form2768 />} />
          <Route path="/load-plans/:id/pallet-identifier" element={<Form2775 />} />
          <Route path="/load-plans/:id/dangerous-cargo-load-list" element={<Form2776 />} />
          <Route path="/load-plans/:id/packing-list" element={<Form1750 />} />
          <Route path="/load-plans/:id/:step" element={<AirliftStep />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ClassificationBanner />
    </div>
  );
}
