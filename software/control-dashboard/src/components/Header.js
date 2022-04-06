import React, { Component } from "react";
import { Button, Typography, Paper } from "@mui/material";
import { Switch, Route, Link } from "react-router-dom";
import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import { LinkContainer } from "react-router-bootstrap";

// import styles from "../styles/Header.scss";

import AlertsSummary from "../pages/AlertsSummary";
import BatchesOverview from "../pages/batch/index";

class Header extends Component {
    logout = () => {
        this.props.history.push("/");
    }
    
    render() {
        return (
            <>
                <Navbar>
                    {/* <Typography>Control Dashboard</Typography>
                    <Paper>
                        <Button onClick={() => this.props.history.push("/main")}>Delivery Status</Button>
                        <Button onClick={() => this.props.history.push("/batches-overview")}>Manage Cargo</Button>
                    </Paper>
                    <Button onClick={this.logout}>Log out</Button> */}
                    <Navbar.Brand href="/main">Control Dashboard</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav>
                                    <Nav.Link>
                                <Link to="/alerts-summary">
                                        Delivery Status
                                </Link>
                                    </Nav.Link>
                                <Nav.Link to="/batch">Manage Cargo</Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Navbar>
                <Switch> 
                    <Route
                        path="/alerts-summary"
                        render={props => <AlertsSummary showToast={this.showToast} {...props} />}
                    />
                    <Route path="/batch">
                        <BatchesOverview />
                    </Route>
                </Switch>
            </>
        );
    }
}

export default Header;