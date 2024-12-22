import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import State from "./components/State";
import Effect from "./components/Effect";
import Reducer from "./components/Reducer";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/state" element={<State />} />
        <Route path="/effect" element={<Effect />} />
        <Route path="/reducer" element={<Reducer />} />
      </Routes>
    </Router>
  );
}

export default App;
