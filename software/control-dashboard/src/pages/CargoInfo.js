import { Button, FormGroup, FormControlLabel, Switch, Typography, TextField } from '@mui/material';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class CargoInfo extends Component {
    constructor(props) {
        super(props);
        this.state = props.cargo ? {
            cargoID: props.cargo.cargoID,
            requiresTemp: props.cargo.requiresTemp,
            requiresHumidity: props.cargo.requiresHumidity,
            tempLowerBound: props.cargo.tempLowerBound,
            tempUpperBound: props.cargo.tempUpperBound,
            humidityLowerBound: props.cargo.humidityLowerBound,
            humidityUpperBound: props.cargo.humidityUpperBound,
            isFragile: props.cargo.isFragile,
            isUpright: props.cargo.isUpright,
        } : {
            cargoID: "",
            requiresTemp: false,
            requiresHumidity: false,
            tempLowerBound: 0,
            tempUpperBound: 0,
            humidityLowerBound: 0,
            humidityUpperBound: 0,
            isFragile: false,
            isUpright: false,
        };
    }
    
    render() {
        return (
            <>
                <Typography variant="h2">Enter Cargo Info</Typography>
                <FormGroup>
                    <TextField
                        onChange={(e) => this.setState({ cargoID: e.target.value })}
                        label="Cargo ID"
                        variant="outlined"
                        required
                        defaultValue={this.props.cargo.cargoID}
                    />
                    <FormControlLabel 
                        control={<Switch
                            checked={this.state.requiresTemp}
                            onChange={(e) => this.setState({ requiresTemp: e.target.checked })}
                            />} 
                        label="Has Temperature Requirements"
                    />
                    {this.state.requiresTemp ?
                        <div>
                            <TextField
                                onChange={(e) => this.setState({ tempLowerBound: e.target.value })}
                                label="Temperature Lower Bound"
                                variant="outlined"
                                type="number"
                                defaultValue={this.props.cargo.tempLowerBound}
                            />
                            <TextField
                                onChange={(e) => this.setState({ tempUpperBound: e.target.value })}
                                label="Temperature Upper Bound"
                                variant="outlined"
                                type="number"
                                defaultValue={this.props.cargo.tempUpperBound}
                            />
                        </div>
                    : null }
                    <FormControlLabel
                        control={<Switch
                            checked={this.state.requiresHumidity}
                            onChange={(e) => this.setState({ requiresHumidity: e.target.checked })}
                            />}
                        label="Has Humidity Requirements"
                    />
                    {this.state.requiresHumidity ?
                        <div>
                            <TextField
                                onChange={(e) => this.setState({ humidityLowerBound: e.target.value })}
                                label="Humidity Lower Bound"
                                variant="outlined"
                                type="number"
                                defaultValue={this.props.cargo.humidityLowerBound}
                            />
                            <TextField
                                onChange={(e) => this.setState({ humidityUpperBound: e.target.value })}
                                label="Humidity Upper Bound"
                                variant="outlined"
                                type="number"
                                defaultValue={this.props.cargo.humidityUpperBound}
                            />
                        </div> 
                    : null }
                    <FormControlLabel
                        control={<Switch
                            checked={this.state.isFragile}
                            onChange={(e) => this.setState({ isFragile: e.target.checked })}
                            />}
                        label="Is Fragile"
                    />
                    <FormControlLabel
                        control={<Switch
                            checked={this.state.isUpright}
                            onChange={(e) => this.setState({ isUpright: e.target.checked })}
                            />}
                        label="Needs to be Upright"
                    />

                    <Button>
                        Submit
                    </Button>
                </FormGroup>
            </>
        );
    }
}

export default withRouter(CargoInfo);