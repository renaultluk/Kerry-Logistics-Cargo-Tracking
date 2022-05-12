import { Button, Typography, Grid, TextField, Checkbox, FormGroup, FormLabel, FormControlLabel, requirePropFactory } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useEffect, useState } from 'react';
import { withRouter, useHistory, useRouteMatch, Route, Switch } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import { db } from '../../../config/my-firebase';
import { ref, push, set, get } from 'firebase/database';

import CargoInfo from './cargo-details';

import useQuery from '../../../utils/useQuery';

const BatchInfo = () => {
    const query = useQuery();
    const batchID = query.get('batchID');

    const history = useHistory();

    const { path, url } = useRouteMatch();

    const defaultBatch = {
        id: "",
        address: "",
        requiresTemp: false,
        requiresHumidity: false,
        tempLowerBound: 0,
        tempUpperBound: 0,
        humidityLowerBound: 0,
        humidityUpperBound: 0,
        isFragile: false,
        isUpright: false,
        cargo: []
    }
    
    const [batch, setBatch] = useState(defaultBatch);
    const [file, setFile] = useState();
    const [upload, setUpload] = useState(false);

    const fileReader = new FileReader();

    // const [truckID, setTruckID] = useState("");
    // const [requiresTemp, setRequiresTemp] = useState(false);
    // const [requiresHumidity, setRequiresHumidity] = useState(false);
    // const [tempLowerBound, setTempLowerBound] = useState(0);
    // const [tempUpperBound, setTempUpperBound] = useState(0);
    // const [cargo, setCargo] = useState([]);

    const fetchData = async () => {
        const batchRef = ref(db, `batches/${batchID}`);
        get(batchRef).then((snapshot) => {
            if (snapshot.exists()) {
                const obj = snapshot.val();
                console.log(obj);
                if (!obj['cargo']) {
                    obj['cargo'] = [];
                } else {
                    obj['cargo'] = Object.values(obj['cargo']);
                    obj['cargo'].forEach((cargo) => {
                        cargo['id'] = cargo['cargoID'];
                    })
                }
                setBatch(obj);
            }
        })
    }

    useEffect(() => {
        if (batchID) {
            fetchData().catch((error) => console.log(error));
        }
    }, []);

    const parseCSV = (string) => {
        const csvRows = string.split("\n");

        let csvData = [];

        csvRows.forEach(function (row) {
            if (row.charAt(row.length - 1) === '\r') {
                console.log("\\r detected");
                row = row.slice(0, row.length - 1);
                console.log("new row: ", row);
            }
            const rowArr = row.split(",");
            const resultStr = rowArr[1];
            csvData.push(resultStr);
        })

        const resBatch = {
            id: csvData[0],
            address: csvData[1],
            requiresTemp: !(csvData[2] === "" || csvData[3] === ""),
            requiresHumidity: !(csvData[4] === "" || csvData[5] === ""),
            tempLowerBound: parseInt(csvData[2]),
            tempUpperBound: parseInt(csvData[3]),
            humidityLowerBound: parseInt(csvData[4]),
            humidityUpperBound: parseInt(csvData[5]),
            isFragile: csvData[6] === "Yes",
            isUpright: csvData[7] === "Yes",
            cargo: [],
        }

        setUpload(false);
        setBatch(resBatch);
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

    const handleSave = () => {
        const batchRef = ref(db, `batches/saved/${batchID}`);
        set(batchRef, batch);
        history.goBack();
    }

    const handlePost = () => {
        const newRef = batchID ? ref(db, `batches/${batchID}`) : ref(db, `batches/${batch.id}`);
        batch.deliveryStatus = "pending";
        batch.alertStatus = "none";
        set(newRef, batch);
        history.goBack();
    }
    


    console.log("batch info");

        return (
            <Switch>
                <Route exact path={path}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography variant="h2">Batch Info</Typography>
                        </Grid>
                        <Grid item xs={12}>
                            <FormGroup>
                                <FormControlLabel
                                    label="Batch ID"
                                    control={
                                        <TextField 
                                            value={batch.id} 
                                            onChange={(e) => setBatch({...batch, id: e.target.value})} 
                                        />
                                    }
                                />
                                    <FormControlLabel 
                                        label="Address"
                                        control={
                                            <TextField 
                                                value={batch.address}
                                                onChange={(e) => setBatch({ ...batch, address: e.target.value })}
                                            />
                                        }
                                    />
                                    <FormControlLabel
                                        label="Has Temperature Requirements"
                                        control={
                                            <Checkbox
                                                checked={batch.requiresTemp}
                                                onChange={(e) => setBatch({ ...batch, requiresTemp: e.target.checked })}
                                            />
                                        }
                                        />
                                        { batch.requiresTemp ?
                                            <>
                                                <FormControlLabel
                                                    label="Temperature Lower Bound"
                                                    control={
                                                        <TextField
                                                            value={batch.tempLowerBound}
                                                            onChange={(e) => setBatch({ ...batch, tempLowerBound: e.target.value })}
                                                        />
                                                    }
                                                /> 
                                                <FormControlLabel
                                                    label="Temperature Upper Bound"
                                                    control={
                                                        <TextField
                                                            value={batch.tempUpperBound}
                                                            onChange={(e) => setBatch({ ...batch, tempUpperBound: e.target.value })}
                                                        />
                                                    }
                                                />
                                            </> :
                                            null
                                        }
                                    <FormControlLabel
                                        label="Has Humidity Requirements"
                                        control={
                                            <Checkbox
                                                checked={batch.requiresHumidity}
                                                onChange={(e) => setBatch({ ...batch, requiresHumidity: e.target.checked })}
                                            />
                                        }
                                    />
                                    { batch.requiresHumidity ?
                                        <>
                                            <FormControlLabel
                                                label="Humidity Lower Bound"    
                                                control={
                                                    <TextField
                                                        value={batch.humidityLowerBound}
                                                        onChange={(e) => setBatch({ ...batch, humidityLowerBound: e.target.value })}
                                                    />
                                                }  
                                            />
                                            <FormControlLabel
                                                label="Humidity Upper Bound"
                                                control={
                                                    <TextField
                                                        value={batch.humidityUpperBound}
                                                        onChange={(e) => setBatch({ ...batch, humidityUpperBound: e.target.value })}
                                                    />
                                                }
                                            />
                                        </> :
                                        null
                                    }
                                    <FormControlLabel
                                        label="Is Fragile"
                                        control={
                                            <Checkbox
                                                checked={batch.isFragile}
                                                onChange={(e) => setBatch({ ...batch, isFragile: e.target.checked })}
                                            />
                                        }
                                    />
                                    <FormControlLabel
                                        label="Needs to be Upright"
                                        control={
                                            <Checkbox
                                                checked={batch.isUpright}
                                                onChange={(e) => setBatch({ ...batch, isUpright: e.target.checked })}
                                            />
                                        }
                                    />
                            </FormGroup>
                        </Grid>

                        {/* <Grid item xs={12}>
                            <Button onClick={() => setUpload(!upload)}>
                                Load CSV
                            </Button>
                            <Button onClick={() => history.push(`${url}/cargo?batchID=${batchID}`)} >
                                Add Manually
                            </Button>
                        </Grid> */}

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

                        {
                            batch.cargo.length > 0 ?
                                <Grid item xs={12}>
                                    <div style={{ height: '500px' }}>
                                        <DataGrid
                                            columns={[
                                                { field: 'cargoID', headerName: 'Cargo ID' },
                                                // { field: 'isFragile', headerName: 'Is Fragile' },
                                                // { field: 'isUpright', headerName: 'Needs to be Upright' },
                                            ]}
                                            rows={batch.cargo}
                                            onRowDoubleClick={(row) => {
                                                history.push(`${url}/cargo?cargoID=${row.id}&batchID=${batchID}`);
                                            }}
                                        />
                                    </div>
                                </Grid>
                                : null
                        }

                        <Grid item xs={12}>
                            <Button
                                onClick={
                                    () => {
                                        setBatch(defaultBatch);
                                        history.goBack();
                                    }
                                }
                            >
                                Cancel
                            </Button>
                            <Button onClick={handleSave}>
                                Save
                            </Button>
                            <Button onClick={handlePost}>
                                Post
                            </Button>
                        </Grid>
                    </Grid>
                </Route>
                <Route path={`${path}/cargo`}>
                    <CargoInfo />
                </Route>
            </Switch>
        );
    // }
}

export default withRouter(BatchInfo);