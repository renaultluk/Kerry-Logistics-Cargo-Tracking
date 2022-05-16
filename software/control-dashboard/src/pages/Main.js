import React, { Component } from 'react';
import { withRouter, Switch, Route, Link, BrowserRouter } from 'react-router-dom';
import { TextField, Button, Typography, Grid, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { Tabs, Tab } from 'react-bootstrap';

import AlertsSummary from './AlertsSummary';
import BatchesOverview from './batch/index';

import Header from '../components/Header';

const Main = () => {
    // getIssues = () => {}

    // render() {
        return (
            <>
                {/* <Tabs defaultActiveKey="alerts-summary"> */}
                <Tabs defaultActiveKey="batches-overview">
                    <Tab eventKey="alerts-summary" title="Delivery Status">
                        <AlertsSummary />
                    </Tab>
                    <Tab eventKey="batches-overview" title="Manage Cargo">
                        <BatchesOverview />
                    </Tab>
                </Tabs>
            </>
        );
    // }
}

export default withRouter(Main);