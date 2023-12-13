import './App.css';
import { useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import ParticipantList from './components/ParticipantList';


function App() {


  
  return (
    <div className="App">
      <header className="App-header">
          <h1>Hópurinn</h1>

        <ParticipantList/>
         
      </header>

    </div>
  );
}

export default App;
