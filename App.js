import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const ALL_ITEMS = [
  { id: 'usd', name: 'دلار آمریکا' },
  { id: 'eur', name: 'یورو' },
  { id: 'gold18', name: 'طلا ۱۸ عیار' },
  { id: 'sekeemami', name: 'سکه امامی' },
  { id: 'btc', name: 'بیت‌کوین' },
  // بقیه رو بعداً اضافه می‌کنیم
];

export default function App() {
  const [selected, setSelected] = useState([]);
  const [editing, setEditing] = useState(false); // حالت ویرایش لیست

  const toggleItem = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const confirmSelection = () => {
    setEditing(false);
  };

  const displayed = ALL_ITEMS.filter(item => selected.includes(item.id));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setEditing(true)}>
          <Text style={styles.editBtn}>تغییر لیست</Text>
        </TouchableOpacity>
        <Text style={styles.title}>ارزبان</Text>
        <TouchableOpacity>
          <Text style={styles.refresh}>↻</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list}>
        {displayed.length === 0 ? (
          <Text style={styles.empty}>موردی انتخاب نشده</Text>
        ) : (
          displayed.map(item => (
            <View key={item.id} style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>--- تومان</Text>
            </View>
          ))
        )}
      </ScrollView>

      {editing && (
        <View style={styles.editContainer}>
          <ScrollView style={styles.editList}>
            {ALL_ITEMS.map(item => (
              <View key={item.id} style={styles.editRow}>
                <Text style={styles.editText}>{item.name}</Text>
                <Switch
                  value={selected.includes(item.id)}
                  onValueChange={() => toggleItem(item.id)}
                  trackColor={{ false: '#CBD5E0', true: '#D4AF37' }}
                  thumbColor={selected.includes(item.id) ? '#7C3AED' : '#A0AEC0'}
                />
              </View>
            ))}
          </ScrollView>
          <TouchableOpacity style={styles.confirmBtn} onPress={confirmSelection}>
            <Text style={styles.confirmText}>تأیید انتخاب‌ها</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9F6' },
  header: { backgroundColor: '#6B46C1', padding: 20, paddingTop: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#FFD700', fontSize: 30, fontWeight: 'bold' },
  editBtn: { color: '#FFD700', fontSize: 18 },
  refresh: { color: '#FFD700', fontSize: 28 },
  list: { flex: 1, padding: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  name: { color: '#1F2937', fontSize: 20, fontWeight: 'bold' },
  price: { color: '#D69E2E', fontSize: 18, marginTop: 8 },
  empty: { color: '#718096', fontSize: 20, textAlign: 'center', marginTop: 100 },
  editContainer: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 16, maxHeight: '50%' },
  editList: { flex: 1 },
  editRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  editText: { color: '#1F2937', fontSize: 18 },
  confirmBtn: { backgroundColor: '#6B46C1', borderRadius: 12, padding: 16, alignItems: 'center', marginTop: 16 },
  confirmText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});
