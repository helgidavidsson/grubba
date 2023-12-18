import './App.css';
import ParticipantList from './components/ParticipantList';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GroupCreator from './components/group_creator/GroupCreator';
import Header from './components/Header';


function App() {

  const ENDPOINT = "http://localhost:3001"; // Replace with your server's address

  
  return (
    <div className="App">
      <Router>
      <Header/>
      <Routes>
        <Route path='/' element={
          <ParticipantList
            ENDPOINT={ENDPOINT}
          />} />
        <Route path='/stillingar' element={
          <GroupCreator 
            ENDPOINT={ENDPOINT}
          />} />
      </Routes>
      
      </Router>
   


    </div>
  );
}

export default App;
