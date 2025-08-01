import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

import { auth } from '../firebase';
import { checkActionCode, applyActionCode } from 'firebase/auth';
import { useRouter } from 'expo-router';

export default function VerifyEmailScreen({ email = "example@mugo.com", onVerify, onResend }) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleVerify = async () => {
    setError(null);
    setLoading(true);
    try {
      // Firebase email verification uses oobCode in URL, not a user-entered code.
      // Here, we simulate code entry for demo. In production, you would deep link from email.
      await checkActionCode(auth, code);
      await applyActionCode(auth, code);
      setLoading(false);
      if (onVerify) onVerify(code);
      router.replace('/login');
    } catch (e) {
      setLoading(false);
      setError('Invalid or expired verification code.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <FontAwesome name="envelope-o" size={40} color="#0099e5" style={styles.icon} />
        <Text style={styles.title}>Check your email!</Text>
        <Text style={styles.infoText}>
          We have sent a 6-digit verification code to{' '}
          <Text style={styles.emailText}>{email}</Text>. Please check your inbox and spam folder.
        </Text>
        <Text style={styles.infoText}>
          Enter the code below to continue with your account setup.
        </Text>
        <Text style={styles.label}>Enter verification code</Text>
        <TextInput
          style={styles.codeInput}
          placeholder="------"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
        />
        <TouchableOpacity style={styles.verifyButton} onPress={() => onVerify && onVerify(code)}>
          <Text style={styles.verifyButtonText}>Verify Code</Text>
        </TouchableOpacity>
        <Text style={styles.resendInfo}>Didn't receive the email?</Text>
        <TouchableOpacity onPress={onResend}>
          <Text style={styles.resendLink}>Resend Code</Text>
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
  icon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#222',
    textAlign: 'center',
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    textAlign: 'center',
  },
  emailText: {
    color: '#0099e5',
    fontWeight: 'bold',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
    color: '#222',
    textAlign: 'center',
  },
  codeInput: {
    width: '100%',
    height: 48,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
    paddingHorizontal: 20,
    fontSize: 28,
    letterSpacing: 16,
    textAlign: 'center',
    backgroundColor: '#f8f8f8',
  },
  verifyButton: {
    width: '100%',
    backgroundColor: '#0099e5',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  verifyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  resendInfo: {
    color: '#666',
    fontSize: 13,
    textAlign: 'center',
  },
  resendLink: {
    color: '#0099e5',
    fontWeight: 'bold',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 2,
  },
});
