import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/useAuth";
import { router } from "expo-router";

const PRIMARY_COLOR = "#6783ff"; 
const GRAY_BORDER = "#e0e0e0";
const LIGHT_TEXT = "#9CA3AF";

export default function LiveGreenRegisterClone() {
  const { register, isLoading, error } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async () => {
    // Validation
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password.trim()) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Lỗi", "Mật khẩu phải có ít nhất 6 ký tự");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Lỗi", "Email không hợp lệ");
      return;
    }

    try {
      await register({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        phoneNumber: phoneNumber.trim() || undefined,
      });
    } catch (err: any) {
      Alert.alert("Đăng ký thất bại", err.message || "Đã xảy ra lỗi");
    }
  };

  const isFormValid =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    email.trim() !== "" &&
    password.trim() !== "" &&
    password.length >= 6;


  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo */}
          <View style={styles.logoContainer}>
            {/* Giả lập logo bằng text và view tròn */}
            <View style={styles.logoCircle} />
            <Text style={styles.logoText}>live Green</Text>
          </View>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.mainTitle}>Register Now!</Text>
            <Text style={styles.subTitle}>Enter your information below</Text>
          </View>

          {/* --- Input Fields --- */}

          {/* First Name Input */}
          <View style={styles.inputFloatingContainer}>
            <Text style={styles.inputLabel}>First Name *</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="Enter your first name"
              placeholderTextColor={LIGHT_TEXT}
            />
          </View>

          {/* Last Name Input */}
          <View style={styles.inputFloatingContainer}>
            <Text style={styles.inputLabel}>Last Name *</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Enter your last name"
              placeholderTextColor={LIGHT_TEXT}
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputFloatingContainer}>
            <Text style={styles.inputLabel}>Email Address *</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              placeholder="Enter your email"
              placeholderTextColor={LIGHT_TEXT}
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputFloatingContainer}>
            <Text style={styles.inputLabel}>Password *</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              placeholder="At least 6 characters"
              placeholderTextColor={LIGHT_TEXT}
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={styles.passwordToggle}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color={LIGHT_TEXT}
              />
            </Pressable>
          </View>

          {/* Mobile Number Input */}
          <View style={styles.inputFloatingContainer}>
            <Text style={styles.inputLabel}>Mobile Number (Optional)</Text>
            <TextInput
              style={styles.input}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              keyboardType="phone-pad"
              placeholder="Enter your phone number"
              placeholderTextColor={LIGHT_TEXT}
            />
          </View>

          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Register Button */}
          <Pressable
            style={[
              styles.registerButton,
              {
                backgroundColor: isFormValid && !isLoading ? PRIMARY_COLOR : "#f5f5f6",
              },
            ]}
            onPress={handleRegister}
            disabled={!isFormValid || isLoading}
            android_ripple={{ color: "#fff" }}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text
                style={[
                  styles.registerButtonText,
                  { color: isFormValid ? "#fff" : "#c0c1c6" },
                ]}
              >
                Register
              </Text>
            )}
          </Pressable>

          {/* Login Link */}
          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>Already a member? </Text>
            <Pressable onPress={() => router.push("/(auth)/login")}>
              <Text style={styles.loginLink}>Login</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
    // Không dùng justifyContent: 'space-between' vì giao diện này dài hơn login
  },

  // --- Logo Section (Reused from Login) ---
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 50,
  },
  logoCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: PRIMARY_COLOR,
    marginRight: 8,
    borderTopColor: "transparent",
    borderRightColor: "transparent",
  },
  logoText: {
    fontSize: 28,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
  },

  // --- Title Section ---
  titleContainer: {
    marginBottom: 30,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 16,
    color: "#6b7280", // light gray
  },

  // --- Input Fields (Floating Label Style) ---
  inputFloatingContainer: {
    borderWidth: 1,
    borderColor: GRAY_BORDER,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingTop: 8, // Để tạo không gian cho label
    marginBottom: 20,
    height: 60,
    justifyContent: "center",
  },
  inputLabel: {
    position: "absolute",
    left: 15,
    top: 5, // Đẩy lên trên
    fontSize: 12,
    color: LIGHT_TEXT,
    fontWeight: "500",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingVertical: 0,
    paddingTop: 8, // Bù đắp cho label
  },

  passwordToggle: {
    padding: 5,
    position: "absolute",
    right: 15,
    top: 20,
  },

  // --- Error Message ---
  errorContainer: {
    backgroundColor: "#fee",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: "#c00",
    fontSize: 14,
    textAlign: "center",
  },

  // --- Register Button ---
  registerButton: {
    borderRadius: 10,
    paddingVertical: 16,
    marginBottom: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  registerButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },

  // --- Login Link ---
  loginLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  loginText: {
    fontSize: 15,
    color: "#000",
  },
  loginLink: {
    fontSize: 15,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
  },
});
