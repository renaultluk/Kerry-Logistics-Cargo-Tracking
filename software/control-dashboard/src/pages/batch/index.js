import { useState, useEffect } from 'react';
import { withRouter, Switch, Route, useRouteMatch, useHistory } from 'react-router-dom';
import { TextField, Button, Typography, Grid, ButtonBase } from '@mui/material';
import { Container } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import { getDatabase, ref, onValue, onChildAdded, get, child } from "firebase/database";

import Header from '../../components/Header';
import BatchInfo from './cargo/index';

import { db } from '../../config/my-firebase';
import { Link } from 'react-router-dom';

const BatchesOverview = () => {
    const { path, url } = useRouteMatch();
    const [batches, setBatches] = useState([]);
    const history = useHistory();

    const fetchData = async () => {
        const batchRef = ref(db, 'batches/pending');
        get(batchRef).then((snapshot) => {
            if (snapshot.exists()) {
                const obj = snapshot.val();
                console.log(obj);
                const arrKeys = Object.keys(obj);
                const objArr = Object.values(obj);
                // objArr.shift();
                const batches = objArr;
                batches.forEach((batch, index) => {
                    batch['id'] = arrKeys[index];
                    batch['batchID'] = arrKeys[index];
                })
                console.log(batches);
                const batchKeys = Object.keys(batches);
                const batchValues = batchKeys.map((key) => batches[key]);
                setBatches(batchValues);
            }
        })
    }

    useEffect(() => {
        fetchData().catch((error) => console.log(error));
    }, []);

    return (
        <>
            <Switch>
                <Route exact path={path}>
                    <Typography variant="h2">Manage Cargo</Typography>
                    <Button onClick={() => history.push(`${url}/batch`)}>
                        Add New Batch
                    </Button>
                    <div style={{ height: 500 }}>
                        <DataGrid 
                            columns={[
                                { field: 'batchID', headerName: 'Batch ID' },
                                { field: 'truckID', headerName: 'Truck ID' },
                                { field: 'requiresTemp', headerName: 'Has Temperature Requirements' },
                                { field: 'requiresHumidity', headerName: 'Has Humidity Requirements' },
                                { field: 'tempLowerBound', headerName: 'Temperature Lower Bound' },
                                { field: 'tempUpperBound', headerName: 'Temperature Upper Bound' },
                                { field: 'humidityLowerBound', headerName: 'Humidity Lower Bound' },
                                { field: 'humidityUpperBound', headerName: 'Humidity Upper Bound' },
                            ]}
                            rows={batches}
                            onRowDoubleClick={(row) => {
                                history.push(`${url}/batch?batchID=${row.id}`);
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