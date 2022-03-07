import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { TextField, Button, Typography, Grid, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import Header from '../components/Header';

class Main extends Component {
    getIssues = () => {}

    render() {
        return (
            <>
                <Header history={this.props.history} />
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h2">Delivery Status</Typography>
                        <Button>Export Daily Report</Button>
                        <Button>Reload</Button>
                    </Grid>
                    <Grid item xs={12}>
                        <DataGrid
                            columns={[
                                { field: 'Cargo ID' },
                                { field: 'Truck ID' },
                                { field: 'Time of Occurrence' },
                                { field: 'Issue' },
                                { field: 'Data' },
                            ]}
                        />
                    </Grid>
                </Grid>
            </>
        );
    }
}

export default withRouter(Main);