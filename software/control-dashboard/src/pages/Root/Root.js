import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';

import Login from "../Login/Login";
import Main from "../Main/Main";
import CargoInput from "../CargoInput/CargoInput";
import BatchInfo from "../BatchInfo/BatchInfo";

class Root extends Component {
    showToast = (type, message) => {
        switch (type) {
            case 'success':
                toast.success(message);
                break;
            case 'error':
                toast.error(message);
                break;
            case 'warning':
                toast.warning(message);
                break;
            case 'info':
                toast.info(message);
                break;
            default:
                toast.info(message);
                break;
        }
    }
    
    render() {
        return (
            <BrowserRouter>
            <div>
                <ToastContainer 
                    autoClose={5000}
                    position={toast.POSITION.TOP_RIGHT}
                />
                <Switch>
                    <Route 
                        exact 
                        path="/" 
                        render={props => <Login showToast={this.showToast} {...props} />} 
                    />
                    <Route 
                        exact
                        path="/main"
                        render={props => <Main showToast={this.showToast} {...props} />}
                    />
                    <Route 
                        exact
                        path="/cargo-input"
                        render={props => <CargoInput  showToast={this.showToast} {...props} />}
                    />
                    <Route
                        exact
                        path="batch-info"
                        render={props => <BatchInfo showToast={this.showToast} {...props} />}
                    />
                </Switch>
            </div>
            </BrowserRouter>
        );
    }
}