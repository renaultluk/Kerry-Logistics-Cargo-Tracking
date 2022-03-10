import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { TextField, Button, Typography, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getDatabase, ref, onValue, onChildAdded } from "firebase/database";

import Header from '../components/Header';

import { db } from '../config/my-firebase';

class BatchesOverview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            batches: [],
        };

        const batchRef = ref(db, 'batches/pending');
        onChildAdded(batchRef, (child) => {
            this.setState([...this.state.batches, child.val()]);
        });
    }
    
    componentDidMount() {}
    
    render() {
        return (
            <>
                <Header />
                <Typography variant="h2">Manage Cargo</Typography>
                <Button
                    onClick={() => this.props.history.push("/batch-info")}
                >
                    Add New Batch
                </Button>
                <DataGrid 
                    columns={[
                        { field: 'batch-id' },
                        { field: 'truck-id' },
                        { field: 'requiresTemp' },
                        { field: 'requiresHumidity' },
                        { field: 'tempLowerBound' },
                        { field: 'tempUpperBound' },
                        { field: 'humidityLowerBound' },
                        { field: 'humidityUpperBound' },
                    ]}
                    rows={this.state.batches}
                />
            </>
        );
    }
}

export default withRouter(BatchesOverview);