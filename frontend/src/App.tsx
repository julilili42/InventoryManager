// App.tsx
import { Articles } from "./articles/articles";
import { Orders } from "./orders/orders";
import { Customers } from "./customers/customers";
import { OrderDetails } from "./orders/orderDetails/page";
import { BrowserRouter as Router, Route, Routes } from "react-router";
import { Layout } from "./layout";

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/articles" element={<Articles />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/orders/:order_id" element={<OrderDetails />} />
          <Route path="/customers" element={<Customers />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
