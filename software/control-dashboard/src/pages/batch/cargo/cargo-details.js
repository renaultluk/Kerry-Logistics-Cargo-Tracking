import { Button, FormGroup, FormControlLabel, Checkbox, Typography, TextField, FormLabel } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React, { useState, useEffect } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import useQuery from '../../../utils/useQuery';

import { db } from '../../../config/my-firebase';
import { ref, get, set, push } from "firebase/database";

const CargoInfo = () => {
    const history = useHistory();
    const query = useQuery();
    const cargoID = query.get('cargoID');
    const batchID = query.get('batchID');
    
    // const defaultCargo = {
    //     cargoID: "",
    //     isFragile: false,
    //     isUpright: false,
    // }

    const [cargo, setCargo] = useState([]);

    const fetchData = async () => {
        const cargoRef = ref(db, `batches/${batchID}/cargo/${cargoID}`);
        get(cargoRef).then((snapshot) => {
            if (snapshot.exists()) {
                const obj = snapshot.val();
                console.log(obj);
                // var alertStatus = obj.alertStatus;
                const alertKeys = Object.keys(obj);
                var alertStatus = Object.values(obj);
                alertStatus.forEach((alert, index) => {
                    alert['id'] = index;
                    alert['time'] = alertKeys[index];
                    alert['humd'] = alert.BME280.Humidity;
                    alert['temp'] = alert.BME280.Temperature;
                    // alert['press'] = alert.BME280.Pressure;
                    alert['shocked'] = alert.KY002.Box_shocked;
                    alert['opened'] = alert.Photoresistor.Box_opened;
                    alert['location'] = alert.Location.Location;
                    alert['orientation'] = alert.MPU6050.Rotation;
                })
                console.log(alertStatus);
                setCargo(alertStatus);
            }
        })
    }

    useEffect(() => {
        if (cargoID) {
            fetchData().catch((error) => console.log(error));
        }
    }, [])

    const handleSubmit = () => {
        const cargoRef = ref(db, `cargo/pending`);
        const newRef = cargoID ? ref(db, `cargo/pending/${cargoID}`) : push(cargoRef);
        cargo.cargoID = newRef.key;

        const batchRef = ref(db, `batches/pending/${batchID}/cargo/${cargo.cargoID}`);
        set(newRef, cargo).then(() => {
            set(batchRef, cargo).then(() => {
                history.goBack();
            });
        }
        );
    }

    
    
    return (
        <>
            <Typography variant="h2">Cargo Info</Typography>
            {/* <FormGroup>
                <TextField
                    onChange={(e) => setCargo({ ...cargo, cargoID: e.target.value })}
                    label="Cargo ID"
                    variant="outlined"
                    required
                    defaultValue={cargo.cargoID}
                />
                <FormLabel>
                    {
                        cargoID ? `Batch ${batchID} >> Cargo ID: ${cargoID}` : 
                        `Batch ${batchID} >> New Cargo`
                    }
                </FormLabel>
                <FormControlLabel
                    control={<Checkbox
                        checked={cargo.isFragile}
                        onChange={(e) => setCargo({ ...cargo, isFragile: e.target.checked })}
                        />}
                    label="Is Fragile"
                />
                <FormControlLabel
                    control={<Checkbox
                        checked={cargo.isUpright}
                        onChange={(e) => setCargo({ ...cargo, isUpright: e.target.checked })}
                        />}
                    label="Needs to be Upright"
                />
                <Button
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </FormGroup> */}
            <Typography>Carton ID: {cargoID}</Typography>
            {
                cargo.length > 0 ?
                <div style={{ height: '500px' }}>
                    <DataGrid
                        rows={cargo}
                        columns={[
                            { field: 'time', headerName: 'Time' },
                            { field: 'location', headerName: 'Location' },
                            { field: 'temp', headerName: 'Temperature' },
                            { field: 'humd', headerName: 'Humidity' },
                            { field: 'shocked', headerName: 'Box shocked' },
                            { field: 'opened', headerName: 'Box opened' },
                            { field: 'orientation', headerName: 'Orientation' },
                        ]}
                    />
                </div>
                : null
            }
            <Button
                onClick={() => history.goBack()}
            >
                Back
            </Button>
        </>
    );
}

export default withRouter(CargoInfo);