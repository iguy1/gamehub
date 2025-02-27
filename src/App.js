
import './App.css';
import Navbar from './navbar';
import TicTacToe from './TicTacToe';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Game from './game';
import CopterGame from './coptergame';
import Slither from './slither';


function App() {
  return (
    
       <Router>
      <div className="App">
        <Navbar/>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/tictactoe" element={<TicTacToe />} />
          <Route path="/game" element={<Game />} />
          <Route path="/" element={<CopterGame />} />
          <Route path="/slither" element={<Slither />} />
          {/* Add more routes here */}
        </Routes>
      </div>
    </Router>
    
  );
}

export default App;
