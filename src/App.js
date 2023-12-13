import './App.css';
import { useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import ParticipantList from './components/ParticipantList';

const ENDPOINT = "https://6578f347fdd19b26eb2d574d--regal-douhua-84bd69.netlify.app/"; // Replace with your server's address

function App() {
  useEffect(() => {
    const newSocket = socketIOClient(ENDPOINT);
    setSocket(newSocket);

    newSocket.on('initialState', (initialParticipants) => {
        setParticipants(initialParticipants);
    });

    newSocket.on('participantToggled', (data) => {
        setParticipants(prevParticipants =>
            prevParticipants.map(p =>
                p.id === data.id ? { ...p, isChecked: data.isChecked } : p
            )
        );
    });

    return () => newSocket.disconnect();
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
