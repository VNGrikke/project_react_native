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
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../../hooks/useAuth";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

const PRIMARY_COLOR = "#6783ff";
const GRAY_BORDER = "#e0e0e0";
const FORGOT_PASSWORD_COLOR = "#6783ff";

export default function LiveGreenLoginClone() {
  const { login, isLoading, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    // Validation
    if (!email.trim() || !password.trim()) {
      Alert.alert("Lỗi", "Vui lòng điền đầy đủ email và mật khẩu");
      return;
    }

    if (!email.includes("@")) {
      Alert.alert("Lỗi", "Email không hợp lệ");
      return;
    }

    try {
      await login(email.trim(), password);
    } catch (err: any) {
      Alert.alert("Đăng nhập thất bại", err.message || "Đã xảy ra lỗi");
    }
  };

  const isFormValid = email.trim() !== "" && password.trim() !== "";

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
            <View style={styles.logoCircle} />
            <Text style={styles.logoText}>live Green</Text>
          </View>

          {/* Title */}
          <View style={styles.titleContainer}>
            <Text style={styles.mainTitle}>Lets get you Login!</Text>
            <Text style={styles.subTitle}>Enter your information below</Text>
          </View>

          {/* Social Login Buttons */}
          <View style={styles.socialButtonsContainer}>
            {/* Google Button */}
            <Pressable style={styles.socialButton}>
              <MaterialCommunityIcons
                name="google"
                size={20}
                color="#4285F4"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.socialButtonText}>Google</Text>
            </Pressable>

            {/* Facebook Button */}
            <Pressable style={styles.socialButton}>
              <Ionicons
                name="logo-facebook"
                size={20}
                color="#1877F2"
                style={{ marginRight: 8 }}
              />
              <Text style={styles.socialButtonText}>Facebook</Text>
            </Pressable>
          </View>

          {/* Separator */}
          <View style={styles.separatorContainer}>
            <View style={styles.separatorLine} />
            <Text style={styles.separatorText}>Or login with</Text>
            <View style={styles.separatorLine} />
          </View>

          {/* Email Input */}
          <View style={styles.inputWrapper}>
            <Ionicons
              name="mail-outline"
              size={20}
              color="#9CA3AF"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Email"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View style={styles.inputWrapper}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#9CA3AF"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <Pressable
              onPress={() => setShowPassword(!showPassword)}
              style={styles.passwordToggle}
            >
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={20}
                color="#9CA3AF"
              />
            </Pressable>
          </View>

          {/* Error Message */}
          {error && (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {/* Forgot Password Link */}
          <Pressable style={styles.forgotPasswordLink}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </Pressable>

          {/* Login Button */}
          <Pressable
            style={[
              styles.loginButton,
              {
                backgroundColor: isFormValid && !isLoading ? PRIMARY_COLOR : "#f5f5f6",
              },
            ]}
            onPress={handleLogin}
            disabled={!isFormValid || isLoading}
            android_ripple={{ color: "#fff" }}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text
                style={[
                  styles.loginButtonText,
                  { color: isFormValid ? "#fff" : "#c0c1c6" },
                ]}
              >
                Login
              </Text>
            )}
          </Pressable>

          {/* Register Link */}
          <View style={styles.registerLinkContainer}>
            <Text style={styles.registerText}>Dont have an account? </Text>
            <Pressable onPress={() => router.push("/(auth)/register")}>
              <Text style={styles.registerLink}>Register Now</Text>
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
    justifyContent: "space-between",
  },

  // --- Logo Section ---
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
    // Giả lập chữ C bị cắt
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
    color: "#6b7280",
  },

  // --- Social Buttons ---
  socialButtonsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 30,
  },
  socialButton: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: GRAY_BORDER,
    borderRadius: 10,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  socialButtonText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 15,
  },

  // --- Separator ---
  separatorContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: GRAY_BORDER,
  },
  separatorText: {
    marginHorizontal: 16,
    color: "#9CA3AF",
    fontSize: 14,
  },

  // --- Inputs ---
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: GRAY_BORDER,
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 55,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    paddingVertical: 0, // quan trọng để căn chỉnh chiều cao
  },
  passwordToggle: {
    padding: 5,
  },

  // --- Forgot Password ---
  forgotPasswordLink: {
    alignSelf: "flex-end",
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: FORGOT_PASSWORD_COLOR,
    fontWeight: "600",
    fontSize: 14,
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

  // --- Login Button ---
  loginButton: {
    borderRadius: 10,
    paddingVertical: 16,
    marginBottom: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "bold",
  },

  // --- Register Link ---
  registerLinkContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  registerText: {
    fontSize: 15,
    color: "#000",
  },
  registerLink: {
    fontSize: 15,
    fontWeight: "bold",
    color: PRIMARY_COLOR,
  },
});
