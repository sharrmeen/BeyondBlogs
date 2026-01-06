import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import ComparisonPage from './pages/ComparisonPage';

function App() {
  return (
    <Router>
     
      <div className="min-h-screen bg-[#f8fafc]">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/compare/:id" element={<ComparisonPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;