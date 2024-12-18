import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home.jsx';
import SignUp from './components/SignUp.jsx';
import Login from './components/Login.jsx';
import Donors from './components/Donors.jsx';
import Profile from './components/Profile.jsx';
import UpdateProfile from './components/UpdateProfile.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        <Route path="/donors" element={<Donors />} />
        <Route path="/profile" element={<Profile />} />
        <Route path='/updateprofile' element={<UpdateProfile/>}/>
      </Routes>
    </Router>
  );
}

export default App;

