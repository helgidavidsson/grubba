import './App.css';
import { useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import ParticipantList from './components/ParticipantList';

const ENDPOINT = "http://localhost:3000/";

function App() {
  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    socket.on('connect', () => {
      console.log('Connected to server');
    });

    return () => socket.disconnect();
  }, []);

  
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
