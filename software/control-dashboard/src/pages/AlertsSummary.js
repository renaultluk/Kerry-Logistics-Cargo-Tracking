import { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { TextField, Button, Typography, Grid, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-toastify';

import { db } from '../config/my-firebase';
import { ref, onValue, onChildAdded, get, child } from "firebase/database";

// import ReactPDF from '@react-pdf/renderer';
// import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
// import Report from '../components/Report';
// import ReportCSV from '../components/ReportCSV';

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

        const alertListenerRef = ref(db, 'issues/pending');
        onValue(alertListenerRef, (snapshot) => {
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
        onChildAdded(alertListenerRef, (snapshot) => {
            if (snapshot.exists()) {
                const obj = snapshot.val();
                obj.shift();
                const alertValues = obj;
                alertValues.forEach((alert, index) => {
                    alert['id'] = index;
                })
                toast.error("New issue", {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                })
                console.log(alertValues);
                setAlerts(alertValues);
            }
        })

        return () => alertListenerRef.off();
    }, [])

    const exportReport = () => {
        const d = new Date();
        const date = d.toLocaleDateString();
        // ReactPDF.render(<Report />, `${__dirname}/report-${date}.pdf`);
    }
    
    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h2">Delivery Status</Typography>
                    {/* <Button onClick={exportReport}>Export Daily Report</Button> */}
                    {/* <PDFDownloadLink document={<Report />} fileName="report.pdf">
                        {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Export Daily Report')}
                    </PDFDownloadLink>
                    <ReportCSV /> */}
                    <Button>Reload</Button>
                </Grid>
                {/* <PDFViewer>
                    <Report />
                </PDFViewer> */}
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