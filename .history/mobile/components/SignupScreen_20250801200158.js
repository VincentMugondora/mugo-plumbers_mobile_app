import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { auth } from '../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';

import * as AuthSession from 'expo-auth-session';
import Constants from 'expo-constants';
import { GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import * as WebBrowser from 'expo-web-browser';

import { db } from '../firebase';
import { setDoc, doc } from 'firebase/firestore';

export default function SignupScreen({ role, onSignUp, onGoogle, onFacebook, onLogin }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSignUp = async () => {
    setError(null);
    if (!email || !password || !fullName) {
      setError('Please fill all required fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      // Save user role to Firestore
      await setDoc(doc(db, 'users', userCred.user.uid), {
        fullName,
        email,
        phone,
        role: role || 'customer',
        createdAt: new Date()
      });
      await sendEmailVerification(userCred.user);
      setLoading(false);
      if (onSignUp) onSignUp();
    } catch (e) {
      setLoading(false);
      setError(e.message || 'Sign up failed.');
    }
  };

  // Google sign up handler
  const handleGoogleSignUp = async () => {
    setError(null);
    setLoading(true);
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
        setError('Google sign in cancelled.');
      }
    } catch (e) {
      console.log('Google sign in error:', e);
      setLoading(false);
      setError('Google sign in failed.');
    }
  };

  // Facebook sign up handler
  const handleFacebookSignUp = async () => {
    setError(null);
    setLoading(true);
    try {
      const appId = Constants?.expoConfig?.extra?.FACEBOOK_APP_ID || Constants?.manifest?.extra?.FACEBOOK_APP_ID || process.env.FACEBOOK_APP_ID;
      const redirectUri = AuthSession.makeRedirectUri({ useProxy: true });
      const result = await AuthSession.startAsync({
        authUrl:
          `https://www.facebook.com/v10.0/dialog/oauth?` +
          `client_id=${appId}` +
          `&redirect_uri=${encodeURIComponent(redirectUri)}` +
          `&response_type=token` +
          `&scope=email,public_profile`,
      });
      if (result.type === 'success' && result.params.access_token) {
        const credential = FacebookAuthProvider.credential(result.params.access_token);
        await signInWithCredential(auth, credential);
        setLoading(false);
        if (onFacebook) onFacebook();
      } else {
        setLoading(false);
        setError('Facebook sign in cancelled.');
      }
    } catch (e) {
      console.log('Facebook sign in error:', e);
      setLoading(false);
      setError('Facebook sign in failed.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Create Your Account</Text>
        <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignUp}>
          <FontAwesome name="google" size={22} color="#EA4335" style={styles.socialIcon} />
          <Text style={styles.socialButtonText}>Continue with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialButton} onPress={handleFacebookSignUp}>
          <FontAwesome name="facebook" size={22} color="#1877F3" style={styles.socialIcon} />
          <Text style={styles.socialButtonText}>Continue with Facebook</Text>
        </TouchableOpacity>
        <View style={styles.dividerRow}>
          <View style={styles.divider} />
          <Text style={styles.orText}>or</Text>
          <View style={styles.divider} />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Phone Number"
          value={phone}
          onChangeText={setPhone}
          keyboardType="phone-pad"
        />
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <FontAwesome name={showPassword ? 'eye' : 'eye-slash'} size={20} color="#888" style={styles.eyeIcon} />
          </TouchableOpacity>
        </View>
        <View style={styles.passwordRow}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showConfirmPassword}
          />
          <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
            <FontAwesome name={showConfirmPassword ? 'eye' : 'eye-slash'} size={20} color="#888" style={styles.eyeIcon} />
          </TouchableOpacity>
        </View>
        {error ? <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text> : null}
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp} disabled={loading}>
          <Text style={styles.signUpButtonText}>{loading ? 'Signing Up...' : 'Sign Up'}</Text>
        </TouchableOpacity>
        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={onLogin}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#222',
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
  passwordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 12,
  },
  eyeIcon: {
    marginLeft: 8,
  },
  signUpButton: {
    width: '100%',
    backgroundColor: '#0099e5',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  signUpButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  loginText: {
    color: '#666',
    fontSize: 14,
  },
  loginLink: {
    color: '#0099e5',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
