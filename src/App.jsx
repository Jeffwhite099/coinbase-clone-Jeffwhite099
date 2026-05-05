import { BrowserRouter, Routes, Route } from "react-router-dom";
import WarningBanner from "./pages/WarningBanner";
import Layout from "./components/layout/Layout";

import Home from "./pages/Home";
import Explore from "./pages/Explore";
import AssetDetail from "./pages/AssetDetail";
import Learn from "./pages/Learn";
import Profile from "./pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import ScrollToTop from "./components/common/ScrollToTop";

function App() {
  return (
    <BrowserRouter>
      <WarningBanner />
      
      <ScrollToTop />
      
      <div style={{ paddingTop: "44px" }}>
        <Routes>
          {/* Pages with Navbar + Footer */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/assets/:id" element={<AssetDetail />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          {/* Auth pages WITHOUT layout */}
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signup/details" element={<SignUp />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;