// App.tsx
import { Articles } from "./articles/articles";
import { Navbar } from "./components/ui/navbar";
import { BrowserRouter as Router, Route, Routes } from "react-router";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/articles" element={<Articles />} />
      </Routes>
    </Router>
  );
}

export default App;
