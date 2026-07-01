import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import FormField from '../form-field';
import type { Student } from '../../data/students';

interface FormData {
  name: string;
  studentId: string;
  department: string;
  bio: string;
  skills: string;
}

interface FormErrors {
  name?: string;
  studentId?: string;
  department?: string;
  bio?: string;
  skills?: string;
}

export default function AddStudentForm({
  onSubmitSuccess = () => undefined,
}: {
  onSubmitSuccess?: (student: Student) => void;
}) {
  // Existing state
  const [formData, setFormData] = useState<FormData>({
    name: '',
    studentId: '',
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
  // ===== END NEW =====

  // Existing validation logic - KEEP UNCHANGED
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
      isValid = false;
    }

    // Student ID validation
    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
      isValid = false;
    } else if (!/^[0-9]{7,10}$/.test(formData.studentId.trim())) {
      newErrors.studentId = 'Student ID must be 7-10 digits';
      isValid = false;
    }

    // Department validation
    if (!formData.department.trim()) {
      newErrors.department = 'Department is required';
      isValid = false;
    }

    // Bio validation
    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required';
      isValid = false;
    } else if (formData.bio.trim().length < 10) {
      newErrors.bio = 'Bio must be at least 10 characters';
      isValid = false;
    }

    // Skills validation
    if (!formData.skills.trim()) {
      newErrors.skills = 'Skills are required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

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
  }, [submitTrigger, formData.bio, formData.department, formData.name, formData.skills, formData.studentId, onSubmitSuccess]);

  // ===== UPDATED: Handle submit press =====
  const handleSubmitPress = () => {
    // Mark all fields as touched
    setTouched({
      name: true,
      studentId: true,
      department: true,
      bio: true,
      skills: true,
    });

    setSubmitAttempted(true);

    // Validate form
    const isFormValid = validateForm();

    if (isFormValid) {
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

  return (
    <ScrollView className="flex-1 bg-white p-6">
      <View className="space-y-4">
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

        {/* Submit Button */}
        <TouchableOpacity
          className={`mt-6 rounded-lg bg-blue-600 p-4 ${
            isSubmitting ? 'opacity-50' : ''
          }`}
          onPress={handleSubmitPress}
          disabled={isSubmitting}
        >
          <Text className="text-center text-lg font-semibold text-white">
            {isSubmitting ? 'Submitting...' : 'Add Student'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}