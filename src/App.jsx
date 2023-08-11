import React, {Component} from 'react';
import {Switch, Route} from 'react-router-dom'
import Login from "./pages/Login";
import Admin from "./pages/Admin";


class App extends Component {
    render() {

        return (
            <Switch>
                <Route path='/login' component={Login}/>
                <Route path='/' component={Admin}/>
            </Switch>
        );
    }
}

export default App;