import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../hooks/useAuth';

export default function HomeScreen() {
  const { userEmail, userRole, logout, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return null; // Will be redirected by index.tsx
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome!</Text>
        <Text style={styles.subtitle}>You are logged in</Text>
        
        {userEmail && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{userEmail}</Text>
          </View>
        )}
        
        {userRole && (
          <View style={styles.infoContainer}>
            <Text style={styles.infoLabel}>Role:</Text>
            <Text style={styles.infoValue}>{userRole}</Text>
          </View>
        )}

        <Pressable style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#6b7280',
    marginBottom: 40,
  },
  infoContainer: {
    width: '100%',
    padding: 16,
    backgroundColor: '#f5f5f6',
    borderRadius: 10,
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#000',
    fontWeight: '600',
  },
  logoutButton: {
    marginTop: 40,
    backgroundColor: '#6783ff',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 10,
    width: '100%',
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

