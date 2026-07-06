import "./App.scss";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HomePage from "./pages/HomePage";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ListingsPage from "./pages/ListingsPage";
import IndividualListing from "./pages/IndividualListing";
import UploadPage from "./pages/UploadPage";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import { useState } from "react";

function App() {
  const token = localStorage.getItem("token");
  const name = localStorage.getItem("name");
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [signedIn, setSignedIn] = useState(Boolean(token));
  const [credentials, setCredentials] = useState(name ? { name } : {});

  return (
    <div className="App">
      <Router>
        <Header
          showLogin={showLogin}
          setShowLogin={setShowLogin}
          showRegister={showRegister}
          setShowRegister={setShowRegister}
          signedIn={signedIn}
          setSignedIn={setSignedIn}
          setCredentials={setCredentials}
        />
        <Routes>
          <Route path="/home" element={<HomePage />} />
          <Route
            path="/listings/:city/:listingID"
            element={
              <IndividualListing
                signedIn={signedIn}
                credentials={credentials}
              />
            }
          />
          <Route
            path="/listings/:city"
            element={
              <ListingsPage
                signedIn={signedIn}
                credentials={credentials}
              />
            }
          />
          <Route
            path="/favorites"
            element={
              <ListingsPage
                signedIn={signedIn}
                credentials={credentials}
              />
            }
          />
          <Route
            path="/post"
            element={
              <UploadPage
                signedIn={signedIn}
                credentials={credentials}
              />
            }
          />
          <Route path="/register" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
}

export default App;
