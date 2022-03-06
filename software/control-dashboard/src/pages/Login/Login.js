import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { TextField, Button, Typography } from "@mui/material";

import "./Login.css";
import logo from "../../assets/logo.svg";

class Login extends Component {
    
    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: ""
        };
    }

    componentDidMount() {
        // this.checkLogin();
    }

    checkLogin = () => { 
        this.props.history.push("/main");
    }

    render() {
        return (
            <div class="login-container">
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
            </div>
        );
    }
}

export default withRouter(Login);