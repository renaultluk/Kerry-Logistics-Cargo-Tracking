import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { TextField, Button, Typography, Grid } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import Header from '../../components/Header';

class CargoInput extends Component {
    componentDidMount() {}
    
    render() {
        return (
            <>
                <Header />
                <Typography variant="h2">Manage Cargo</Typography>
                <Button>Add New Batch</Button>
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
                />
            </>
        );
    }
}

export default withRouter(CargoInput);