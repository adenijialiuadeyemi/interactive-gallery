import { Routes, Route } from 'react-router-dom';
import GalleryPage from './pages/GalleryPage';

import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';


function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<GalleryPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </>
  );
}

export default App;
