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
  TextInput,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = 'B2JhTivIrHZHFFJDdKtE1vxP1Mp3LBuH';
const API_URL = `https://BrsApi.ir/Api/Market/Gold_Currency.php?key=${API_KEY}`;
const CACHE_KEY = '@arzban_cache';
const LAST_UPDATE_KEY = '@arzban_last_update';
const SELECTED_ITEMS_KEY = '@arzban_selected';

// لیست کامل با ۴۰+ ارز و پرچم‌ها
const DISPLAY_MAP = {
  // ایران و همسایگان
  'USDT_IRT': { name: 'تتر (دلار)', flag: '🇺🇸', category: 'currency' },
  'EUR': { name: 'یورو', flag: '🇪🇺', category: 'currency' },
  'GBP': { name: 'پوند انگلیس', flag: '🇬🇧', category: 'currency' },
  'TRY': { name: 'لیر ترکیه', flag: '🇹🇷', category: 'currency' },
  'AED': { name: 'درهم امارات', flag: '🇦🇪', category: 'currency' },
  'SAR': { name: 'ریال سعودی', flag: '🇸🇦', category: 'currency' },
  'QAR': { name: 'ریال قطر', flag: '🇶🇦', category: 'currency' },
  'OMR': { name: 'ریال عمان', flag: '🇴🇲', category: 'currency' },
  'KWD': { name: 'دینار کویت', flag: '🇰🇼', category: 'currency' },
  'IQD': { name: 'دینار عراق', flag: '🇮🇶', category: 'currency' },
  'SYP': { name: 'لیر سوریه', flag: '🇸🇾', category: 'currency' },
  'AFN': { name: 'افغانی', flag: '🇦🇫', category: 'currency' },
  'AMD': { name: 'درام ارمنستان', flag: '🇦🇲', category: 'currency' },
  'AZN': { name: 'منات آذربایجان', flag: '🇦🇿', category: 'currency' },
  'GEL': { name: 'لاری گرجستان', flag: '🇬🇪', category: 'currency' },
  
  // آسیا
  'CNY': { name: 'یوان چین', flag: '🇨🇳', category: 'currency' },
  'JPY': { name: 'ین ژاپن', flag: '🇯🇵', category: 'currency' },
  'KRW': { name: 'وون کره', flag: '🇰🇷', category: 'currency' },
  'INR': { name: 'روپیه هند', flag: '🇮🇳', category: 'currency' },
  'PKR': { name: 'روپیه پاکستان', flag: '🇵🇰', category: 'currency' },
  'THB': { name: 'بات تایلند', flag: '🇹🇭', category: 'currency' },
  'SGD': { name: 'دلار سنگاپور', flag: '🇸🇬', category: 'currency' },
  'MYR': { name: 'رینگیت مالزی', flag: '🇲🇾', category: 'currency' },
  'IDR': { name: 'روپیه اندونزی', flag: '🇮🇩', category: 'currency' },
  'VND': { name: 'دونگ ویتنام', flag: '🇻🇳', category: 'currency' },
  
  // اروپا
  'CHF': { name: 'فرانک سوئیس', flag: '🇨🇭', category: 'currency' },
  'NOK': { name: 'کرون نروژ', flag: '🇳🇴', category: 'currency' },
  'SEK': { name: 'کرون سوئد', flag: '🇸🇪', category: 'currency' },
  'DKK': { name: 'کرون دانمارک', flag: '🇩🇰', category: 'currency' },
  'PLN': { name: 'زلوتی لهستان', flag: '🇵🇱', category: 'currency' },
  'CZK': { name: 'کرون چک', flag: '🇨🇿', category: 'currency' },
  'HUF': { name: 'فورینت مجارستان', flag: '🇭🇺', category: 'currency' },
  'RON': { name: 'لئو رومانی', flag: '🇷🇴', category: 'currency' },
  'RUB': { name: 'روبل روسیه', flag: '🇷🇺', category: 'currency' },
  
  // آمریکا و اقیانوسیه
  'CAD': { name: 'دلار کانادا', flag: '🇨🇦', category: 'currency' },
  'AUD': { name: 'دلار استرالیا', flag: '🇦🇺', category: 'currency' },
  'NZD': { name: 'دلار نیوزیلند', flag: '🇳🇿', category: 'currency' },
  'MXN': { name: 'پزو مکزیک', flag: '🇲🇽', category: 'currency' },
  'BRL': { name: 'رئال برزیل', flag: '🇧🇷', category: 'currency' },
  'ARS': { name: 'پزو آرژانتین', flag: '🇦🇷', category: 'currency' },
  
  // طلا و سکه
  'IR_GOLD_18K': { name: 'طلا ۱۸ عیار', flag: '🏆', category: 'gold' },
  'IR_GOLD_24K': { name: 'طلا ۲۴ عیار', flag: '🥇', category: 'gold' },
  'IR_GOLD_MESGHAL': { name: 'مثقال طلا', flag: '⚖️', category: 'gold' },
  'IR_GOLD_OUNCE': { name: 'انس طلا', flag: '🌟', category: 'gold' },
  'IR_COIN_EMAMI': { name: 'سکه امامی', flag: '🪙', category: 'gold' },
  'IR_COIN_BAHAR': { name: 'سکه بهار', flag: '🌸', category: 'gold' },
  'IR_COIN_HALF': { name: 'نیم سکه', flag: '💎', category: 'gold' },
  'IR_COIN_QUARTER': { name: 'ربع سکه', flag: '💍', category: 'gold' },
  
  // کریپتو
  'BTC': { name: 'بیت‌کوین', flag: '₿', category: 'crypto' },
  'ETH': { name: 'اتریوم', flag: '◆', category: 'crypto' },
  'USDT': { name: 'تتر', flag: '₮', category: 'crypto' },
  'BNB': { name: 'بایننس کوین', flag: '◉', category: 'crypto' },
};

const DEFAULT_SELECTED = ['USDT_IRT', 'EUR', 'IR_GOLD_18K', 'IR_COIN_EMAMI', 'BTC'];

export default function App() {
  const [rates, setRates] = useState({});
  const [allItems, setAllItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [converterVisible, setConverterVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState(DEFAULT_SELECTED);
  const [lastUpdate, setLastUpdate] = useState('');
  const [persianDate, setPersianDate] = useState('');
  const [gregorianDate, setGregorianDate] = useState('');
  
  // تبدیل
  const [fromCurrency, setFromCurrency] = useState('USDT_IRT');
  const [toCurrency, setToCurrency] = useState('IR_GOLD_18K');
  const [amount, setAmount] = useState('1000');
  const [result, setResult] = useState('');

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
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    setGregorianDate(`${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`);
    
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    setLastUpdate(`${hours}:${minutes}`);
  };

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
      console.log('خطا در بارگذاری');
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

  const fetchRates = async () => {
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
      
      const newRates = {};
      const items = [];
      
      if (data.gold && Array.isArray(data.gold)) {
        data.gold.forEach(item => {
          if (item.symbol && item.price) {
            newRates[item.symbol] = parseInt(item.price);
            items.push(item.symbol);
          }
        });
      }
      
      if (data.currency && Array.isArray(data.currency)) {
        data.currency.forEach(item => {
          if (item.symbol && item.price) {
            newRates[item.symbol] = parseInt(item.price);
            items.push(item.symbol);
          }
        });
      }
      
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
      setError('خطا در دریافت اطلاعات');
    }
    
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      await loadFromCache();
      setLoading(false);
      await fetchRates();
    };
    
    init();
    
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
    return DISPLAY_MAP[symbol] || { name: symbol, flag: '🌍', category: 'other' };
  };

  const calculateConversion = () => {
    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];
    const amountNum = parseFloat(amount);
    
    if (fromRate && toRate && amountNum) {
      const converted = (amountNum * fromRate) / toRate;
      
      const fromInfo = getDisplayInfo(fromCurrency);
      const toInfo = getDisplayInfo(toCurrency);
      
      if (toCurrency.includes('GOLD_18K') || toCurrency.includes('GOLD_24K')) {
        setResult(`${converted.toFixed(2)} گرم ${toInfo.name}`);
      } else if (toCurrency.includes('COIN')) {
        setResult(`${converted.toFixed(4)} ${toInfo.name}`);
      } else if (toCurrency === 'BTC' || toCurrency === 'ETH') {
        setResult(`${converted.toFixed(8)} ${toInfo.name}`);
      } else {
        setResult(`${Math.round(converted).toLocaleString('fa-IR')} ${toInfo.name}`);
      }
    } else {
      setResult('مقدار را وارد کنید');
    }
  };

  useEffect(() => {
    if (converterVisible) {
      calculateConversion();
    }
  }, [amount, fromCurrency, toCurrency, converterVisible]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      
      {/* هدر */}
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Text style={styles.datePersian}>{persianDate}</Text>
          <Text style={styles.dateGregorian}>{gregorianDate}</Text>
          <Text style={styles.lastUpdateText}>آخرین بروزرسانی: {lastUpdate}</Text>
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#00D9A5" />
          <Text style={styles.loadingText}>در حال بارگذاری...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorIcon}>⚠️</Text>
          <Text style={styles.error}>{error}</Text>
        </View>
      ) : (
        <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
          {selectedItems.map(symbol => {
            const info = getDisplayInfo(symbol);
            const value = rates[symbol];
            
            return (
              <View key={symbol} style={styles.card}>
                <View style={styles.cardHeader}>
                  <Text style={styles.flag}>{info.category === 'currency' ? info.flag : ''}</Text>
                  <Text style={styles.name}>{info.name}</Text>
                </View>
                <Text style={styles.price}>
                  {value ? `${value.toLocaleString('fa-IR')} تومان` : 'بارگذاری...'}
                </Text>
              </View>
            );
          })}
          
          {/* دکمه تبدیل */}
          <TouchableOpacity 
            style={styles.converterButton}
            onPress={() => setConverterVisible(true)}
          >
            <Text style={styles.converterIcon}>🧮</Text>
            <Text style={styles.converterText}>تبدیل ارز</Text>
          </TouchableOpacity>
          
          {/* دکمه تنظیمات */}
          <TouchableOpacity 
            style={styles.settingsButton}
            onPress={() => setModalVisible(true)}
          >
            <Text style={styles.settingsIcon}>⚙️</Text>
            <Text style={styles.settingsText}>تنظیم لیست نمایش</Text>
          </TouchableOpacity>
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>بروزرسانی خودکار هر ۵ دقیقه</Text>
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
                       category === 'crypto' ? '₿ کریپتو' : '🌍 ارزها'}
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
                          <Text style={styles.modalItemFlag}>{info.category === 'currency' ? info.flag : ''}</Text>
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

      {/* مودال تبدیل */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={converterVisible}
        onRequestClose={() => setConverterVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>تبدیل ارز 🧮</Text>
              <TouchableOpacity onPress={() => setConverterVisible(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.converterContainer}>
              <Text style={styles.converterLabel}>از:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.currencyPicker}>
                {allItems.map(symbol => {
                  const info = getDisplayInfo(symbol);
                  return (
                    <TouchableOpacity
                      key={symbol}
                      style={[
                        styles.currencyOption,
                        fromCurrency === symbol && styles.currencyOptionSelected
                      ]}
                      onPress={() => setFromCurrency(symbol)}
                    >
                      <Text style={styles.currencyOptionText}>{info.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              
              <Text style={styles.converterLabel}>مقدار:</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="مثال: 1000"
                placeholderTextColor="#666"
              />
              
              <Text style={styles.converterLabel}>به:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.currencyPicker}>
                {allItems.map(symbol => {
                  const info = getDisplayInfo(symbol);
                  return (
                    <TouchableOpacity
                      key={symbol}
                      style={[
                        styles.currencyOption,
                        toCurrency === symbol && styles.currencyOptionSelected
                      ]}
                      onPress={() => setToCurrency(symbol)}
                    >
                      <Text style={styles.currencyOptionText}>{info.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
              
              <View style={styles.resultContainer}>
                <Text style={styles.resultLabel}>نتیجه:</Text>
                <Text style={styles.resultText}>{result}</Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0A1628' },
  header: {
    backgroundColor: 'linear-gradient(135deg, #00D9A5 0%, #00A67E 100%)',
    paddingTop: 20,
    paddingBottom: 25,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#00D9A5',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  dateContainer: { alignItems: 'center' },
  datePersian: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 6 },
  dateGregorian: { fontSize: 14, color: 'rgba(255, 255, 255, 0.8)', marginBottom: 8 },
  lastUpdateText: { fontSize: 11, color: 'rgba(255, 255, 255, 0.7)' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  loadingText: { color: '#00D9A5', fontSize: 16, marginTop: 15 },
  errorIcon: { fontSize: 60, marginBottom: 15 },
  error: { color: '#FF6B6B', fontSize: 18, textAlign: 'center' },
  list: { flex: 1, padding: 16 },
  card: {
    backgroundColor: '#1A2742',
    borderRadius: 18,
    padding: 20,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(0, 217, 165, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  flag: { fontSize: 28, marginRight: 12 },
  name: { fontSize: 17, fontWeight: '600', color: '#FFFFFF', flex: 1 },
  price: { fontSize: 22, fontWeight: 'bold', color: '#00D9A5', textAlign: 'right' },
  converterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00D9A5',
    padding: 16,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 12,
    shadowColor: '#00D9A5',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 6,
  },
  converterIcon: { fontSize: 24, marginRight: 10 },
  converterText: { color: '#FFFFFF', fontSize: 17, fontWeight: 'bold' },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00A67E',
    padding: 16,
    borderRadius: 15,
    marginBottom: 20,
  },
  settingsIcon: { fontSize: 24, marginRight: 10 },
  settingsText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  footer: { alignItems: 'center', paddingVertical: 25 },
  footerText: { color: 'rgba(255, 255, 255, 0.4)', fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.85)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#1A2742',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: '85%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 217, 165, 0.2)',
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#00D9A5' },
  closeButton: { fontSize: 30, color: '#FFFFFF', fontWeight: '300' },
  modalList: { padding: 15 },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00D9A5',
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
    backgroundColor: 'rgba(0, 217, 165, 0.2)',
    borderWidth: 2,
    borderColor: '#00D9A5',
  },
  modalItemFlag: { fontSize: 24, marginRight: 12 },
  modalItemText: { flex: 1, fontSize: 16, color: '#FFFFFF' },
  checkmark: { fontSize: 24, color: '#00D9A5', fontWeight: 'bold' },
  doneButton: {
    backgroundColor: '#00D9A5',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
  },
  doneButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  converterContainer: { padding: 20 },
  converterLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00D9A5',
    marginTop: 15,
    marginBottom: 10,
  },
  currencyPicker: { marginBottom: 10 },
  currencyOption: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    marginRight: 8,
  },
  currencyOptionSelected: {
    backgroundColor: '#00D9A5',
  },
  currencyOptionText: { color: '#FFFFFF', fontSize: 14 },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#FFFFFF',
    padding: 15,
    borderRadius: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(0, 217, 165, 0.3)',
  },
  resultContainer: {
    backgroundColor: 'rgba(0, 217, 165, 0.1)',
    padding: 20,
    borderRadius: 15,
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#00D9A5',
  },
  resultLabel: { fontSize: 14, color: '#00D9A5', marginBottom: 8 },
  resultText: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF', textAlign: 'center' },
});
