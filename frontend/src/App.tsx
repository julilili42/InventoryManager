// App.tsx
import { Articles } from "./articles/articles";
import { Orders } from "./orders/orders";
import { Customers } from "./customers/customers";
import { Home } from "./home/home";
import { OrderDetails } from "./orders/orderDetails/page";

import { Navbar } from "./components/ui/navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<Articles />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/orders/:order_id" element={<OrderDetails />} />
        <Route path="/customers" element={<Customers />} />
      </Routes>
    </Router>
  );
}

export default App;
