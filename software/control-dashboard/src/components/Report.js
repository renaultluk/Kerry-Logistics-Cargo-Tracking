import { View, Text, StyleSheet } from '@react-pdf/renderer';

import { db } from '../config/my-firebase';
import { ref, get } from "firebase/database";

const styles = StyleSheet.create({
    page: {
        size: "A4",
        orientation: "portrait",
        flexDirection: 'column',
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
    
    const fetchData = async () => {
        const batchRef = ref(db, `batches/pending`);
        get(batchRef).then((snapshot) => {
            if (snapshot.exists()) {
                const obj = snapshot.val();
                console.log(obj);
                pendingBatches = obj;
            }
        })

        const batchRef2 = ref(db, `batches/completed`);
        get(batchRef2).then((snapshot) => {
            if (snapshot.exists()) {
                const obj = snapshot.val();
                console.log(obj);
                completedBatches = obj;
            }
        })

        const issueRef = ref(db, `issues/pending`);
        get(issueRef).then((snapshot) => {
            if (snapshot.exists()) {
                const obj = snapshot.val();
                console.log(obj);
                unresolvedIssues = obj;
            }
        })

        const issueRef2 = ref(db, `issues/resolved`);
        get(issueRef2).then((snapshot) => {
            if (snapshot.exists()) {
                const obj = snapshot.val();
                console.log(obj);
                resolvedIssues = obj;
            }
        })
    }

    let d = new Date();
    let date = d.toLocaleDateString();
    
    useEffect(() => {
        fetchData().catch((error) => console.log(error));
    }, [])

    return (
        <View style={styles.page}>
            <Text style={styles.title}>Daily Report</Text>
            <Text>Export Date and Time: {date}</Text>

            <Text style={styles.subheader}>Pending Batches: {pendingBatches.length}</Text>
            <View style={styles.contentBox}>
                {
                    pendingBatches.map((batch, index) => {
                        return (
                            <Text key={index}>
                                {batch.batchID}
                            </Text>
                        )
                    })
                }
            </View>

            <Text style={styles.subheader}>Completed Batches: {completedBatches.length}</Text>
            <View style={styles.contentBox}>
                {
                    completedBatches.map((batch, index) => {
                        return (
                            <Text key={index}>
                                {batch.batchID}
                            </Text>
                        )
                    })
                }
            </View>

            <Text style={styles.subheader}>Unresolved Issues: {unresolvedIssues.length}</Text>
            <View style={styles.contentBox}>
                {
                    unresolvedIssues.map((issue, index) => {
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
    );
}

export default Report;