import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import FormField from '../form-field';
import type { Student } from '../../data/students';

interface FormData {
  name: string;
  studentId: string;
  email: string;
  department: string;
  bio: string;
  skills: string;
}

interface FormErrors {
  name?: string;
  studentId?: string;
  email?: string;
  department?: string;
  bio?: string;
  skills?: string;
}

export default function AddStudentForm({
  onSubmitSuccess = () => undefined,
  onCancel = () => undefined,
}: {
  onSubmitSuccess?: (student: Student) => void;
  onCancel?: () => void;
}) {
  // Existing state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    studentId: '',
    email: '',
    department: '',
    bio: '',
    skills: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitTrigger, setSubmitTrigger] = useState(false);

  // ===== NEW: Touched and submit attempted state =====
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // ===== NEW: Helper functions =====
  const markTouched = (field: keyof FormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const getFieldError = (field: keyof FormErrors) => {
    return touched[field] || submitAttempted
      ? errors[field]
      : undefined;
  };

  const getValidationErrors = (): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!formData.name.trim()) {
      nextErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      nextErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.studentId.trim()) {
      nextErrors.studentId = 'Student ID is required';
    } else if (!/^[0-9]{7,10}$/.test(formData.studentId.trim())) {
      nextErrors.studentId = 'Student ID must be 7-10 digits';
    }

    const emailRegex = /^\S+@\S+\.\S+$/;

    if (!formData.email.trim()) {
      nextErrors.email = 'Email is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      nextErrors.email = 'Please enter a valid email address';
    }

    if (!formData.department.trim()) {
      nextErrors.department = 'Department is required';
    }

    if (!formData.bio.trim()) {
      nextErrors.bio = 'Bio is required';
    } else if (formData.bio.trim().length < 10) {
      nextErrors.bio = 'Bio must be at least 10 characters';
    } else if (formData.bio.length > 200) {
      nextErrors.bio = 'Bio cannot exceed 200 characters';
    }

    if (!formData.skills.trim()) {
      nextErrors.skills = 'Skills are required';
    }

    return nextErrors;
  };
  // ===== END NEW =====

  // Existing validation logic - KEEP UNCHANGED
  const validateForm = (): boolean => {
    const nextErrors = getValidationErrors();
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const isFormValid = Object.keys(getValidationErrors()).length === 0;

  useEffect(() => {
    if (!submitTrigger) return;

    const timeoutId = setTimeout(() => {
      const newStudent: Student = {
        id: Date.now().toString(),
        name: formData.name.trim(),
        studentId: formData.studentId.trim(),
        department: formData.department.trim(),
        bio: formData.bio.trim(),
        skills: formData.skills
          .split(',')
          .map((skill) => skill.trim())
          .filter((skill) => skill.length > 0),
        avatarUrl: 'https://i.pravatar.cc/150?u=' + Date.now(),
      };

      setIsSubmitting(false);
      setSubmitTrigger(false);
      onSubmitSuccess(newStudent);
    }, 1500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [submitTrigger, formData.bio, formData.department, formData.email, formData.name, formData.skills, formData.studentId, onSubmitSuccess]);

  // ===== UPDATED: Handle submit press =====
  const handleSubmitPress = () => {
    // Mark all fields as touched
    setTouched({
      name: true,
      studentId: true,
      email: true,
      department: true,
      bio: true,
      skills: true,
    });

    setSubmitAttempted(true);

    // Validate form
    const valid = validateForm();

    if (valid) {
      setIsSubmitting(true);
      setSubmitTrigger(true);
    }
  };

  // ===== UPDATED: Update field handler =====
  const updateField = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const bioLength = formData.bio.length;

  const hasUnsavedChanges =
    formData.name.trim().length > 0 ||
    formData.studentId.trim().length > 0 ||
    formData.email.trim().length > 0 ||
    formData.department.trim().length > 0 ||
    formData.bio.trim().length > 0 ||
    formData.skills.trim().length > 0;

  const handleCancelPress = () => {
    if (!hasUnsavedChanges) {
      onCancel();
      return;
    }

    Alert.alert(
      'Discard Changes?',
      'You have unsaved changes. Are you sure you want to discard them?',
      [
        {
          text: 'Keep Editing',
          style: 'cancel',
        },
        {
          text: 'Discard',
          style: 'destructive',
          onPress: onCancel,
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View>
        {/* ===== UPDATED: Name field with onBlur and getFieldError ===== */}
        <FormField
          label="Full Name"
          value={formData.name}
          onChangeText={(text: string) => updateField('name', text)}
          onBlur={() => markTouched('name')}
          placeholder="e.g. Ashraful Haque"
          error={getFieldError('name')}
          autoCapitalize="words"
        />

        {/* ===== UPDATED: Student ID field with onBlur and getFieldError ===== */}
        <FormField
          label="Student ID"
          value={formData.studentId}
          onChangeText={(text: string) => updateField('studentId', text)}
          onBlur={() => markTouched('studentId')}
          placeholder="e.g. 20241234"
          error={getFieldError('studentId')}
        />

        {/* ===== NEW: Email field ===== */}
        <FormField
          label="Email"
          value={formData.email}
          onChangeText={(text: string) => updateField('email', text)}
          onBlur={() => markTouched('email')}
          placeholder="e.g. ashraful@example.com"
          autoCapitalize="none"
          error={getFieldError('email')}
        />

        {/* ===== UPDATED: Department field with onBlur and getFieldError ===== */}
        <FormField
          label="Department"
          value={formData.department}
          onChangeText={(text: string) => updateField('department', text)}
          onBlur={() => markTouched('department')}
          placeholder="e.g. Computer Science"
          error={getFieldError('department')}
          autoCapitalize="words"
        />

        {/* ===== UPDATED: Bio field with onBlur and getFieldError ===== */}
        <FormField
          label="Bio"
          value={formData.bio}
          onChangeText={(text: string) => updateField('bio', text)}
          onBlur={() => markTouched('bio')}
          placeholder="Tell us about yourself..."
          error={getFieldError('bio')}
          multiline={true}
        />

        <Text
          style={[
            styles.characterCounter,
            bioLength > 200 && styles.characterCounterError,
          ]}
        >
          {bioLength} / 200 characters
        </Text>

        {/* ===== UPDATED: Skills field with onBlur and getFieldError ===== */}
        <FormField
          label="Skills"
          value={formData.skills}
          onChangeText={(text: string) => updateField('skills', text)}
          onBlur={() => markTouched('skills')}
          placeholder="e.g. JavaScript, React, Python"
          error={getFieldError('skills')}
          autoCapitalize="words"
        />

        <View style={styles.buttonRow}>
          <Pressable
            style={styles.cancelButton}
            onPress={handleCancelPress}
          >
            <Text style={styles.cancelButtonText}>
              Cancel
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.button,
              !isFormValid && styles.buttonDisabled,
            ]}
            onPress={handleSubmitPress}
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.buttonText}>
                Join Directory
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 24,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 32,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontWeight: '700',
  },
  button: {
    flex: 1,
    backgroundColor: '#0D9488',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    backgroundColor: '#CBD5E1',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  characterCounter: {
    textAlign: 'right',
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
  },
  characterCounterError: {
    color: '#DC2626',
  },
});