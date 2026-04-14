import { ActivityIndicator, View } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from '../hooks/use-auth';

export default function Index() {
  const { user, profile, isInitialized } = useAuth();

  if (!isInitialized || (user && !profile)) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000000' }}>
        <ActivityIndicator size="large" color="#EEEEEE" />
      </View>
    );
  }

  if (user && profile?.role === 'student') {
    return <Redirect href="/(tabs)" />;
  }

  if (user && profile?.role === 'admin') {
    return <Redirect href="/(admin)" />;
  }

  // Not authenticated
  return <Redirect href="/(auth)/login" />;
}
