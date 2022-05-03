import { useState, useEffect } from "react";
import { db } from "../config/my-firebase";
import { ref, onValue, onChildAdded, get, child } from "firebase/database";
import { CSVDownload, CSVLink } from "react-csv";
import Button from '@mui/material/Button';
// import * as XLSX from "xlsx";
import FileSaver from "file-saver";

const ReportCSV = () => {
    const [data, setData] = useState([]);
    
    const exportToExcel = async () => {        
            const d = new Date();
            const date = d.toLocaleDateString();
        
            var numTrucks = 0;
            var numCartons = 0;
            var numDriverResolvable = 0;
            var numUnresolvable = 0;
            var numAlerts = 0;
            var numResolved = 0;
        
            var alerts = [];
            var cartons = [];

            const alertRef = ref(db, 'issues');
            get(alertRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const alertValues = snapshot.val();
                    const pendingAlerts = alertValues.pending;
                    pendingAlerts.forEach((alert, index) => {
                        alert['resolved'] = false;
                    })
                    const resolvedAlerts = alertValues.resolved;
                    resolvedAlerts.forEach((alert, index) => {
                        alert['resolved'] = true;
                    })

                    alerts = pendingAlerts.concat(resolvedAlerts);
                    numAlerts = alerts.length;
                }
            })
            
            const generalData = [
                ["Daily Summary Report"],
                ["Date", date],
                ["Number of trucks", numTrucks],
                ["Number of cartons", numCartons],
                ["Number of driver-resolvable issues", numDriverResolvable],
                ["Number of non-resolvable issues", numUnresolvable],
                ["Total number of alerts", numAlerts],
                ["Number of alerts resolved", numResolved]
            ];

            var alertsData = [
                ["Alerts summary (Sort by time)"],
                ["Date:", date],
                ["Time", "Carton ID", "Truck ID", "Type of alert", "Resolved?", "Driver", "Resolved time", "Alerts Details"],
            ];

            alerts.forEach(alert => {
                alertsData.push([
                    alert.time,
                    alert.cartonID,
                    alert.truckID,
                    alert.issue,
                    alert.resolved,
                    // alert.driver,
                    // alert.resolvedTime,
                    alert.data
                ]);
            })

            const cartonRef = ref(db, 'cartons');
            get(cartonRef).then((snapshot) => {
                if (snapshot.exists()) {
                    const cartonValues = snapshot.val();
                    cartons = Object.values(cartonValues);
                }
            })

            var cartonsData = [
                ["Carton Details"],
                ["Date:", date],
                ["Time leaving the warehouse", "Truck ID", "Carton ID", "Arrival Time", "Shipping Time", "Handler", "Any Alerts?"],
            ];

        
            // const page1 = XLSX.utils.aoa_to_sheet(generalData);
            // const page2 = XLSX.utils.aoa_to_sheet(alertsData);
            // const page3 = XLSX.utils.aoa_to_sheet();
        
            // const wb = XLSX.utils.book_new();
            // XLSX.utils.book_append_sheet(wb, page1, "General");
            // XLSX.utils.book_append_sheet(wb, page2, "Alerts");
            // XLSX.utils.book_append_sheet(wb, page3, "Carton Details");
            // FileSaver.saveAs(wb, `report-${date}.xlsx`);
            // return generalData;
            setData(generalData);
    }
    
    
    return (
        <CSVDownload onClick={exportToExcel} data={data} filename={"report.csv"}>
            {/* {({ csvFile }) => <button>Export Daily Report</button>} */}
            <Button>
                Export Daily Report
            </Button>
        </CSVDownload>
        // <Button onClick={exportToExcel}>Export Daily Report</Button>
    )
}

export default ReportCSV;