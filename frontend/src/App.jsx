import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/admin/Dashboard";
import ProductPage from "./pages/admin/ProductPage";
import TypePage from "./pages/admin/TypePage";
import CategoryPage from "./pages/admin/CategoryPage";
import SubtypePage from "./pages/admin/SubtypePage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/product" element={<ProductPage />} />
          <Route path="/type" element={<TypePage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/subtype" element={<SubtypePage />} />
        </Route>

        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
