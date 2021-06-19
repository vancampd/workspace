import './App.scss';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import HomePage from './pages/HomePage';
import Header from './components/Header';
import Footer from './components/Footer';
import ListingsPage from './pages/ListingsPage';
import IndividualListing from './pages/IndividualListing';
import UploadPage from './pages/UploadPage';

// Need to import Component and change this to a class component if I need state in App.js
function App() {
  return (
    <div className="App">
      <Router>
        <Header/>
        <Switch>
          <Route exact path='/home' component={HomePage}/>
          <Route path='/listings/:listingID' component={IndividualListing} />
          <Route path='/listings' component={ListingsPage}/>
          <Route path='/favorites' component={ListingsPage}/>
          <Route path='/post' component={UploadPage}/>
          <Redirect from='/' to='/home' />
        </Switch>
        <Footer/>
      </Router>
      
    </div>
  );
}

export default App;
