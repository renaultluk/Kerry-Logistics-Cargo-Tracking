import { useState, useEffect } from 'react';
import { Document, Page, View, Text, StyleSheet } from '@react-pdf/renderer';

import { db } from '../config/my-firebase';
import { ref, get } from "firebase/database";

const styles = StyleSheet.create({
    page: {
        size: "A4",
        orientation: "portrait",
        flexDirection: 'column',
        backgroundColor: '#ffffff',
    },
    title: {
        fontSize: 12,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    subheader: {
        fontSize: 10,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    contentBox: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#000000',
    }
});

const Report = () => {
    let completedBatches = [];
    let pendingBatches = [];
    let resolvedIssues = [];
    let unresolvedIssues = [];

const [batchesData, setBatchesData] = useState(
    {
        completedBatches: [],
        pendingBatches: [],
        resolvedIssues: [],
        unresolvedIssues: []
    }
);
    
    const fetchData = async () => {
        const batchRef = ref(db, `batches/pending`);
        get(batchRef).then((snapshot) => {
            if (snapshot.exists()) {
                let obj = snapshot.val();
                obj = Object.values(obj);
                // console.log("fetched pending", obj);
                pendingBatches = obj;
                setBatchesData({
                    ...batchesData,
                    pendingBatches: obj
                });
            }
        })

        const batchRef2 = ref(db, `batches/completed`);
        get(batchRef2).then((snapshot) => {
            if (snapshot.exists()) {
                let obj = snapshot.val();
                obj = Object.values(obj);
                // console.log(obj);
                completedBatches = obj;
                // setBatchesData({
                //     ...batchesData,
                //     completedBatches: obj
                // });
            }
        })

        const issueRef = ref(db, `issues/pending`);
        get(issueRef).then((snapshot) => {
            if (snapshot.exists()) {
                let obj = snapshot.val();
                obj = Object.values(obj);
                // console.log(obj);
                unresolvedIssues = obj;
                // setBatchesData({
                //     ...batchesData,
                //     unresolvedIssues: obj
                // });
            }
        })

        const issueRef2 = ref(db, `issues/resolved`);
        get(issueRef2).then((snapshot) => {
            if (snapshot.exists()) {
                let obj = snapshot.val();
                obj = Object.values(obj);
                // console.log(obj);
                resolvedIssues = obj;
                // setBatchesData({
                //     ...batchesData,
                //     resolvedIssues: obj
                // });
            }
        })

        // setBatchesData({
        //     ...batchesData,
        //     completedBatches: completedBatches,
        //     pendingBatches: pendingBatches,
        //     resolvedIssues: resolvedIssues,
        //     unresolvedIssues: unresolvedIssues
        // });
    }

    let d = new Date();
    let date = d.toLocaleDateString();
    
    useEffect(() => {
        fetchData().catch((error) => console.log(error));
        console.log("Pending Batches", pendingBatches);
    }, [])

    // console.log("Report");

    return (
        <Document>
            <Page style={styles.page}>
                <View>
                    <Text>Daily Report</Text>
                    <Text>Export Date and Time: {date}</Text>

                    <Text style={styles.subheader}>Pending Batches: {batchesData.pendingBatches.length}</Text>
                    <View style={styles.contentBox}>
                        {
                            batchesData.pendingBatches.map((batch, index) => {
                                return (
                                    <Text key={index}>
                                        {batch.batchID}
                                    </Text>
                                )
                            })
                        }
                    </View>

                    <Text style={styles.subheader}>Completed Batches: {batchesData.completedBatches.length}</Text>
                    <View style={styles.contentBox}>
                        {
                            batchesData.completedBatches.map((batch, index) => {
                                return (
                                    <Text key={index}>
                                        {batch.batchID}
                                    </Text>
                                )
                            })
                        }
                    </View>

                    <Text style={styles.subheader}>Unresolved Issues: {batchesData.unresolvedIssues.length}</Text>
                    <View style={styles.contentBox}>
                        {
                            batchesData.unresolvedIssues.map((issue, index) => {
                                return (
                                    <Text key={index}>
                                        {issue.issue}
                                    </Text>
                                )
                            })
                        }
                    </View>

                    <Text style={styles.subheader}>Resolved Issues: {resolvedIssues.length}</Text>
                    <View style={styles.contentBox}>
                        {
                            resolvedIssues.map((issue, index) => {
                                return (
                                    <Text key={index}>
                                        {issue.issue}
                                    </Text>
                                )
                            })
                        }
                    </View>
                </View>
            </Page>
        </Document>
    );
}

export default Report;