import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const ROLES = [
  {
    key: 'customer',
    label: 'Customer',
    icon: 'home',
    description: 'Manage your service requests, view appointments, and track plumber progress. For homeowners and businesses seeking plumbing solutions.'
  },
  {
    key: 'plumber',
    label: 'Plumber',
    icon: 'wrench',
    description: 'Access job assignments, manage your schedule, update job statuses, and communicate with customers. For certified plumbing professionals.'
  },
  {
    key: 'admin',
    label: 'Admin',
    icon: 'shield',
    description: 'Oversee all operations, manage user accounts, assign tasks, and access system analytics. For platform administrators and managers.'
  }
];

export default function ChooseRoleScreen({ onProceed }) {
  const [selected, setSelected] = useState(null);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Choose Role</Text>
      <Text style={styles.subtitle}>Welcome! Select your role.</Text>
      <Text style={styles.info}>Please choose the role that best describes your interaction with the platform. This will customize your experience and access.</Text>
      {ROLES.map(role => (
        <TouchableOpacity
          key={role.key}
          style={[styles.roleCard, selected === role.key && styles.selectedCard]}
          onPress={() => setSelected(role.key)}
        >
          <FontAwesome name={role.icon} size={24} color="#0099e5" style={styles.icon} />
          <View style={{ flex: 1 }}>
            <Text style={styles.roleLabel}>{role.label}</Text>
            <Text style={styles.roleDesc}>{role.description}</Text>
          </View>
        </TouchableOpacity>
      ))}
      <TouchableOpacity
        style={[styles.proceedBtn, !selected && styles.disabledBtn]}
        disabled={!selected}
        onPress={() => onProceed(selected)}
      >
        <Text style={styles.proceedText}>Proceed as Role</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 24, paddingTop: 60 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  subtitle: { fontSize: 17, fontWeight: '600', textAlign: 'center', marginBottom: 8 },
  info: { fontSize: 14, color: '#555', textAlign: 'center', marginBottom: 18 },
  roleCard: { flexDirection: 'row', alignItems: 'flex-start', backgroundColor: '#f7fafd', borderRadius: 12, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: '#e0e7ef' },
  selectedCard: { borderColor: '#0099e5', backgroundColor: '#e6f3fa' },
  icon: { marginRight: 16, marginTop: 2 },
  roleLabel: { fontSize: 16, fontWeight: 'bold', marginBottom: 2 },
  roleDesc: { fontSize: 13, color: '#555' },
  proceedBtn: { backgroundColor: '#b3c8d9', borderRadius: 8, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  disabledBtn: { backgroundColor: '#dbe7ef' },
  proceedText: { color: '#fff', fontWeight: 'bold', fontSize: 16, letterSpacing: 0.5 },
});
