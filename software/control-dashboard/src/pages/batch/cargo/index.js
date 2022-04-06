import { Button, Typography, Grid, TextField, Switch } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import { db } from '../../../config/my-firebase';
import { ref, push, set } from 'firebase/database';

import useQuery from '../../../utils/useQuery';

const BatchInfo = (props) => {
    const query = useQuery();
    const batchID = query.get('batchID');

    const history = useHistory();

    const defaultBatch = {
        batchID: "",
        truckID: "",
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
    


    console.log("batch info");

        return (
            <>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Typography variant="h2">Batch Info</Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography>
                                    {
                                        batchID ?
                                            `Batch ID: ${batch.batchID}` :
                                            "New Batch"
                                    }
                                </Typography>
                                
                            </Grid>
                            <Grid item xs={12}>
                                <Typography>Truck ID: </Typography>
                                <TextField
                                    label="Truck ID"
                                    value={batch.truckID}
                                    onChange={(e) => {
                                        setBatch({
                                            ...batch,
                                            truckID: e.target.value
                                        });
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Typography>Requires Temperature: </Typography>
                                <Switch
                                    checked={batch.requiresTemp}
                                    onChange={(e) => {
                                        setBatch({
                                            ...batch,
                                            requiresTemp: e.target.checked
                                        });
                                    }}
                                    />
                                    {batch.requiresTemp ? 
                                        <Grid item xs={12}>
                                            <Typography>Temperature Lower Bound: {batch.tempLowerBound}</Typography>
                                            <TextField
                                                label="Temperature Lower Bound"
                                                value={batch.tempLowerBound}
                                                onChange={(e) => {
                                                    setBatch({
                                                        ...batch,
                                                        tempLowerBound: e.target.value
                                                    });
                                                }}
                                            />
                                            <Typography>Temperature Upper Bound: {batch.tempUpperBound}</Typography>
                                            <TextField
                                                label="Temperature Upper Bound"
                                                value={batch.tempUpperBound}
                                                onChange={(e) => {
                                                    setBatch({
                                                        ...batch,
                                                        tempUpperBound: e.target.value
                                                    });
                                                }}
                                            />
                                        </Grid> :
                                        null
                                    }
                                <Typography>Requires Humidity: </Typography>
                                <Switch
                                    checked={batch.requiresHumidity}
                                    onChange={(e) => {
                                        setBatch({
                                            ...batch,
                                            requiresHumidity: e.target.checked
                                        });
                                    }}
                                />
                            </Grid>
                            {batch.requiresHumidity ?
                                <Grid item xs={12}>
                                    <Typography>Humidity Lower Bound:</Typography>
                                    <TextField
                                        label="Humidity Lower Bound"
                                        value={batch.humidityLowerBound}
                                        onChange={(e) => {
                                            setBatch({
                                                ...batch,
                                                humidityLowerBound: e.target.value
                                            });
                                        }}
                                    />
                                    <Typography>Humidity Upper Bound:</Typography>
                                    <TextField
                                        label="Humidity Upper Bound"
                                        value={batch.humidityUpperBound}
                                        onChange={(e) => {
                                            setBatch({
                                                ...batch,
                                                humidityUpperBound: e.target.value
                                            });
                                        }}
                                    />
                                </Grid> :
                                null
                            }
                        </Grid>
                    </Grid>

                    <Grid item xs={12}>
                        <Button>
                            Load CSV
                        </Button>
                        <Button onClick={() => history.push("/cargo-info")} >
                            Add Manually
                        </Button>
                    </Grid>

                    <Grid item xs={12}>
                        <DataGrid
                            columns={[
                                { field: 'cargo-id', headerName: 'Cargo ID' },
                                { field: 'fragile', headerName: 'Is Fragile' }
                            ]}
                            rows={batch.cargo}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Button
                            onClick={
                                () => {
                                    setBatch(defaultBatch);
                                    history.push("/main");
                                }
                            }
                        >
                            Cancel
                        </Button>
                        <Button>
                            Save
                        </Button>
                        <Button>
                            Post
                        </Button>
                    </Grid>
                </Grid>

            </>
        );
    // }
}

export default BatchInfo;