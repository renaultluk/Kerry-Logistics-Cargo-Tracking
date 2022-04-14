import { Button, Typography, Grid, TextField, Checkbox, FormGroup, FormLabel, FormControlLabel } from '@mui/material';
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
                            <Button>
                                Load CSV
                            </Button>
                            <Button onClick={() => history.push(`${url}/cargo?batchID=${batchID}`)} >
                                Add Manually
                            </Button>
                        </Grid>

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