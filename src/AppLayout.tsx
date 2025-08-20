import { Outlet } from "react-router-dom";
import Header from "./components/common/Header";
import Footer from "./components/common/Footer";
import { AuthProvider } from "./contexts/AuthContext";

const AppLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* <AuthProvider> */}
      <Header />
      <div>
        <div className="flex-grow">
          <Outlet />
        </div>
        <Footer />
      </div>
      {/* </AuthProvider> */}
    </div>
  );
};

export default AppLayout;
