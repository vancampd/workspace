import './App.scss';
import {BrowserRouter as Router, Switch, Route, Redirect} from 'react-router-dom';
import HomePage from './pages/HomePage';
import Header from './components/Header';


// Need to import Component and change this to a class component if I need state in App.js
function App() {
  return (
    <div className="App">
      <Router>
        <Header/>
        <Switch>
          <Route exact path='/' component={HomePage}/>
          {/* <Route exact path='/listings' component={ListingsPage}/> */}
          <Route path='listings/map' component={Map} />
          {/* <Route path='listings/:listingID' component={IndividualListing} /> */}
          <Redirect from='/home' to='/' />
        </Switch>
      </Router>
      
    </div>
  );
}

export default App;
