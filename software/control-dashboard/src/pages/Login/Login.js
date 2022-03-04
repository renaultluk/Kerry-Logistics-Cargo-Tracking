import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { TextField, Button, Typography } from "@mui/material";

import logo from "logo.svg";

class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
    }

    componentDidMount() {
        this.checkLogin();
    }

    checkLogin = () => {

    }

    render() {
        <>
            <img src={logo} />
            <Typography variant="h2">Control Dashboard</Typography>
            <TextField
                onChange={(e) => this.setState({ username: e.target.value })}
                label="Username"
                variant="outlined"
                required
            />
            <TextField
                onChange={(e) => this.setState({ password: e.target.value })}
                label="Password"
                variant="outlined"
                type="password"
                required
            />
            <Button
                onClick={() => this.checkLogin()}
            >
                Login
            </Button>
        </>
    }
}

export default withRouter(Login);