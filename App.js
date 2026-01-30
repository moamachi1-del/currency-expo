import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Switch,
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

  const toggleItem = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const displayed = ALL_ITEMS.filter(item => selected.includes(item.id));

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>ارزبان</Text>
        <TouchableOpacity style={styles.refreshBtn}>
          <Text style={styles.refreshIcon}>↻</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.list}>
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
      </ScrollView>

      <ScrollView style={styles.settings}>
        <Text style={styles.sectionTitle}>انتخاب موارد دلخواه</Text>
        {ALL_ITEMS.map(item => (
          <View key={item.id} style={styles.settingRow}>
            <Text style={styles.settingText}>{item.name}</Text>
            <Switch
              value={selected.includes(item.id)}
              onValueChange={() => toggleItem(item.id)}
              trackColor={{ false: '#CBD5E0', true: '#D4AF37' }}
              thumbColor={selected.includes(item.id) ? '#7C3AED' : '#A0AEC0'}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
  header: { backgroundColor: '#6B46C1', padding: 24, paddingTop: 60, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', elevation: 4 },
  title: { color: '#FFD700', fontSize: 34, fontWeight: 'bold' },
  refreshBtn: { backgroundColor: '#9F7AEA', borderRadius: 50, width: 44, height: 44, justifyContent: 'center', alignItems: 'center' },
  refreshIcon: { color: '#FFFFFF', fontSize: 28 },
  list: { flex: 1, padding: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 20, padding: 20, marginBottom: 16, borderWidth: 2, borderColor: '#E9D5FF', shadowColor: '#7C3AED', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 5 },
  name: { color: '#2D3748', fontSize: 22, fontWeight: '600' },
  price: { color: '#D69E2E', fontSize: 20, marginTop: 8, fontWeight: 'bold' },
  settings: { padding: 16, backgroundColor: '#F9FAFB' },
  sectionTitle: { color: '#6B46C1', fontSize: 24, marginBottom: 16, fontWeight: 'bold', textAlign: 'center' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  settingText: { color: '#2D3748', fontSize: 18 },
  empty: { color: '#718096', fontSize: 22, textAlign: 'center', marginTop: 120, fontWeight: '500' },
});
