import React, { Component } from "react";
import { Button, Typography, Paper } from "@mui/material";
import { Link } from "react-router-dom";

// import styles from "../styles/Header.scss";

class Header extends Component {
    logout = () => {
        this.props.history.push("/");
    }
    
    render() {
        return (
            <nav>
                <Typography>Control Dashboard</Typography>
                <Paper>
                    <Button onClick={() => this.props.history.push("/main")}>Delivery Status</Button>
                    <Button onClick={() => this.props.history.push("/batches-overview")}>Manage Cargo</Button>
                </Paper>
                <Button onClick={this.logout}>Log out</Button>
            </nav>
        );
    }
}

export default Header;