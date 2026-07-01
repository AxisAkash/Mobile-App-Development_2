import React from 'react';
import { View, Text, TextInput } from 'react-native';

// ===== UPDATED: Add onBlur to interface =====
interface FormFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  onBlur?: () => void; // NEW: Optional onBlur prop
  error?: string;
  placeholder?: string;
  multiline?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'email-address' | 'numeric' | 'phone-pad';
}

// ===== UPDATED: Add onBlur to parameter list =====
export default function FormField({
  label,
  value,
  onChangeText,
  onBlur, // NEW: onBlur prop
  error,
  placeholder,
  multiline = false,
  autoCapitalize = 'sentences',
  secureTextEntry = false,
  keyboardType = 'default',
}: FormFieldProps) {
  return (
    <View className="mb-4">
      <Text className="mb-1 text-sm font-medium text-gray-700">{label}</Text>
      <TextInput
        className={`rounded-lg border p-3 text-base ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${multiline ? 'min-h-[100px]' : ''}`}
        value={value}
        onChangeText={onChangeText}
        // ===== NEW: Pass onBlur to TextInput =====
        onBlur={onBlur}
        placeholder={placeholder}
        placeholderTextColor="#9CA3AF"
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        autoCapitalize={autoCapitalize}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
      />
      {error && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
    </View>
  );
}