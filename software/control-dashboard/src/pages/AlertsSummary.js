import { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { TextField, Button, Typography, Grid, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

import { db } from '../config/my-firebase';
import { ref, onValue, onChildAdded, get, child } from "firebase/database";

import ReactPDF from '@react-pdf/renderer';

const AlertsSummary = () => {
    console.log("logged in");
    const [alerts, setAlerts] = useState([]);

    const fetchData = async () => {
        const alertRef = ref(db, 'issues/pending');
        get(alertRef).then((snapshot) => {
            if (snapshot.exists()) {
                const obj = snapshot.val();
                obj.shift();
                const alertValues = obj;
                alertValues.forEach((alert, index) => {
                    alert['id'] = index;
                })
                console.log(alertValues);
                setAlerts(alertValues);
            }
        })
    }

    useEffect(() => {
        fetchData().catch((error) => console.log(error));
    }, [])

    const exportReport = () => {
        const d = new Date();
        const date = d.toLocaleDateString();
        ReactPDF.render(<Report />, `${__dirname}/report-${date}.pdf`);
    }
    
    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h2">Delivery Status</Typography>
                    <Button onClick={exportReport}>Export Daily Report</Button>
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
                            rows={alerts}
                        />
                    </div>
                </Grid>
            </Grid>
        </>
    )
}

export default withRouter(AlertsSummary)