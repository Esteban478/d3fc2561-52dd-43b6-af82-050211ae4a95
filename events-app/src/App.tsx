import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Events from './Component/Events';
import Cart from './Component/Cart';

function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/events" element={<Events/>} />
        <Route path="/cart" element={<Cart/>} />
      </Routes>
    </Router>
  );
}
      
export default App;