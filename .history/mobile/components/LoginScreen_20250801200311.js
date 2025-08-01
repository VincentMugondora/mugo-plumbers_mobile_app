import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const LOGO_ICON = require('../assets/images/logo1.png');
const LOGO_LOADING = require('../assets/images/favicon.png');

import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import { GoogleAuthProvider, FacebookAuthProvider, signInWithCredential } from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';
import { auth } from '../firebase';

export default function LoginScreen({ onLogin, onSignUp, onGoogle, onFacebook, onResetPassword }) {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleLogin = () => {
    setLoading(true);
    // Simulate login
    setTimeout(() => {
      setLoading(false);
      if (onLogin) onLogin(emailOrPhone, password);
    }, 1000);
  };

  // Google login handler
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const clientId = Constants?.expoConfig?.extra?.GOOGLE_CLIENT_ID || Constants?.manifest?.extra?.GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID;
      const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
      
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${clientId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=token` +
        `&scope=profile%20email`;
      
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
      
      if (result.type === 'success' && result.url) {
        const url = new URL(result.url);
        const accessToken = url.hash.substring(1).split('&').find(param => param.startsWith('access_token='))?.split('=')[1];
        
        if (accessToken) {
          const credential = GoogleAuthProvider.credential(null, accessToken);
          await signInWithCredential(auth, credential);
          setLoading(false);
          if (onGoogle) onGoogle();
        } else {
          setLoading(false);
          setError('Failed to get access token.');
        }
      } else {
        setLoading(false);
        setError('Google login cancelled.');
      }
    } catch (e) {
      console.log('Google login error:', e);
      setLoading(false);
      setError('Google login failed.');
    }
  };

  // Facebook login handler
  const handleFacebookLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const appId = Constants?.expoConfig?.extra?.FACEBOOK_APP_ID || Constants?.manifest?.extra?.FACEBOOK_APP_ID || process.env.FACEBOOK_APP_ID;
      const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
      
      const authUrl = `https://www.facebook.com/v10.0/dialog/oauth?` +
        `client_id=${appId}` +
        `&redirect_uri=${encodeURIComponent(redirectUri)}` +
        `&response_type=token` +
        `&scope=email,public_profile`;
      
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUri);
      
      if (result.type === 'success' && result.url) {
        const url = new URL(result.url);
        const accessToken = url.hash.substring(1).split('&').find(param => param.startsWith('access_token='))?.split('=')[1];
        
        if (accessToken) {
          const credential = FacebookAuthProvider.credential(accessToken);
          await signInWithCredential(auth, credential);
          setLoading(false);
          if (onFacebook) onFacebook();
        } else {
          setLoading(false);
          setError('Failed to get access token.');
        }
      } else {
        setLoading(false);
        setError('Facebook login cancelled.');
      }
    } catch (e) {
      console.log('Facebook login error:', e);
      setLoading(false);
      setError('Facebook login failed.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {loading ? (
          <ActivityIndicator size="large" color="#0099e5" style={styles.logo} />
        ) : (
          <Image source={LOGO_ICON} style={styles.logo} resizeMode="contain" />
        )}
        <Text style={styles.title}>Welcome Back!</Text>
        <Text style={styles.subtitle}>Login to your account or sign up</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email or phone number"
          value={emailOrPhone}
          onChangeText={setEmailOrPhone}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signUpButton} onPress={onSignUp}>
          <Text style={styles.signUpButtonText}>Sign Up</Text>
        </TouchableOpacity>
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.divider} />
        </View>
        <TouchableOpacity style={styles.socialButton} onPress={handleGoogleLogin}>
          <FontAwesome name="google" size={22} color="#EA4335" style={styles.socialIcon} />
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
          <FontAwesome name="facebook" size={22} color="#1877F3" style={styles.socialIcon} />
          <Text style={styles.socialButtonText}>Continue with Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onResetPassword} style={styles.resetLink}>
          <Text style={styles.resetText}>Forgot your password? <Text style={styles.resetNow}>Reset Now</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logo: {
    width: 48,
    height: 48,
    marginBottom: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#222',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  input: {
    width: '100%',
    height: 44,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 12,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  loginButton: {
    width: '100%',
    backgroundColor: '#0099e5',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 8,
  },
  loginButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  signUpButton: {
    width: '100%',
    borderColor: '#0099e5',
    borderWidth: 1,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  signUpButtonText: {
    color: '#0099e5',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 8,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0',
  },
  orText: {
    marginHorizontal: 8,
    color: '#888',
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  socialIcon: {
    width: 22,
    height: 22,
    marginRight: 12,
  },
  socialButtonText: {
    fontSize: 15,
    color: '#222',
  },
  resetLink: {
    marginTop: 8,
  },
  resetText: {
    color: '#666',
    fontSize: 14,
  },
  resetNow: {
    color: '#0099e5',
    fontWeight: 'bold',
  },
});
