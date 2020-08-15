import React, { Fragment, useEffect, Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Landing from './components/layout/Landing';
import Routes from './components/routing/Routes';
import FilesUploadComponent from './components/profile-forms/UploadImage';

// Redux
import { Provider } from 'react-redux';
import store from './store';
import { loadUser } from './actions/auth';
import setAuthToken from './utils/setAuthToken';

import './App.css';

const App = () => {
  useEffect(() => {
    // keeps running like a loop unless we add [] like at the bottom and it will only load once
    setAuthToken(localStorage.token);
    store.dispatch(loadUser());
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Switch>
            <Route exact path='/' component={Landing} />{' '}
            <Route component={Routes} />{' '}
          </Switch>{' '}
        </Fragment>{' '}
      </Router>{' '}
    </Provider>
  );
};

export default App;
