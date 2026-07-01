// components/add-student-form.tsx 

import React from "react"; 

import { useEffect, useState } from "react"; 

import { 

  ActivityIndicator, 

  Pressable, 

  ScrollView, 

  StyleSheet, 

  Text, 

  View, 

} from "react-native"; 

import FormField from "./form-field"; 

import { Student } from "../data/students"; 

  

interface AddStudentFormProps { 

  onSubmitSuccess: (student: Student) => void; 

} 

  

// Shape of the form's own state — note skillsText is a single 

// string here; it gets split into an array only on submit. 

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

  // Combined state — all 5 text fields live together 

  const [formData, setFormData] = useState<FormData>({ 

    name: "", 

    studentId: "", 

    department: "", 

    bio: "", 

    skillsText: "", 

  }); 

  

  // Separate state — unrelated to form field values 

  const [errors, setErrors] = useState<FormErrors>({}); 

  const [isSubmitting, setIsSubmitting] = useState(false); 

  

  // Generic field updater — one function handles all 5 fields 

  const updateField = (field: keyof FormData, value: string) => { 

    setFormData((prev) => ({ ...prev, [field]: value })); 

  }; 

  

  // ... validation effect and submit handler go here (Section 4 and 5) 

  

  return ( 

    <ScrollView style={styles.container}> 

      {/* form fields go here — Section 3.3 */} 

    </ScrollView> 

  ); 

} 