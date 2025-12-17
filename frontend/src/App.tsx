import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Stalls from './pages/Stalls';
import StallDetails from './pages/StallDetails';
import Feedback from './pages/Feedback';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';
import StudentLogin from './pages/StudentLogin';
import StudentRegister from './pages/StudentRegister';
import PaymentPage from './pages/PaymentPage';

import AdminLayout from './components/AdminLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="stalls" element={<Stalls />} />
        <Route path="stalls/:id" element={<StallDetails />} />
        <Route path="feedback" element={<Feedback />} />
        <Route path="about" element={<About />} />
        <Route path="payment" element={<PaymentPage />} />

        {/* Student Auth */}
        <Route path="login" element={<StudentLogin />} />
        <Route path="register" element={<StudentRegister />} />
      </Route>

      {/* Admin Routes - Completely separate layout */}
      <Route path="/admin/dashboard" element={
        <AdminLayout>
          <AdminDashboard />
        </AdminLayout>
      } />

      {/* Old redirect for safety */}
      <Route path="/admin" element={<Navigate to="/admin/dashboard" />} />
    </Routes>
  );
}

export default App;
