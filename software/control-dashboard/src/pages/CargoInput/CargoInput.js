import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { TextField, Button, Typography, Grid, DataGrid } from '@mui/material';

class CargoInput extends Component {
    componentDidMount() {}
    
    render() {
        <>
            <Typography variant="h2">Cargo Input</Typography>
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
    }
}

export default withRouter(CargoInput);