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
    if (selected.includes(id)) {
      setSelected(selected.filter(item => item !== id));
    } else {
      setSelected([...selected, id]);
    }
  };

  const displayed = ALL_ITEMS.filter(item => selected.includes(item.id));

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>ارزبان</Text>
      </View>

      <ScrollView style={styles.list}>
        {displayed.length === 0 ? (
          <Text style={styles.empty}>هیچ موردی انتخاب نشده</Text>
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
        <Text style={styles.sectionTitle}>انتخاب موارد</Text>
        {ALL_ITEMS.map(item => (
          <View key={item.id} style={styles.settingRow}>
            <Text style={styles.settingText}>{item.name}</Text>
            <Switch
              value={selected.includes(item.id)}
              onValueChange={() => toggleItem(item.id)}
              trackColor={{ false: '#767577', true: '#D4AF37' }}
              thumbColor={selected.includes(item.id) ? '#7C3AED' : '#f4f3f4'}
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0E17' },
  header: { backgroundColor: '#5B21B6', padding: 20, paddingTop: 50, alignItems: 'center' },
  title: { color: '#D4AF37', fontSize: 28, fontWeight: 'bold' },
  list: { flex: 1, padding: 16 },
  card: { backgroundColor: '#1A1A2E', borderRadius: 16, padding: 16, marginBottom: 12 },
  name: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  price: { color: '#D4AF37', fontSize: 16, marginTop: 8 },
  settings: { padding: 16, backgroundColor: '#0F0E17' },
  sectionTitle: { color: '#D4AF37', fontSize: 20, marginBottom: 12, fontWeight: 'bold' },
  settingRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#2D3748' },
  settingText: { color: '#E2E8F0', fontSize: 16 },
  empty: { color: '#D4AF37', fontSize: 18, textAlign: 'center', marginTop: 50 },
});
