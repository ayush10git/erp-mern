import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
import Attendance from "./pages/Attendance";
import LoginPage from "./pages/LoginPage";
import "./styles/app.scss";
import { useSelector } from "react-redux";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { user } = useSelector((state) => state.userReducer);

  return (
    <main>
      <Router>
        <div className="content">
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute isAuthenticated={user ? true : false}>
                  <LoginPage />
                </ProtectedRoute>
              }
            />
            <Route
              element={<ProtectedRoute isAuthenticated={user ? true : false} />}
            >
              <Route path="/attendance" element={<Attendance />} />
            </Route>
          </Routes>
        </div>
        <Toaster position="bottom-center" />
      </Router>
    </main>
  );
}

export default App;
