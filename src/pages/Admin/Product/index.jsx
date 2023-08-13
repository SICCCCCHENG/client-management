import React, {Component} from 'react';
import {Redirect, Route, Switch} from "react-router-dom";
import AddUpdate from "./AddUpdate";
import Detail from "./Detail";
import ProductHome from "./ProductHome";

class Product extends Component {
    render() {
        return (
            <Switch>
                <Route path='/product/addupdate' component={AddUpdate}/>
                <Route path='/product/detail' component={Detail}/>
                <Route path='/product' component={ProductHome}/>
                <Redirect to='/product'/>
            </Switch>
        )
    }
}

export default Product;