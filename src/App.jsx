import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home/Home';
import SignUp from './pages/SignUp/SignUp';
import Login from './pages/Login/Login';
import Navbar from './components/NavBar/Navbar';
import { Logout } from './components/Logout/Logout';
import Group from './pages/Group/Group';

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
      </Routes>
    </main>
  );
}

export default App;
