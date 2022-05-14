import React, { Component } from "react";
import { withRouter, useHistory } from "react-router-dom";
import { TextField, Button, Typography } from "@mui/material";
import { Container } from "react-bootstrap";

import { db, messaging } from "../config/my-firebase";
import { getToken } from "firebase/messaging";
import { ref, set } from "firebase/database";

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

    const checkLogin = async () => { 
        getToken(messaging, {vapidKey: "BE5gM-IB9yqZQrO6J9Xztymin5Dk5Xy2Ha7ow_wfnT22WmXCDRLjOVZ5gil3XElb_rUMCXxnhvdCYWs65lJTlB0"}).then(
            (token) => {
                if (token) {
                    console.log(token);
                    const FCMRef = ref(db, 'dashboardFCMToken');
                    set(FCMRef, token);
                } else {
                    console.log('No Instance ID token available. Request permission to generate one.');
                }
            }
        ).catch((error) => {
            console.log(error);
        });
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