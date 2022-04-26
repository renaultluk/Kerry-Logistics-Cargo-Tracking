import { useState, useEffect } from "react";
import { db } from "../config/my-firebase";
import { ref, onValue, onChildAdded, get, child } from "firebase/database";
import { CSVDownload, CSVLink } from "react-csv";
import Button from '@material-ui/core/Button';
import * as XLSX from "xlsx";

const ReportCSV = () => {
    const exportToExcel = async () => {
            const fileType =
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
            const fileExtension = ".xlsx";
        
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
                    const resolvedAlerts = alertValues.resolved;

                    alerts = pendingAlerts.concat(resolvedAlerts);
                }
            })
            
            var generalData = [
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

            const cartonRef = ref(db, 'cartons');
        
            const page1 = XLSX.utils.json_to_sheet(generalData);
            const page2 = XLSX.utils.json_to_sheet();
            const page3 = XLSX.utils.json_to_sheet();
        
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, page1, "General");
            XLSX.utils.book_append_sheet(wb, page2, "Alerts");
            XLSX.utils.book_append_sheet(wb, page3, "Carton Details");
            FileSaver.saveAs(wb, `report-${date}.xlsx`);
    }
    
    
    return (
        // <CSVLink data={data} filename={"report.csv"}>
        //     {({ csvFile }) => <button>Export Daily Report</button>}
        // </CSVLink>
        <Button onClick={exportToExcel}>Export Daily Report</Button>
    )
}

export default ReportCSV;