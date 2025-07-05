import { Routes, Route } from 'react-router-dom';
import GalleryPage from './pages/GalleryPage';

import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import RegisterPage from './pages/RegisterPage';


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<GalleryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </>
  );
}

export default App;
