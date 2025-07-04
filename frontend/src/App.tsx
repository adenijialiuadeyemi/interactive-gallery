import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GalleryPage from './pages/GalleryPage';
import SavedPage from './pages/SavedPage';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GalleryPage />} />
        <Route path="/saved" element={<SavedPage />} />
      </Routes>
    </Router>
  );
}

export default App;
