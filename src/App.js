import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import State from "./components/State";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/state" element={<State />} />
      </Routes>
    </Router>
  );
}

export default App;
