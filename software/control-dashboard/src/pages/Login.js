import React, { Component } from "react";
import { withRouter, useHistory } from "react-router-dom";
import { TextField, Button, Typography } from "@mui/material";
import { Container } from "react-bootstrap";

import logo from "../assets/logo.svg";
import styles from "../styles/Login.css";

const Login = () => {
    const [username, setUsername] = React.useState("");
    const [password, setPassword] = React.useState("");
    const history = useHistory();
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         username: "",
    //         password: ""
    //     };
    // }

    // componentDidMount() {
    //     // this.checkLogin();
    // }

    const checkLogin = () => { 
        history.replace("/main");
    }

    // render() {
        return (
            <Container className={styles.loginPageContainer}>
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
                    onClick={checkLogin}
                >
                    Login
                </Button>
            </Container>
        );
    // }
}

export default withRouter(Login);