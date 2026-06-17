import { FlatList, StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import StudentItem from "@/components/student-item";
import { Student, STUDENTS } from "@/data/students";
import SearchBar from "@/components/search-bar";
// NEW: import the StudentDetail component to show student details when selected
import StudentDetail from "@/components/student-detail";
import { useState, useMemo } from "react";

export default function HomeScreen() {
    // State 1: the current search query
    const [query, setQuery] = useState<string>("");

    // NEW: State 2: the currently selected student (null = none selected)
    const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
    // State 3: selected department filter (All = no department filter)
    const [selectedDept, setSelectedDept] = useState<string>("All");

    // derive list of department options (include All)
    const departments = useMemo(() => {
        const set = new Set<string>(STUDENTS.map((s) => s.department));
        return ["All", ...Array.from(set)];
    }, []);

    // NEW: Toggle selection: tap same student to select and deselect
    const handleSelect = (student: Student) => {
        setSelectedStudent((prev) => (prev?.id === student.id ? null : student));
    };

    // Derived value: filter students based on query
    // Use useMemo to avoid recomputing on unrelated renders
    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return STUDENTS.filter((s) => {
            if (selectedDept !== "All" && s.department !== selectedDept) return false;
            if (q.length === 0) return true;
            return (
                s.name.toLowerCase().includes(q) || // check if name matches query OR
                s.department.toLowerCase().includes(q) || // check if department matches query
                s.studentId.toLowerCase().includes(q)
            );
        });
    }, [query, selectedDept]);

    return (
        // View is the container that contains the list of students and search bar
        <View style={styles.container}>
            <View style={styles.titleBar}>
                <Text style={styles.title}>Student Directory</Text>
            </View>

            {/* update the value and onChangeText function in the Search Bar */}
            <SearchBar value={query} onChangeText={setQuery} />

            {/* Department filter pills */}
            <View style={styles.pillsRowWrapper}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pillsRow}>
                    {departments.map((dept) => (
                        <TouchableOpacity
                            key={dept}
                            style={[styles.pill, selectedDept === dept && styles.pillActive]}
                            onPress={() => setSelectedDept(dept)}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.pillText, selectedDept === dept && styles.pillTextActive]}>{dept}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            <FlatList
                style={styles.list}
                data={filtered}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <StudentItem student={item} onPress={handleSelect} isSelected={selectedStudent?.id === item.id} />
                )}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={filtered.length === 0 ? undefined : styles.listContent}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Text style={styles.emptyText}>No students match "{query}"</Text>
                    </View>
                }
            />

            {/* NEW: Detail panel — only shown when a student is selected */}
            {selectedStudent && <StudentDetail student={selectedStudent} />}
        </View>
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
    list: {
        flex: 1,
    },
    pillsRowWrapper: {
        paddingVertical: 10,
        backgroundColor: "#FFFFFF",
        borderBottomWidth: 1,
        borderBottomColor: "#E6EEF6",
    },
    pillsRow: {
        paddingHorizontal: 12,
        gap: 8,
        alignItems: "center",
    },
    pill: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 20,
        backgroundColor: "#F1F5F9",
    },
    pillActive: {
        backgroundColor: "#0D4ED8",
    },
    pillText: {
        fontSize: 12,
        color: "#0D1F4E",
    },
    pillTextActive: {
        color: "#FFFFFF",
        fontWeight: "600",
    },
});
