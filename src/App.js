import './App.css';
import ParticipantList from './components/ParticipantList';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GroupCreator from './components/group_creator/GroupCreator';
import Header from './components/Header';
import Participants from './components/group_creator/Participants';
import Events from './components/group_creator/Events';
import Info from './components/group_creator/Info';

function App() {

  const ENDPOINT = "http://localhost:3001"; // Replace with your server's address

  
  return (
    <div className="App">
    <Router>
      <Header />
      <Routes>
        <Route path='/' element={<ParticipantList ENDPOINT={ENDPOINT} />} />
        <Route path='/stillingar/*' element={<GroupCreator ENDPOINT={ENDPOINT} />}>
          {/* Default route for /stillingar */}
          <Route index element={
             <Info
               ENDPOINT={ENDPOINT}
             />
          } />
          {/* Specific route for /stillingar/upplysingar */}
          <Route path='upplysingar' element={
             <Info
               ENDPOINT={ENDPOINT}
             />
          } />
          <Route path='medlimir' element={
            <Participants
              ENDPOINT={ENDPOINT}
            />
          } />
          <Route path='vidburdir' element={
            <Events />
          } />
        </Route>
      </Routes>
    </Router>
  </div>
  
  );
}

export default App;
