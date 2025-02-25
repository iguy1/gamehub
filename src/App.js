
import './App.css';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import TicTacToe from './TicTacToe';

function Home(){
  return(
    <div>
      <h2>Welcome to the GameHub where you can find your favorite games to play.</h2>
      
    </div>
  );
}
function App() {
  return (
    
       <Router>
      <div className="App">
        <h1>TicTacToe</h1>
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
