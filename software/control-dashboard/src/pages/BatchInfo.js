import { Button, Typography, Grid, TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class BatchInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {}
    
    render() {
        return (
            <>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Button>
                            <Typography variant="h2">Batch Info</Typography>
                        </Button>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography variant="h4">Batch ID: {this.props.batch.batchID}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h4">Truck ID: {this.props.batch.truckID}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h4">Requires Temperature: {this.props.batch.requiresTemp}</Typography>
                                <Typography variant="h4">Requires Humidity: {this.props.batch.requiresHumidity}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h4">Temperature Lower Bound: {this.props.batch.tempLowerBound}</Typography>
                                <Typography variant="h4">Temperature Upper Bound: {this.props.batch.tempUpperBound}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="h4">Humidity Lower Bound:</Typography>
                                <Typography variant="h4">Humidity Upper Bound:</Typography>
                            </Grid>
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Button>
                            Load CSV
                        </Button>
                        <Button onClick={() => this.props.history.push("/cargo-info")} >
                            Add Manually
                        </Button>
                    </Grid>

                    <Grid item xs={12}>
                        <DataGrid />
                    </Grid>

                    <Grid item xs={12}>
                        <Button>
                            Cancel
                        </Button>
                        <Button>
                            Save
                        </Button>
                        <Button>
                            Post
                        </Button>
                    </Grid>
                </Grid>

            </>
        );
    }
}

export default withRouter(BatchInfo);