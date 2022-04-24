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
        batchID: "",
        // truckID: "",
        requiresTemp: false,
        requiresHumidity: false,
        tempLowerBound: 0,
        tempUpperBound: 0,
        humidityLowerBound: 0,
        humidityUpperBound: 0,
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
        const batchRef = ref(db, `batches/pending/${batchID}`);
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
        const csvAllRows = string.split("\n");

        let csvBatchGeneral = csvAllRows.slice(0,5);
        let csvCargoRows = csvAllRows.slice(7);
        let resBatchGeneral = []
        let resCargoRows = []

        csvBatchGeneral.forEach(function (row) {
            const rowArr = row.split(',');
            console.log(rowArr, rowArr[1]);
            const resultStr = rowArr[1];
            resBatchGeneral.push(resultStr);
        })
        console.log("csvBatchGeneral: ",csvBatchGeneral);
        console.log("resBatchGeneral: ", resBatchGeneral);
        const csvTempLower = resBatchGeneral[1];
        const csvTempUpper = resBatchGeneral[2];
        const csvTempReq = !(csvTempLower === '' || csvTempUpper === '');
        const csvHumdLower = resBatchGeneral[3];
        const csvHumdUpper = resBatchGeneral[4];
        const csvHumdReq = !(csvHumdLower === '' || csvHumdUpper === '');

        console.log(csvCargoRows);
        csvCargoRows.forEach(row => {
            if (row.charAt(row.length - 1) === '\r') {
                console.log("\\r detected");
                row = row.slice(0, row.length - 1);
                console.log("new row: ", row);
            }
            const rowArr = row.split(",");
            resCargoRows.push({
                cargoID: rowArr[0],
                id: rowArr[0],
                isFragile: rowArr[1] === "Yes", 
                isUpright: rowArr[2] === "Yes"
            });
        })

        console.log("CSV parsed");
        
        const resBatch = {
            batchID: resBatchGeneral[0],
            requiresTemp: csvTempReq,
            requiresHumidity: csvHumdReq,
            tempLowerBound: csvTempLower,
            tempUpperBound: csvTempUpper,
            humidityLowerBound: csvHumdLower,
            humidityUpperBound: csvHumdUpper,
            cargo: resCargoRows
        }

        console.log(resBatch);

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
        const batchRef = ref(db, `batches/pending`);
        const newRef = batchID ? ref(db, `batches/pending/${batchID}`) : push(batchRef);
        batch.batchID = newRef.key;
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
                                            value={batch.batchID} 
                                            onChange={(e) => setBatch({...batch, batchID: e.target.value})} 
                                        />
                                    }
                                />
                                    {/* <FormControlLabel 
                                        label="Truck ID"
                                        control={
                                            <TextField 
                                                value={batch.truckID}
                                                onChange={(e) => setBatch({ ...batch, truckID: e.target.value })}
                                            />
                                        }
                                    /> */}
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
                            </FormGroup>
                        </Grid>

                        <Grid item xs={12}>
                            <Button onClick={() => setUpload(!upload)}>
                                Load CSV
                            </Button>
                            <Button onClick={() => history.push(`${url}/cargo?batchID=${batchID}`)} >
                                Add Manually
                            </Button>
                        </Grid>

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

                        <Grid item xs={12}>
                            <div style={{ height: '500px' }}>
                                <DataGrid
                                    columns={[
                                        { field: 'cargoID', headerName: 'Cargo ID' },
                                        { field: 'isFragile', headerName: 'Is Fragile' },
                                        { field: 'isUpright', headerName: 'Needs to be Upright' },
                                    ]}
                                    rows={batch.cargo}
                                    onRowDoubleClick={(row) => {
                                        history.push(`${url}/cargo?cargoID=${row.id}&batchID=${batchID}`);
                                    }}
                                />
                            </div>
                        </Grid>

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