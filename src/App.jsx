import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home';
import SignUp from './pages/SignUp/SignUp';
import Login from './pages/Login/Login';
import Navbar from './components/NavBar/Navbar';
import { Logout } from './components/Logout/Logout';
import Group from './pages/Group/Group';
import EventDetail from './pages/EventDetail/EventDetail';

function App() {
  return (
    <main className="App">
      <Navbar />
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/register' element={<SignUp/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/logout' element={<Logout/>}/>
        <Route path='/groupdetailpage/:groupCode' element={ <Group /> }/>
        <Route path='/event/:eventId' element={ <EventDetail /> }/>
      </Routes>
    </main>
  );
}

export default App;
