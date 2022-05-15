import { useState, useEffect } from 'react';
import { withRouter, Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';
import { TextField, Button, Typography, Grid, ButtonBase } from '@mui/material';
import { Container } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import { getDatabase, ref, onValue, onChildAdded, get, child, set } from "firebase/database";
import { toast } from 'react-toastify';

import Header from '../../components/Header';
import BatchInfo from './cargo/index';

import { db } from '../../config/my-firebase';
import { Link } from 'react-router-dom';

const BatchesOverview = () => {
    const { path, url } = useRouteMatch();
    const [batches, setBatches] = useState([]);
    const [file, setFile] = useState();
    const [upload, setUpload] = useState(false);
    const history = useHistory();
    const fileReader = new FileReader();

    const fetchData = async () => {
        const batchRef = ref(db, 'batches');
        get(batchRef).then((snapshot) => {
            if (snapshot.exists()) {
                const obj = snapshot.val();
                console.log(obj);
                const arrKeys = Object.keys(obj);
                const objArr = Object.values(obj);
                objArr.forEach((batch, index) => {
                    batch['batchID'] = arrKeys[index];
                    batch['id'] = index;
                });
                setBatches(objArr);
            }
        })
    }

    const parseCSV = (string) => {
        var csvRows = string.split("\n");
        csvRows = csvRows.slice(1);
        console.log('csvRows: ', csvRows);

        csvRows.forEach(function (row) {
            if (row.charAt(row.length - 1) === '\r') {
                console.log("\\r detected");
                row = row.slice(0, row.length - 1);
                console.log("new row: ", row);
            }
            const rowArr = row.split(",");
            console.log('rowArr: ', rowArr);
            
            const resBatch = {
                id: rowArr[0],
                address: rowArr[1],
                requiresTemp: rowArr[3] === "Yes",
                requiresHumidity: rowArr[4] === "Yes",
                tempLowerBound: !isNaN(parseInt(rowArr[5])) ? parseInt(rowArr[5]) : 0,
                tempUpperBound: !isNaN(parseInt(rowArr[6])) ? parseInt(rowArr[6]) : 0,
                humidityLowerBound: !isNaN(parseInt(rowArr[7])) ? parseInt(rowArr[7]) : 0,
                humidityUpperBound: !isNaN(parseInt(rowArr[8])) ? parseInt(rowArr[8]) : 0,
                isFragile: rowArr[9] === "Yes",
                isUpright: rowArr[10] === "Yes",
                cargo: [],
                deliveryStatus: "pending",
            }
            console.log('resBatch: ', resBatch);

            const newRef = ref(db, `batches/${resBatch.id}`);
            set(newRef, resBatch);

            toast.success(`Batch ${resBatch.id} added`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        })


        setUpload(false);
    }

    const CSVOnChange = (e) => {
        setFile(e.target.files[0]);
        // loadCSV(e);
    }

    const loadCSV = (e) => {
        e.preventDefault();

        if (file) {
            console.log("file found");
            fileReader.onload = function (event) {
                console.log("file reader loaded");
                const csvOutput = event.target.result;
                parseCSV(csvOutput);
            }
            fileReader.readAsText(file);
        }

    }

    useEffect(() => {
        fetchData().catch((error) => console.log(error));

        const batchesListenerRef = ref(db, 'batches');
        onValue(batchesListenerRef, (snapshot) => {
            if (snapshot.exists()) {
                const obj = snapshot.val();
                console.log(obj);
                const arrKeys = Object.keys(obj);
                const objArr = Object.values(obj);
                objArr.forEach((batch, index) => {
                    batch['batchID'] = arrKeys[index];
                    batch['id'] = index;
                });
                setBatches(objArr);
            }
        });

        return () => {
            batchesListenerRef.off();
        }
    }, []);

    return (
        <>
            <Switch>
                <Route exact path={path}>
                    <Typography variant="h2">Manage Cargo</Typography>
                    <Button onClick={() => history.push(`${url}/batch`)}>
                        Add New Batch
                    </Button>
                    <Button onClick={() => setUpload(!upload)}>
                        Upload CSV
                    </Button>
                    { upload ?
                        <div>

                            <input
                                type="file"
                                accept=".csv"
                                onChange={CSVOnChange}
                            />
                            <Button
                                onClick={e => loadCSV(e)}
                            >
                                Submit
                            </Button>
                        </div>
                        : null
                    }
                    <div style={{ height: 500 }}>
                        <DataGrid 
                            columns={[
                                { field: 'batchID', headerName: 'Batch ID' },
                                { field: 'address', headerName: 'Address' },
                                { field: 'deliveryStatus', headerName: 'Delivery Status' },
                                { field: 'requiresTemp', headerName: 'Has Temperature Requirements' },
                                { field: 'requiresHumidity', headerName: 'Has Humidity Requirements' },
                                { field: 'tempLowerBound', headerName: 'Temperature Lower Bound' },
                                { field: 'tempUpperBound', headerName: 'Temperature Upper Bound' },
                                { field: 'humidityLowerBound', headerName: 'Humidity Lower Bound' },
                                { field: 'humidityUpperBound', headerName: 'Humidity Upper Bound' },
                                { field: 'isFragile', headerName: 'Is Fragile' },
                                { field: 'isUpright', headerName: 'Needs to be Upright' },
                            ]}
                            rows={batches}
                            onRowDoubleClick={(row) => {
                                history.push(`${url}/batch?batchID=${row.row.batchID}`);
                            }}
                        />
                    </div>

                </Route>
                <Route path={`${path}/batch`}>
                    <BatchInfo />
                </Route>
            </Switch>
        </>
    );
}

export default withRouter(BatchesOverview);