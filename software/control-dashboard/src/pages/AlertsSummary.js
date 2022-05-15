import { useState, useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { TextField, Button, Typography, Grid, Paper } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { toast } from 'react-toastify';
// var xl = require('excel4node');

import { db, functions } from '../config/my-firebase';
import { ref, onValue, onChildAdded, get, child } from "firebase/database";
import { httpsCallable, connectFunctionsEmulator } from 'firebase/functions';

// import ReactPDF from '@react-pdf/renderer';
// import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
// import Report from '../components/Report';
import ReportCSV from '../components/ReportCSV';

const AlertsSummary = () => {
    console.log("logged in");
    const [alerts, setAlerts] = useState([]);
    const [reportData, setReportData] = useState([]);

    const fetchData = async () => {
        const alertRef = ref(db, 'issues');
        get(alertRef).then((snapshot) => {
            if (snapshot.exists()) {
                const obj = snapshot.val();
                // obj.shift();
                const alertKeys = Object.keys(obj);
                const alertValues = Object.values(obj);
                alertValues.forEach((alert, index) => {
                    alert['alertID'] = alertKeys[index];
                    alert['id'] = index;
                })
                console.log(alertValues);
                setAlerts(alertValues);
            }
        })
    }

    const fetchReportData = async () => {
        const reportRef = ref(db, 'issues/pending');
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
                // obj.shift();
                const alertValues = obj;
                // alertValues.forEach((alert, index) => {
                //     alert['id'] = index;
                // })
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

        // return () => alertListenerRef.off();
    }, [])

    const exportReport = async () => {
        const callReport = httpsCallable(functions, 'exportReport');
        callReport().then((result) => {
            console.log(result);
            // const reportData = result.data;

            // const wb = new xl.Workbook();
            // const generalSheet = wb.addWorksheet('General');
            // const alertSheet = wb.addWorksheet('Alerts');

            // for (let i = 0; i < reportData.general.length; i++) {
            //     for (let j = 0; j < reportData[i].general.length; j++) {
            //         generalSheet.cell(i + 1, j + 1).string(reportData.general[i][j]);
            //     }
            // }

            // wb.write('Report.xlsx');
        })
    }
    
    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Typography variant="h2">Delivery Status</Typography>
                    <Button onClick={exportReport}>Export Daily Report</Button>
                    {/* <PDFDownloadLink document={<Report />} fileName="report.pdf">
                        {({ blob, url, loading, error }) => (loading ? 'Loading document...' : 'Export Daily Report')}
                    </PDFDownloadLink> */}
                    {/* <ReportCSV /> */}
                    <Button>Reload</Button>
                </Grid>
                {/* <PDFViewer>
                    <Report />
                </PDFViewer> */}
                <Grid item xs={12}>
                    <div style={{ height: '500px', width: '100%'}}>
                        <DataGrid
                            columns={[
                                { field: 'alertID', headerName: 'Alert ID' },
                                { field: 'time', headerName: 'Time of Occurence' },
                                { field: 'cargoID', headerName: 'Cargo ID' },
                                { field: 'batchID', headerName: 'Batch ID' },
                                { field: 'issue', headerName: 'Issue' },
                                { field: 'resolved', headerName: 'Resolved?' },
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