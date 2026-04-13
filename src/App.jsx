import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PrivateRoute from "./Private";
import Items from "./Components/Items";
import EditItem from "./Components/EditItem";
import Register from "./Components/Register";
import Login from "./Components/Login";


function App() {
  return (
    <Router>
      <Routes>

        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected */}
        <Route element={<PrivateRoute />}>
          <Route path="/items" element={<Items />} />
          <Route path="/items/edit" element={<EditItem />} />
        </Route>

      </Routes>
    </Router>
  );
}


export default App;