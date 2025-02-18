// App.tsx
import { Articles } from "./articles/articles";
import { Orders } from "./orders/orders";
import { Customers } from "./customers/customers";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router";
import { Layout } from "./layout";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/articles" replace />} />
          <Route path="/articles" element={<Articles />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/customers" element={<Customers />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
