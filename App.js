import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  SafeAreaView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const API_KEY = 'freeGcIODOZyhFq6Lj2qz3ciQ0Jg6kWP';

// لیست کامل ارزها با اسامی API
const ALL_CURRENCIES = {
  gold: [
    { id: 'gerami', name: 'طلا ۱۸ عیار', icon: '💍' },
    { id: '18ayar', name: 'طلا ۲۴ عیار', icon: '🏆' },
    { id: 'mesghal', name: 'مثقال طلا', icon: '⚖️' },
    { id: 'ons', name: 'انس طلا', icon: '🥇' },
    { id: 'sekkeh', name: 'سکه امامی', icon: '🪙' },
    { id: 'bahar', name: 'سکه بهار', icon: '🌸' },
    { id: 'nim', name: 'نیم سکه', icon: '🔸' },
    { id: 'rob', name: 'ربع سکه', icon: '🔹' },
    { id: 'silver', name: 'نقره', icon: '⚪' },
  ],
  crypto: [
    { id: 'bitcoin', name: 'بیت‌کوین', icon: '₿', symbol: 'BTC' },
    { id: 'ethereum', name: 'اتریوم', icon: '♦️', symbol: 'ETH' },
    { id: 'ripple', name: 'ریپل', icon: '💠', symbol: 'XRP' },
    { id: 'toncoin', name: 'تون‌کوین', icon: '💎', symbol: 'TON' },
    { id: 'cardano', name: 'کاردانو', icon: '🔷', symbol: 'ADA' },
    { id: 'solana', name: 'سولانا', icon: '🌟', symbol: 'SOL' },
    { id: 'binance', name: 'بایننس‌کوین', icon: '🟡', symbol: 'BNB' },
    { id: 'dogecoin', name: 'دوج‌کوین', icon: '🐕', symbol: 'DOGE' },
  ],
  currency: [
    { id: 'usd_usdt', name: 'دلار آمریکا', icon: '🇺🇸', symbol: 'USD' },
    { id: 'eur', name: 'یورو', icon: '🇪🇺', symbol: 'EUR' },
    { id: 'gbp', name: 'پوند انگلیس', icon: '🇬🇧', symbol: 'GBP' },
    { id: 'chf', name: 'فرانک سوئیس', icon: '🇨🇭', symbol: 'CHF' },
    { id: 'try_tl', name: 'لیر ترکیه', icon: '🇹🇷', symbol: 'TRY' },
    { id: 'aed', name: 'درهم امارات', icon: '🇦🇪', symbol: 'AED' },
    { id: 'sar', name: 'ریال عربستان', icon: '🇸🇦', symbol: 'SAR' },
    { id: 'qar', name: 'ریال قطر', icon: '🇶🇦', symbol: 'QAR' },
    { id: 'omr', name: 'ریال عمان', icon: '🇴🇲', symbol: 'OMR' },
    { id: 'kwd', name: 'دینار کویت', icon: '🇰🇼', symbol: 'KWD' },
    { id: 'iqd', name: 'دینار عراق', icon: '🇮🇶', symbol: 'IQD' },
    { id: 'rub', name: 'روبل روسیه', icon: '🇷🇺', symbol: 'RUB' },
    { id: 'cny', name: 'یوان چین', icon: '🇨🇳', symbol: 'CNY' },
    { id: 'syp', name: 'پوند سوریه', icon: '🇸🇾', symbol: 'SYP' },
    { id: 'gel', name: 'لاری گرجستان', icon: '🇬🇪', symbol: 'GEL' },
    { id: 'amd', name: 'درام ارمنستان', icon: '🇦🇲', symbol: 'AMD' },
    { id: 'pkr', name: 'روپیه پاکستان', icon: '🇵🇰', symbol: 'PKR' },
    { id: 'inr', name: 'روپیه هند', icon: '🇮🇳', symbol: 'INR' },
    { id: 'azn', name: 'منات آذربایجان', icon: '🇦🇿', symbol: 'AZN' },
  ],
};

// پیش‌فرض: دلار، یورو، طلا، سکه، بیت‌کوین
const DEFAULT_SELECTED = ['usd_usdt', 'eur', 'gerami', 'sekkeh', 'bitcoin'];

export default function App() {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState(DEFAULT_SELECTED);
  const [persianDate, setPersianDate] = useState('');
  const [gregorianDate, setGregorianDate] = useState('');

  // تبدیل تاریخ میلادی به شمسی
  const convertToJalali = (date) => {
    const g_y = date.getFullYear();
    const g_m = date.getMonth() + 1;
    const g_d = date.getDate();
    
    const g_days = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    const jy = (g_y <= 1600) ? 0 : 979;
    const gd = g_days[g_m - 1] + g_d;
    
    let jd = 365 * jy + Math.floor(jy / 33) * 8 + Math.floor((jy % 33 + 3) / 4) + 78 + gd;
    if (g_m > 2 && ((g_y % 4 === 0 && g_y % 100 !== 0) || g_y % 400 === 0)) jd += 1;
    
    let j_y = -1595 + 33 * Math.floor(jd / 12053);
    jd %= 12053;
    j_y += 4 * Math.floor(jd / 1461);
    jd %= 1461;
    
    if (jd > 365) {
      j_y += Math.floor((jd - 1) / 365);
      jd = (jd - 1) % 365;
    }
    
    const j_m = (jd < 186) ? 1 + Math.floor(jd / 31) : 7 + Math.floor((jd - 186) / 30);
    const j_d = 1 + ((jd < 186) ? (jd % 31) : ((jd - 186) % 30));
    
    const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    return `${j_d} ${months[j_m - 1]} ${j_y}`;
  };

  const updateDates = () => {
    const now = new Date();
    setPersianDate(convertToJalali(now));
    setGregorianDate(now.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
  };

  const fetchRates = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // ساخت لیست آیتم‌ها برای API
      const items = selectedItems.join(',');
      const url = `https://api.navasan.tech/latest/?api_key=${API_KEY}&item=${items}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Accept': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error(`خطای ${response.status}`);
      }
      
      const data = await response.json();
      
      // پردازش داده‌ها
      const newRates = {};
      selectedItems.forEach(id => {
        const item = data[id];
        if (item && item.value) {
          newRates[id] = Math.round(item.value);
        }
      });
      
      setRates(newRates);
      updateDates();
      
    } catch (err) {
      setError('خطا در دریافت اطلاعات');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRates();
    const interval = setInterval(fetchRates, 60000); // هر دقیقه
    return () => clearInterval(interval);
  }, [selectedItems]);

  const toggleItem = (id) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const getItemInfo = (id) => {
    for (let category in ALL_CURRENCIES) {
      const found = ALL_CURRENCIES[category].find(item => item.id === id);
      if (found) return found;
    }
    return { name: id, icon: '💰' };
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* هدر */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.appTitle}>ارزبان 💰</Text>
          <TouchableOpacity onPress={fetchRates} style={styles.refreshButton}>
            <Text style={styles.refreshIcon}>↻</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.dateContainer}>
          <Text style={styles.datePersian}>{persianDate}</Text>
          <Text style={styles.dateGregorian}>{gregorianDate}</Text>
        </View>
      </View>

      {/* محتوا */}
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>در حال بروزرسانی...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity onPress={fetchRates} style={styles.retryButton}>
            <Text style={styles.retryText}>تلاش مجدد</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {selectedItems.map(id => {
            const info = getItemInfo(id);
            const value = rates[id];
            return (
              <View key={id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.icon}>{info.icon}</Text>
                  <Text style={styles.name}>{info.name}</Text>
                  {info.symbol && <Text style={styles.symbol}>{info.symbol}</Text>}
                </View>
                <Text style={styles.price}>
                  {value ? `${value.toLocaleString('fa-IR')} تومان` : '---'}
                </Text>
              </View>
            );
          })}
          
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
            <Text style={styles.settingsText}>تنظیم لیست نمایش</Text>
          </TouchableOpacity>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>به‌روزرسانی خودکار هر دقیقه</Text>
          </View>
        </ScrollView>
      )}

      {/* مودال انتخاب */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>انتخاب ارزها</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.modalList}>
              {Object.keys(ALL_CURRENCIES).map(category => (
                <View key={category}>
                  <Text style={styles.categoryTitle}>
                    {category === 'gold' ? '🏆 طلا و سکه' : 
                     category === 'crypto' ? '₿ کریپتو' : '💵 ارزها'}
                  </Text>
                  {ALL_CURRENCIES[category].map(item => (
                    <TouchableOpacity
                      key={item.id}
                      style={[
                        styles.modalItem,
                        selectedItems.includes(item.id) && styles.modalItemSelected
                      ]}
                      onPress={() => toggleItem(item.id)}
                    >
                      <Text style={styles.modalItemIcon}>{item.icon}</Text>
                      <Text style={styles.modalItemText}>{item.name}</Text>
                      {selectedItems.includes(item.id) && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              ))}
            </ScrollView>
            
            <TouchableOpacity 
              style={styles.doneButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.doneButtonText}>تایید ({selectedItems.length} مورد)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A0E27',
  },
  header: {
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    paddingTop: 15,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  refreshButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshIcon: {
    fontSize: 28,
    color: '#FFD700',
  },
  dateContainer: {
    alignItems: 'center',
  },
  datePersian: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  dateGregorian: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  loadingText: {
    color: '#FFD700',
    fontSize: 16,
    marginTop: 15,
  },
  errorIcon: {
    fontSize: 60,
    marginBottom: 15,
  },
  error: {
    color: '#FF6B6B',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 25,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  list: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#1A1F3A',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    fontSize: 28,
    marginRight: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
  },
  symbol: {
    fontSize: 14,
    color: 'rgba(255, 215, 0, 0.7)',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'right',
  },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#667eea',
    padding: 16,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 20,
  },
  settingsIcon: {
    fontSize: 24,
    marginRight: 10,
  },
  settingsText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.4)',
    fontSize: 12,
  },
  // مودال
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#1A1F3A',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: '80%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  closeButton: {
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  modalList: {
    padding: 15,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 15,
    marginBottom: 10,
    marginRight: 10,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    padding: 15,
    borderRadius: 12,
    marginBottom: 8,
  },
  modalItemSelected: {
    backgroundColor: 'rgba(102, 126, 234, 0.3)',
    borderWidth: 2,
    borderColor: '#667eea',
  },
  modalItemIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  modalItemText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF',
  },
  checkmark: {
    fontSize: 24,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  doneButton: {
    backgroundColor: '#667eea',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
  },
  doneButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
