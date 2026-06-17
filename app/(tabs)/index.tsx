import { FlatList, ScrollView, StyleSheet, Text, View } from "react-native";
// Importing our custom StudentItem component to display each student in the list
import StudentItem from "@/components/student-item";
// Importing the list of students from our data file
import { Student, STUDENTS } from "@/data/students";
// NEW: Importing the SearchBar component to allow users to search for students
import SearchBar from "@/components/search-bar";
import { useState } from "react";

export default function HomeScreen() {
    // State 1: the current search query
    const [query, setQuery] = useState<string>("");

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

            {/* NEW: Student list using React Native's FlatList component*/}
            <FlatList
                data={filtered}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <StudentItem student={item} onPress={() => {}} isSelected={false} />}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No students match "{query}"</Text>
                    </View>
                }
            />
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
