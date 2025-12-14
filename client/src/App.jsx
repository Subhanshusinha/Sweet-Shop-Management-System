import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <div className="min-h-screen py-4 md:py-8 px-2 md:px-4 flex justify-center items-start">
      <div className="w-full max-w-6xl bg-white/40 backdrop-blur-xl rounded-[3rem] shadow-2xl border border-white/60 overflow-hidden flex flex-col relative min-h-[90vh]">
        <Navbar />
        <div className="flex-1 w-full mx-auto p-4 md:p-8 overflow-y-auto">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
