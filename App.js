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
  { id: 'gold18', name: 'طلا ۱۸ عیار' },
  { id: 'gold24', name: 'طلا ۲۴ عیار' },
  { id: 'mesghal', name: 'مثقال طلا' },
  { id: 'ons', name: 'انس طلا' },
  { id: 'sekeemami', name: 'سکه امامی' },
  { id: 'sekebahar', name: 'سکه بهار' },
  { id: 'nimseke', name: 'نیم سکه' },
  { id: 'robseke', name: 'ربع سکه' },
  { id: 'naghr', name: 'نقره' },
  { id: 'btc', name: 'بیت‌کوین' },
  { id: 'eth', name: 'اتریوم' },
  { id: 'xrp', name: 'ریپل' },
  { id: 'ton', name: 'تون‌کوین' },
  { id: 'ada', name: 'کاردانو' },
  { id: 'sol', name: 'سولانا' },
  { id: 'bnb', name: 'بایننس‌کوین' },
  { id: 'doge', name: 'دوج‌کوین' },
  { id: 'usd', name: 'دلار آمریکا' },
  { id: 'eur', name: 'یورو' },
  { id: 'gbp', name: 'پوند انگلیس' },
  { id: 'chf', name: 'فرانک سوئیس' },
  { id: 'try', name: 'لیر ترکیه' },
  { id: 'aed', name: 'درهم امارات' },
  { id: 'sar', name: 'ریال عربستان' },
  { id: 'qar', name: 'ریال قطر' },
  { id: 'omr', name: 'ریال عمان' },
  { id: 'kwd', name: 'دینار کویت' },
  { id: 'iqd', name: 'دینار عراق' },
  { id: 'rub', name: 'روبل روسیه' },
  { id: 'cny', name: 'یوان چین' },
  { id: 'syp', name: 'پوند سوریه' },
  { id: 'gel', name: 'لاری گرجستان' },
  { id: 'amd', name: 'درام ارمنستان' },
  { id: 'pkr', name: 'روپیه پاکستان' },
  { id: 'inr', name: 'روپیه هند' },
  { id: 'azn', name: 'منات آذربایجان' },
];

export default function App() {
  const [selected, setSelected] = useState([]);
  const [editing, setEditing] = useState(false);

  const toggleItem = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const displayed = ALL_ITEMS.filter(item => selected.includes(item.id));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setEditing(!editing)}>
          <Text style={styles.editBtn}>{editing ? 'بستن' : 'تغییر لیست'}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>ارزبان</Text>
        <TouchableOpacity>
          <Text style={styles.refresh}>↻</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.listSection}>
          <Text style={styles.sectionTitle}>انتخاب‌های شما</Text>
          {displayed.length === 0 ? (
            <Text style={styles.empty}>موردی انتخاب نشده</Text>
          ) : (
            displayed.map(item => (
              <View key={item.id} style={styles.card}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.price}>قیمت: --- تومان</Text>
              </View>
            ))
          )}
        </View>

        {editing && (
          <View style={styles.editSection}>
            <Text style={styles.sectionTitle}>انتخاب موارد</Text>
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
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAF9F6' },
  header: { backgroundColor: '#6B46C1', padding: 20, paddingTop: 50, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#FFD700', fontSize: 32, fontWeight: 'bold' },
  editBtn: { color: '#FFD700', fontSize: 18 },
  refresh: { color: '#FFD700', fontSize: 28 },
  content: { flex: 1 },
  listSection: { padding: 16 },
  editSection: { padding: 16, backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, marginTop: 16 },
  sectionTitle: { color: '#6B46C1', fontSize: 22, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 2, borderColor: '#E9D5FF', shadowColor: '#6B46C1', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 10, elevation: 5 },
  name: { color: '#1F2937', fontSize: 22, fontWeight: '600' },
  price: { color: '#D97706', fontSize: 20, marginTop: 8 },
  empty: { color: '#718096', fontSize: 20, textAlign: 'center', marginTop: 80 },
  editRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  editText: { color: '#1F2937', fontSize: 18 },
});
