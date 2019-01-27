import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';

import configureStore from 'store/configureStore';
import App from './components/App/App';
import Auth from './components/Auth/Auth';

// Set up redux store
export const store = configureStore();

// Set up router history
export const history = createBrowserHistory();

// This hooks into the navigation event and scrolls page to top
history.listen((location) => {
  window.scrollTo(0,0);
})

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}> 
            <div>
                <Route path='/signin' component={Auth}></Route>
                <Route path='/signout' component={Auth}></Route>
                <Route path='/' component={App}></Route>
            </div>
        </Router>
    </Provider>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
