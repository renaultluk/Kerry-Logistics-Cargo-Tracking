import React, { Component } from "react";
import { Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

class Header extends Component {
    logout = () => {
        this.props.history.push("/");
    }
    
    render() {
        return (
            <nav>
                <Typography>Control Dashboard</Typography>
                <Link to="/main">Delivery Status</Link>
                <Link to="/cargo-input">Manage Cargo</Link>
                <Button onClick={this.logout}>Log out</Button>
            </nav>
        );
    }
}

export default Header;