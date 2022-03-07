import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { TextField, Button, Typography, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getDatabase, ref, onValue } from "firebase/database";

import Header from '../components/Header';

import { db } from '../config/firebase';

class BatchesOverview extends Component {
    constructor(props) {
        super(props);
        this.state = {
            batches: [],
        };
    }
    
    componentDidMount() {}

    getBatches = () => {
        const batchRef = ref(db, 'batches/pending');
        onValue(batchRef, (snapshot) => {
            const map = snapshot.val();
            const result= Object.keys(map).map((key) => map[key]);
            this.setState({ batches: result });
        });
    }
    
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