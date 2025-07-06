import { Routes, Route } from 'react-router-dom';
import GalleryPage from './pages/GalleryPage';

import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import RegisterPage from './pages/RegisterPage';
import ImageDetailPage from './pages/ImageDetailPage';
import Footer from './components/Footer';


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<GalleryPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/:unsplashId" element={<ImageDetailPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
