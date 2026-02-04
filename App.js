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
  RefreshControl,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = 'B2JhTivIrHZHFFJDdKtE1vxP1Mp3LBuH';
const API_URL = `https://BrsApi.ir/Api/Market/Gold_Currency.php?key=${API_KEY}`;
const CACHE_KEY = '@arzban_cache';
const LAST_UPDATE_KEY = '@arzban_last_update';
const SELECTED_ITEMS_KEY = '@arzban_selected';

// مپینگ symbol به اطلاعات نمایشی
const DISPLAY_MAP = {
  // طلا
  'IR_GOLD_18K': { name: 'طلا ۱۸ عیار', icon: '💍', category: 'gold' },
  'IR_GOLD_24K': { name: 'طلا ۲۴ عیار', icon: '🏆', category: 'gold' },
  'IR_GOLD_MESGHAL': { name: 'مثقال طلا', icon: '⚖️', category: 'gold' },
  'IR_GOLD_OUNCE': { name: 'انس طلا', icon: '🥇', category: 'gold' },
  
  // سکه
  'IR_COIN_EMAMI': { name: 'سکه امامی', icon: '🪙', category: 'gold' },
  'IR_COIN_BAHAR': { name: 'سکه بهار', icon: '🌸', category: 'gold' },
  'IR_COIN_HALF': { name: 'نیم سکه', icon: '🔸', category: 'gold' },
  'IR_COIN_QUARTER': { name: 'ربع سکه', icon: '🔹', category: 'gold' },
  
  // ارز
  'USDT_IRT': { name: 'تتر (دلار)', icon: '🇺🇸', category: 'currency' },
  'EUR': { name: 'یورو', icon: '🇪🇺', category: 'currency' },
  'GBP': { name: 'پوند', icon: '🇬🇧', category: 'currency' },
  'CHF': { name: 'فرانک سوئیس', icon: '🇨🇭', category: 'currency' },
  'TRY': { name: 'لیر ترکیه', icon: '🇹🇷', category: 'currency' },
  'AED': { name: 'درهم امارات', icon: '🇦🇪', category: 'currency' },
  'CNY': { name: 'یوان چین', icon: '🇨🇳', category: 'currency' },
  'RUB': { name: 'روبل روسیه', icon: '🇷🇺', category: 'currency' },
  
  // کریپتو
  'BTC': { name: 'بیت‌کوین', icon: '₿', category: 'crypto' },
  'ETH': { name: 'اتریوم', icon: '♦️', category: 'crypto' },
  'USDT': { name: 'تتر', icon: '💵', category: 'crypto' },
};

// پیش‌فرض
const DEFAULT_SELECTED = ['USDT_IRT', 'EUR', 'IR_GOLD_18K', 'IR_COIN_EMAMI', 'BTC'];

export default function App() {
  const [rates, setRates] = useState({});
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState(DEFAULT_SELECTED);
  const [lastUpdate, setLastUpdate] = useState('');
  const [persianDate, setPersianDate] = useState('');
  const [gregorianDate, setGregorianDate] = useState('');

  // تبدیل به شمسی
  const convertToJalali = (date) => {
    const g_y = date.getFullYear();
    const g_m = date.getMonth() + 1;
    const g_d = date.getDate();
    
    const g_days = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    let jy = (g_y <= 1600) ? 0 : 979;
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
    
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setGregorianDate(`${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${hours}:${minutes}`);
    setLastUpdate(`${hours}:${minutes}`);
  };

  // کش
  const loadFromCache = async () => {
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      const cachedUpdate = await AsyncStorage.getItem(LAST_UPDATE_KEY);
      const cachedSelected = await AsyncStorage.getItem(SELECTED_ITEMS_KEY);
      
      if (cachedData) setRates(JSON.parse(cachedData));
      if (cachedUpdate) setLastUpdate(cachedUpdate);
      if (cachedSelected) setSelectedItems(JSON.parse(cachedSelected));
      updateDates();
    } catch (error) {
      console.log('خطا در بارگذاری کش');
    }
  };

  const saveToCache = async (data, updateTime) => {
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
      await AsyncStorage.setItem(LAST_UPDATE_KEY, updateTime);
    } catch (error) {
      console.log('خطا در ذخیره');
    }
  };

  const saveSelectedItems = async (items) => {
    try {
      await AsyncStorage.setItem(SELECTED_ITEMS_KEY, JSON.stringify(items));
    } catch (error) {
      console.log('خطا');
    }
  };

  // دریافت از API
  const fetchRates = async (isManual = false) => {
    if (isManual) setRefreshing(true);
    setError(null);
    
    try {
      const response = await fetch(API_URL, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'ArzbanApp/1.0',
        }
      });
      
      if (!response.ok) {
        throw new Error(`خطای ${response.status}`);
      }
      
      const data = await response.json();
      
      // پردازش داده
      const newRates = {};
      const items = [];
      
      // طلا
      if (data.gold && Array.isArray(data.gold)) {
        data.gold.forEach(item => {
          if (item.symbol && item.price) {
            newRates[item.symbol] = parseInt(item.price);
            items.push(item.symbol);
          }
        });
      }
      
      // ارز
      if (data.currency && Array.isArray(data.currency)) {
        data.currency.forEach(item => {
          if (item.symbol && item.price) {
            newRates[item.symbol] = parseInt(item.price);
            items.push(item.symbol);
          }
        });
      }
      
      // کریپتو
      if (data.cryptocurrency && Array.isArray(data.cryptocurrency)) {
        data.cryptocurrency.forEach(item => {
          if (item.symbol && item.price) {
            newRates[item.symbol] = parseInt(item.price);
            items.push(item.symbol);
          }
        });
      }
      
      setRates(newRates);
      setAllItems(items);
      updateDates();
      
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      await saveToCache(newRates, timeStr);
      
    } catch (err) {
      setError('خطا در دریافت: ' + err.message);
    }
    
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    const init = async () => {
      await loadFromCache();
      setLoading(false);
      await fetchRates();
    };
    
    init();
    
    // هر 5 دقیقه
    const interval = setInterval(() => {
      fetchRates();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    saveSelectedItems(selectedItems);
  }, [selectedItems]);

  const toggleItem = (symbol) => {
    if (selectedItems.includes(symbol)) {
      setSelectedItems(selectedItems.filter(item => item !== symbol));
    } else {
      setSelectedItems([...selectedItems, symbol]);
    }
  };

  const getDisplayInfo = (symbol) => {
    return DISPLAY_MAP[symbol] || { name: symbol, icon: '💰', category: 'other' };
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* هدر */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.appTitle}>ارزبان 💰</Text>
          <TouchableOpacity onPress={() => fetchRates(true)} style={styles.refreshButton}>
            <Text style={styles.refreshIcon}>↻</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.dateContainer}>
          <Text style={styles.datePersian}>{persianDate}</Text>
          <Text style={styles.dateGregorian}>{gregorianDate}</Text>
          <Text style={styles.lastUpdateText}>آخرین بروزرسانی: {lastUpdate}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#FFD700" />
          <Text style={styles.loadingText}>در حال بارگذاری...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity onPress={() => fetchRates(true)} style={styles.retryButton}>
            <Text style={styles.retryText}>تلاش مجدد</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          style={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchRates(true)} colors={['#FFD700']} />
          }
        >
          {selectedItems.map(symbol => {
            const info = getDisplayInfo(symbol);
            const value = rates[symbol];
            
            return (
              <View key={symbol} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.icon}>{info.icon}</Text>
                  <Text style={styles.name}>{info.name}</Text>
                </View>
                <Text style={styles.price}>
                  {value ? `${value.toLocaleString('fa-IR')} تومان` : 'بارگذاری...'}
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
            <Text style={styles.footerText}>بروزرسانی خودکار هر ۵ دقیقه</Text>
            <Text style={styles.footerTextSmall}>برای رفرش، پایین بکشید</Text>
          </View>
        </ScrollView>
      )}

      {/* مودال */}
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
              {['gold', 'currency', 'crypto'].map(category => {
                const categoryItems = allItems.filter(symbol => {
                  const info = getDisplayInfo(symbol);
                  return info.category === category;
                });
                
                if (categoryItems.length === 0) return null;
                
                return (
                  <View key={category}>
                    <Text style={styles.categoryTitle}>
                      {category === 'gold' ? '🏆 طلا و سکه' : 
                       category === 'crypto' ? '₿ کریپتو' : '💵 ارزها'}
                    </Text>
                    {categoryItems.map(symbol => {
                      const info = getDisplayInfo(symbol);
                      return (
                        <TouchableOpacity
                          key={symbol}
                          style={[
                            styles.modalItem,
                            selectedItems.includes(symbol) && styles.modalItemSelected
                          ]}
                          onPress={() => toggleItem(symbol)}
                        >
                          <Text style={styles.modalItemIcon}>{info.icon}</Text>
                          <Text style={styles.modalItemText}>{info.name}</Text>
                          {selectedItems.includes(symbol) && (
                            <Text style={styles.checkmark}>✓</Text>
                          )}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                );
              })}
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
  container: { flex: 1, backgroundColor: '#0A0E27' },
  header: {
    backgroundColor: '#6C5CE7',
    paddingTop: 15,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  appTitle: { fontSize: 32, fontWeight: 'bold', color: '#FFD700', textShadowColor: 'rgba(0, 0, 0, 0.3)', textShadowOffset: { width: 2, height: 2 }, textShadowRadius: 4 },
  refreshButton: { width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(255, 255, 255, 0.2)', justifyContent: 'center', alignItems: 'center' },
  refreshIcon: { fontSize: 28, color: '#FFD700' },
  dateContainer: { alignItems: 'center' },
  datePersian: { fontSize: 18, fontWeight: '600', color: '#FFFFFF', marginBottom: 4 },
  dateGregorian: { fontSize: 13, color: 'rgba(255, 255, 255, 0.7)', marginBottom: 4 },
  lastUpdateText: { fontSize: 11, color: 'rgba(255, 215, 0, 0.8)' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  loadingText: { color: '#FFD700', fontSize: 16, marginTop: 15 },
  errorIcon: { fontSize: 60, marginBottom: 15 },
  error: { color: '#FF6B6B', fontSize: 18, textAlign: 'center', marginBottom: 20 },
  retryButton: { backgroundColor: '#6C5CE7', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
  retryText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  list: { flex: 1, padding: 16 },
  card: { backgroundColor: '#1A1F3A', borderRadius: 20, padding: 20, marginBottom: 12, borderWidth: 1, borderColor: 'rgba(255, 215, 0, 0.1)', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  icon: { fontSize: 28, marginRight: 12 },
  name: { fontSize: 18, fontWeight: '600', color: '#FFFFFF', flex: 1 },
  price: { fontSize: 24, fontWeight: 'bold', color: '#FFD700', textAlign: 'right' },
  settingsButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#6C5CE7', padding: 16, borderRadius: 15, marginTop: 10, marginBottom: 20 },
  settingsIcon: { fontSize: 24, marginRight: 10 },
  settingsText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  footer: { alignItems: 'center', paddingVertical: 20 },
  footerText: { color: 'rgba(255, 255, 255, 0.4)', fontSize: 12, marginBottom: 4 },
  footerTextSmall: { color: 'rgba(255, 255, 255, 0.3)', fontSize: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.8)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#1A1F3A', borderTopLeftRadius: 30, borderTopRightRadius: 30, maxHeight: '80%', paddingBottom: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: 'rgba(255, 255, 255, 0.1)' },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFD700' },
  closeButton: { fontSize: 30, color: '#FFFFFF', fontWeight: '300' },
  modalList: { padding: 15 },
  categoryTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFD700', marginTop: 15, marginBottom: 10, marginRight: 10 },
  modalItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.05)', padding: 15, borderRadius: 12, marginBottom: 8 },
  modalItemSelected: { backgroundColor: 'rgba(108, 92, 231, 0.3)', borderWidth: 2, borderColor: '#6C5CE7' },
  modalItemIcon: { fontSize: 24, marginRight: 12 },
  modalItemText: { flex: 1, fontSize: 16, color: '#FFFFFF' },
  checkmark: { fontSize: 24, color: '#FFD700', fontWeight: 'bold' },
  doneButton: { backgroundColor: '#6C5CE7', marginHorizontal: 20, padding: 16, borderRadius: 15, alignItems: 'center' },
  doneButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});
