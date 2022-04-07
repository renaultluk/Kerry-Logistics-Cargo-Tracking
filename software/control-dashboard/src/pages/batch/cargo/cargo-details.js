import { Button, FormGroup, FormControlLabel, Checkbox, Typography, TextField, FormLabel } from '@mui/material';
import React, { useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';

const CargoInfo = () => {
    const history = useHistory();
    
    const defaultCargo = {
        cargoID: "",
        isFragile: false,
        isUpright: false,
    }

    const [cargo, setCargo] = useState(defaultCargo);
    
    return (
        <>
            <Typography variant="h2">Enter Cargo Info</Typography>
            <FormGroup>
                <TextField
                    onChange={(e) => setCargo({ ...cargo, cargoID: e.target.value })}
                    label="Cargo ID"
                    variant="outlined"
                    required
                    defaultValue={cargo.cargoID}
                />
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
                    onClick={() => {
                        history.goBack();
                    }}
                >
                    Submit
                </Button>
            </FormGroup>
        </>
    );
}

export default withRouter(CargoInfo);