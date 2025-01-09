// import React from "react";
// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import "./App.css";
// import Login from "./component/login";
// import Signup from "./component/signup";
// import Verifyotp from "./component/verifyotp";
// import Resetpassword from "./component/resetpassword";
// import Newpassword from "./component/newpassword";
// import Invoicelist from "./component/Invoice/invoicelist";
// import Invoiceview from "./component/Invoice/invoiceview";
// import Invoicecreate from "./component/Invoice/invoicecreate";
// import Navbar from "./component/navbar";
// import Footer from "./component/footer";

// function App() {
//   return (
//     <Router>
//       <div>
//         <Routes>
//           <Route path="/login" exact element={<Login />} />
//           <Route path="/signup" exact element={<Signup />} />
//           <Route path="/Verifyotp" exact element={<Verifyotp />} />
//           <Route path="/resetpassword" exact element={<Resetpassword />} />
//           <Route path="/newpassword" exact element={<Newpassword />} />
//           <Navbar />
//           <Route path="/" exact element={<Invoicecreate />} />
//           <Route path="/invoicelist" exact element={<Invoicelist />} />
//           <Route path="/invoiceview" exact element={<Invoiceview />} />
//           <Footer />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;
import React from "react";
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import "./App.css";
import Login from "./component/login";
import Signup from "./component/signup";
import Verifyotp from "./component/verifyotp";
import Resetpassword from "./component/resetpassword";
import Newpassword from "./component/newpassword";
import Invoicelist from "./component/Invoice/invoicelist";
import Invoiceview from "./component/Invoice/invoiceview";
import Invoicecreate from "./component/Invoice/invoicecreate";
import Navbar from "./component/navbar";
import Footer from "./component/footer";
import FAQ from "./component/Faq";
import SettingsPage from "./component/setting";
import MyAccount from "./component/Myaccount";
import Upgrade from "./component/upgrade";
import Custom from "./component/Invoice/customtemplate";
import { GoogleOAuthProvider } from "@react-oauth/google"; 
import Draft from "./component/draft";
import PaymentForm from "./component/phonepe";
function App() {
  return (
    <Router>
      <MainContent />
    </Router>
  );
}

function MainContent() {
  const location = useLocation();

  const noNavbarRoutes = [
    "/login",
    "/signup",
    "/verifyotp",
    "/resetpassword",
    "/newpassword",
  ];

  const noFooterRoutes = [
    "/login",
    "/signup",
    "/verifyotp",
    "/resetpassword",
    "/newpassword",
    "/invoicelist"
  ];

  const isNoNavbar = noNavbarRoutes.includes(location.pathname); 
   const isNoFooter = noFooterRoutes.includes(location.pathname);


  return (
    <>
      {!isNoNavbar && <Navbar />}
      <main>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/verifyotp" element={<Verifyotp />} />
          <Route path="/resetpassword" element={<Resetpassword />} />
          <Route path="/newpassword" element={<Newpassword />} />
          <Route path="/" element={<Invoicecreate />} />
          <Route path="/updateInvoice/:id" element={<Invoicecreate />} />
          <Route path="/invoicelist" element={<Invoicelist />} />
          <Route path="/draft" element={<Draft />} />
          <Route path="/invoiceview" element={<Invoiceview />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/myaccount" element={<MyAccount />} />
          <Route path="/upgrade" element={<Upgrade />} />
          <Route path="/custom" element={<Custom />} />
          <Route path="/phonepe" element={<PaymentForm />} />
        </Routes>
      </main>
      {!isNoFooter && <Footer />}
    </>
  );
}

export default App;
