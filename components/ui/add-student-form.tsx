import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
} from "react-native";

import FormField from "../form-field";
import type { Student } from "../../data/students";

interface AddStudentFormProps {
  onSubmitSuccess: (student: Student) => void;
}

interface FormData {
  name: string;
  studentId: string;
  department: string;
  bio: string;
  skillsText: string;
}

interface FormErrors {
  name?: string;
  studentId?: string;
  department?: string;
  bio?: string;
}

export default function AddStudentForm({ onSubmitSuccess }: AddStudentFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    studentId: "",
    department: "",
    bio: "",
    skillsText: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    const nextErrors: FormErrors = {};

    if (!formData.name.trim()) nextErrors.name = "Full name is required";
    if (!formData.studentId.trim()) nextErrors.studentId = "Student ID is required";
    if (!formData.department.trim()) nextErrors.department = "Department is required";
    if (!formData.bio.trim()) nextErrors.bio = "Bio is required";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);

    const newStudent: Student = {
      id: Date.now().toString(),
      name: formData.name.trim(),
      studentId: formData.studentId.trim(),
      department: formData.department.trim(),
      bio: formData.bio.trim(),
      skills: formData.skillsText
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean),
      avatarUrl: `https://i.pravatar.cc/150?u=${formData.studentId.trim()}`,
    };

    onSubmitSuccess(newStudent);
    setIsSubmitting(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>Join the Directory</Text>
      <Text style={styles.subheading}>
        Fill in your details below to add yourself to StudentDirectory.
      </Text>

      <FormField
        label="Full Name"
        value={formData.name}
        onChangeText={(text: string) => updateField("name", text)}
        placeholder="e.g. Ashraful Haque"
        error={errors.name}
      />

      <FormField
        label="Student ID"
        value={formData.studentId}
        onChangeText={(text: string) => updateField("studentId", text)}
        placeholder="e.g. 22-12345-1"
        autoCapitalize="none"
        error={errors.studentId}
      />

      <FormField
        label="Department"
        value={formData.department}
        onChangeText={(text: string) => updateField("department", text)}
        placeholder="e.g. Computer Science"
        error={errors.department}
      />

      <FormField
        label="Bio"
        value={formData.bio}
        onChangeText={(text: string) => updateField("bio", text)}
        placeholder="A short sentence about yourself..."
        multiline
        error={errors.bio}
      />

      <FormField
        label="Skills (comma-separated)"
        value={formData.skillsText}
        onChangeText={(text: string) => updateField("skillsText", text)}
        placeholder="e.g. React Native, TypeScript, Figma"
        autoCapitalize="none"
      />

      <Pressable style={styles.submitButton} onPress={handleSubmit}>
        {isSubmitting ? (
          <ActivityIndicator color="#FFFFFF" />
        ) : (
          <Text style={styles.submitButtonText}>Add Student</Text>
        )}
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF", padding: 20 },
  heading: { fontSize: 20, fontWeight: "800", color: "#0D1F4E", marginBottom: 4 },
  subheading: { fontSize: 13, color: "#64748B", marginBottom: 24, lineHeight: 19 },
  submitButton: {
    marginTop: 8,
    backgroundColor: "#2563EB",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 14,
  },
});