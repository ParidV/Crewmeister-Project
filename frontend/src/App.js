import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";
import Absences from "./views/Absences";
import Members from "./views/Members";
import Home from "./views/Home";
function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="absences" element={<Absences />} />
        <Route path="members" element={<Members />} />
        <Route path="*" element={<NotFoundRoute />} />
      </Routes>
    </div>
  );
}
const NotFoundRoute = () => <div>Not Found</div>;

export default App;
