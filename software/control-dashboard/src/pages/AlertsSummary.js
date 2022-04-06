import { withRouter } from 'react-router-dom';
import { TextField, Button, Typography, Grid, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

const AlertsSummary = () => {
    console.log("logged in")
    
    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h2">Delivery Status</Typography>
                    <Button>Export Daily Report</Button>
                    <Button>Reload</Button>
                </Grid>
                <Grid item xs={12}>
                    <div style={{ height: '500px', width: '100%'}}>
                        <DataGrid
                            columns={[
                                { field: 'cargo-id', headerName: 'Cargo ID' },
                                { field: 'truck-id', headerName: 'Truck ID' },
                                { field: 'time', headerName: 'Time of Occurrence' },
                                { field: 'issue', headerName: 'Issue' },
                                { field: 'data', headerName: 'Data' },
                            ]}
                        />
                    </div>
                </Grid>
            </Grid>
        </>
    )
}

export default withRouter(AlertsSummary)