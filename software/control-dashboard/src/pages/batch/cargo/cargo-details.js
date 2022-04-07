import { Button, FormGroup, FormControlLabel, Checkbox, Typography, TextField, FormLabel } from '@mui/material';
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
    
    const defaultCargo = {
        cargoID: "",
        isFragile: false,
        isUpright: false,
    }

    const [cargo, setCargo] = useState(defaultCargo);

    const fetchData = async () => {
        const cargoRef = ref(db, `cargo/pending/${cargoID}`);
        get(cargoRef).then((snapshot) => {
            if (snapshot.exists()) {
                const obj = snapshot.val();
                console.log(obj);
                setCargo(obj);
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
            <FormGroup>
                {/* <TextField
                    onChange={(e) => setCargo({ ...cargo, cargoID: e.target.value })}
                    label="Cargo ID"
                    variant="outlined"
                    required
                    defaultValue={cargo.cargoID}
                /> */}
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
            </FormGroup>
        </>
    );
}

export default withRouter(CargoInfo);