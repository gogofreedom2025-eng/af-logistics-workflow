import { Navigate, Route, Routes } from "react-router-dom";
import { AppHeader } from "./components/AppHeader";
import { ClassificationBanner } from "./components/ClassificationBanner";
import { AirliftStep } from "./pages/AirliftStep";
import { Form2776 } from "./pages/Form2776";
import { Form4080 } from "./pages/Form4080";
import { LoadPlanList } from "./pages/LoadPlanList";

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
          <Route path="/load-plans/:id" element={<Form4080 />} />
          <Route path="/load-plans/:id/dangerous-cargo-load-list" element={<Form2776 />} />
          <Route path="/load-plans/:id/:step" element={<AirliftStep />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <ClassificationBanner />
    </div>
  );
}
