import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
import StudentItem from "@/components/student-item";
import { Student, STUDENTS } from "@/data/students";
import SearchBar from "@/components/search-bar";
// NEW: import the StudentDetail component to show student details when selected
import StudentDetail from "@/components/student-detail";
import { useState } from "react";

export default function HomeScreen() {
    // State 1: the current search query
    const [query, setQuery] = useState<string>("");

    // NEW: State 2: the currently selected student (null = none selected)
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

    // NEW: Toggle selection: tap same student to select and deselect
    const handleSelect = (student: Student) => {
        setSelectedStudent((prev) => (prev?.id === student.id ? null : student));
    };

    // Derived value: filter students based on query
    // This is NOT state — it is computed from state every render
    const filtered = STUDENTS.filter((s) => {
        return (
            s.name.toLowerCase().includes(query.toLowerCase()) || // check if name matches query OR
            s.department.toLowerCase().includes(query.toLowerCase()) // check if department matches query
        );
    });

    return (
        // View is the container that contains the list of students and search bar
        <ScrollView style={styles.container}>
            <View style={styles.titleBar}>
                <Text style={styles.title}>Student Directory</Text>
            </View>

            {/* update the value and onChangeText function in the Search Bar */}
            <SearchBar value={query} onChangeText={setQuery} />

            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
				// NEW: update the onPress handler to toggle selection and pass isSelected prop to StudentItem
				// and the isSelected prop is used to conditionally style the selected student item in the list (e.g., highlight it)
                renderItem={({ item }) => <StudentItem student={item} onPress={handleSelect} isSelected={selectedStudent?.id === item.id} />}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No students match "{query}"</Text>
                    </View>
                }
            />

            {/* NEW: Detail panel — only shown when a student is selected */}
            {selectedStudent && <StudentDetail student={selectedStudent} />}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F0F4F8",
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
    // NEW: styles for the title bar
    titleBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 16,
        paddingVertical: 14,
        backgroundColor: "#0D1F4E",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    count: {
        fontSize: 12,
        color: "#CCFBF1",
    },
    empty: {
        padding: 40,
        alignItems: "center",
    },
    emptyText: {
        fontSize: 14,
        color: "#94A3B8",
    },
});
