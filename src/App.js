
import './App.css';
import Navbar from './navbar';
import TicTacToe from './TicTacToe';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './Home'; 

function App() {
  return (
    
       <Router>
      <div className="App">
        <Navbar/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tictactoe" element={<TicTacToe />} />
          {/* Add more routes here */}
        </Routes>
      </div>
    </Router>
    
  );
}

export default App;
