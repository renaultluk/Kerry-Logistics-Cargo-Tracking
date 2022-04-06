import React, { Component } from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';

import Login from "./Login";
import Main from "./Main";
// import BatchesOverview from "./BatchesOverview";
// import BatchInfo from "./BatchInfo";
// import CargoInfo from "./CargoInfo";

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
                    <Route exact path="/">
                        <Login showToast={this.showToast} />
                    </Route>
                    <Route path="/main">
                        <Main showToast={this.showToast} />
                    </Route>
                    {/* <Route 
                        exact
                        path="/batches-overview"
                        render={props => <BatchesOverview  showToast={this.showToast} {...props} />}
                    />
                    <Route
                        exact
                        path="batch-info"
                        render={props => <BatchInfo showToast={this.showToast} {...props} />}
                    />
                    <Route
                        exact
                        path="cargo-info"
                        render={props => <CargoInfo showToast={this.showToast} {...props} />}
                    /> */}
                </Switch>
            </div>
            </BrowserRouter>
        );
    }
}

export default Root;