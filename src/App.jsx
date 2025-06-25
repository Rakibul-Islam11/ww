import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AllProducts from './all-components/all-product-page/AllProducts';
import PurchasePage from './all-components/all-product-page/PurchasePage';
import './App.css'
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AllProducts />} />
        <Route path="/purchase" element={<PurchasePage />} />
      </Routes>
    </Router>
  );
}

export default App;