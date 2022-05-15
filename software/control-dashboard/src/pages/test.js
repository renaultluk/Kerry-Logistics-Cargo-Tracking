import { useState } from "react";

import { db } from "../config/my-firebase";
import { ref, onValue, onChildAdded, get, child, set, update } from "firebase/database";
import { Button } from "react-bootstrap";

const Test = () => {
    const [batchID, setBatchID] = useState("");
    const [cargoID, setCargoID] = useState("");
    const [temp, setTemp] = useState("");
    const [humidity, setHumidity] = useState("");
    const [shocked, setShocked] = useState(false);
    const [requiresTemp, setRequiresTemp] = useState(false);
    const [requiresHumidity, setRequiresHumidity] = useState(false);
    const [tempLowerBound, setTempLowerBound] = useState(0);
    const [tempUpperBound, setTempUpperBound] = useState(0);
    const [humidityLowerBound, setHumidityLowerBound] = useState(0);
    const [humidityUpperBound, setHumidityUpperBound] = useState(0);
    const [isFragile, setIsFragile] = useState(false);
    const [submitTime, setSubmitTime] = useState("");

    const handleUploadStatus = async () => {
        console.log("uploading");
        const time = Date();
        const batchRef = ref(db, `batches/${batchID}/cargo/${cargoID}/${time}`);
        const cargo = {
            Location: {
                Location: "",
            },
            BME280: {
                Temperature: temp,
                Humidity: humidity,
            },
            KY002: {
                Box_shocked: shocked,
            },
        };
        console.log(cargo);
        const response = await set(batchRef, cargo).catch((error) => console.log(error));
        // console.log(response);
        setSubmitTime(new Date().toLocaleString());
    }

    const handleUploadReq = async () => {
        console.log("uploading");
        const batchRef = ref(db, `batches/${batchID}`);
        const updates = {
            requiresTemp: requiresTemp,
            requiresHumidity: requiresHumidity,
            tempLowerBound: tempLowerBound,
            tempUpperBound: tempUpperBound,
            humidityLowerBound: humidityLowerBound,
            humidityUpperBound: humidityUpperBound,
            isFragile: isFragile,
        };
        console.log(updates);
        await update(batchRef, updates).catch((error) => console.log(error));
        setSubmitTime(new Date().toLocaleString());
    }
    
    return (
        <div>
            <h1>Test</h1>
            <form>
                <label>Batch ID: </label>
                <input type="text" value={batchID} onChange={(e) => setBatchID(e.target.value)} />
                <br />
                <label>Cargo ID: </label>
                <input type="text" value={cargoID} onChange={(e) => setCargoID(e.target.value)} />
                <br />
                <label>Temperature: </label>
                <input type="text" value={temp} onChange={(e) => setTemp(e.target.value)} />
                <br />
                <label>Humidity: </label>
                <input type="text" value={humidity} onChange={(e) => setHumidity(e.target.value)} />
                <br />
                <label>Box Shocked: </label>
                <input type="radio" value={shocked} onChange={(e) => setShocked(e.target.value)} />
                <br />
                <Button onClick={handleUploadStatus}>Submit</Button>
            </form>

            <form>
                <label>requiresTemp: </label>
                <input type="radio" value={requiresTemp} onChange={(e) => setRequiresTemp(e.target.value)} />
                <br />
                <label>requiresHumidity: </label>
                <input type="radio" value={requiresHumidity} onChange={(e) => setRequiresHumidity(e.target.value)} />
                <br />
                <label>isFragile: </label>
                <input type="radio" value={isFragile} onChange={(e) => setIsFragile(e.target.value)} />
                <br />
                <label>tempLowerBound: </label>
                <input type="text" value={tempLowerBound} onChange={(e) => setTempLowerBound(e.target.value)} />
                <br />
                <label>tempUpperBound: </label>
                <input type="text" value={tempUpperBound} onChange={(e) => setTempUpperBound(e.target.value)} />
                <br />
                <label>humidityLowerBound: </label>
                <input type="text" value={humidityLowerBound} onChange={(e) => setHumidityLowerBound(e.target.value)} />
                <br />
                <label>humidityUpperBound: </label>
                <input type="text" value={humidityUpperBound} onChange={(e) => setHumidityUpperBound(e.target.value)} />
                <br />
                <Button onClick={handleUploadReq}>Submit</Button>
            </form>
            <h2>Submitted Time: {submitTime}</h2>

        </div>
    );
}

export default Test;