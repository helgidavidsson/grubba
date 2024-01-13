import './App.css';
import ParticipantList from './components/ParticipantList';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GroupCreator from './components/group_settings/GroupCreator';
import Header from './components/Header';
import Participants from './components/group_settings/Participants';
import Events from './components/group_settings/Events';
import Info from './components/group_settings/Info';
import Outreach from './components/group_settings/Outreach';
import Home from './components/Home';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';

function App() {

  const ENDPOINT = "http://localhost:3001"; // Replace with your server's address

  
  return (
    <div className="App">
<Router>
  <Header />
  <Routes>
    {/* Home route */}
    <Route path='/' element={<Home />} />

    <Route path='/innskraning' element={<SignIn ENDPOINT={ENDPOINT} />} />

    <Route path='/nyskraning' element={<SignUp ENDPOINT={ENDPOINT} />} />


    {/* ParticipantList route */}
    <Route path='/grubba' element={<ParticipantList ENDPOINT={ENDPOINT} />} />

    {/* GroupCreator and its nested routes */}
    <Route path='/stillingar/*' element={<GroupCreator ENDPOINT={ENDPOINT} />}>
      {/* Default route for /stillingar */}
      <Route index element={
        <Info
          ENDPOINT={ENDPOINT}
        />
      } />
      {/* Other nested routes */}
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
      <Route path='vidburdir' element={<Events />} />
      <Route path='tilkynningar' element={
        <Outreach
          ENDPOINT={ENDPOINT}
        />
      }/>
    </Route>
  </Routes>
</Router>

  </div>
  
  );
}

export default App;
