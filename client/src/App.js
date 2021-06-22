import './App.scss';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import Footer from './components/Footer';
import ListingsPage from './pages/ListingsPage';
import IndividualListing from './pages/IndividualListing';
import UploadPage from './pages/UploadPage';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import {useState} from 'react';


function App() {

  const [showLogin, setShowLogin] = useState(false)
  const [showRegister, setShowRegister] = useState(false)
  const [signedIn, setSignedIn] = useState(false)

  return (
    <div className="App">
      <Router>
        <Header showLogin={showLogin} setShowLogin={setShowLogin} showRegister={showRegister} setShowRegister={setShowRegister} signedIn={signedIn} setSignedIn={setSignedIn}/>
        <Switch>
          <Route exact path='/home' component={HomePage}/>
          <Route path='/listings/:city/:listingID' render={(routerProps) => <IndividualListing signedIn={signedIn} {...routerProps}/>} />
          <Route path='/listings/:city' component={ListingsPage}/>
          <Route path='/favorites' component={ListingsPage}/>
          <Route path='/post' component={UploadPage}/>
          <Route path='/register' component={SignUp}/>
          <Route path='/login' component={Login}/>
          <Redirect from='/' to='/home' />
        </Switch>
        <Footer/>
      </Router>
      
    </div>
  );
}

export default App;
