import { StyleSheet, View } from "react-native";
// Importing our custom StudentItem component to display each student in the list
import StudentItem from "@/components/student-item";
// Importing the list of students from our data file
import { STUDENTS } from "@/data/students";

export default function HomeScreen() {
    return (
        // View is the container that contains the list of students.
        // We map over the STUDENTS array and render a StudentItem for each student.
        <View style={styles.container}>
            {STUDENTS.map((student) => (
                <StudentItem key={student.id} student={student} onPress={() => {}} isSelected={false} />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleContainer: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: "absolute",
    },
});
