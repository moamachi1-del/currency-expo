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
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = 'B2JhTivIrHZHFFJDdKtE1vxP1Mp3LBuH';
const API_URL = `https://BrsApi.ir/Api/Market/Gold_Currency.php?key=${API_KEY}`;
const CACHE_KEY = '@arzban_cache';
const LAST_UPDATE_KEY = '@arzban_last_update';
const SELECTED_ITEMS_KEY = '@arzban_selected';

// لیست کامل - فقط چیزهایی که تو API هست + تومان
const DISPLAY_MAP = {
  // تومان (برای تبدیل)
  'TOMAN': { name: 'تومان', flag: '🇮🇷', category: 'currency' },
  
  // ارزها
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
  'CHF': { name: 'فرانک سوئیس', flag: '🇨🇭', category: 'currency' },
  'NOK': { name: 'کرون نروژ', flag: '🇳🇴', category: 'currency' },
  'SEK': { name: 'کرون سوئد', flag: '🇸🇪', category: 'currency' },
  'DKK': { name: 'کرون دانمارک', flag: '🇩🇰', category: 'currency' },
  'PLN': { name: 'زلوتی لهستان', flag: '🇵🇱', category: 'currency' },
  'CZK': { name: 'کرون چک', flag: '🇨🇿', category: 'currency' },
  'HUF': { name: 'فورینت مجارستان', flag: '🇭🇺', category: 'currency' },
  'RON': { name: 'لئو رومانی', flag: '🇷🇴', category: 'currency' },
  'RUB': { name: 'روبل روسیه', flag: '🇷🇺', category: 'currency' },
  'CAD': { name: 'دلار کانادا', flag: '🇨🇦', category: 'currency' },
  'AUD': { name: 'دلار استرالیا', flag: '🇦🇺', category: 'currency' },
  'NZD': { name: 'دلار نیوزیلند', flag: '🇳🇿', category: 'currency' },
  'MXN': { name: 'پزو مکزیک', flag: '🇲🇽', category: 'currency' },
  'BRL': { name: 'رئال برزیل', flag: '🇧🇷', category: 'currency' },
  'ARS': { name: 'پزو آرژانتین', flag: '🇦🇷', category: 'currency' },
  
  // طلا و سکه
  'IR_GOLD_18K': { name: 'طلا ۱۸ عیار', flag: '', category: 'gold' },
  'IR_GOLD_24K': { name: 'طلا ۲۴ عیار', flag: '', category: 'gold' },
  'IR_GOLD_MELTED': { name: 'طلا آب شده', flag: '', category: 'gold' },
  'MAUSD': { name: 'انس طلا', flag: '', category: 'gold' },
  'IR_COIN_EMAMI': { name: 'سکه امامی', flag: '', category: 'gold' },
  'IR_COIN_BAHAR': { name: 'سکه بهار', flag: '', category: 'gold' },
  'IR_COIN_HALF': { name: 'نیم سکه', flag: '', category: 'gold' },
  'IR_COIN_QUARTER': { name: 'ربع سکه', flag: '', category: 'gold' },
  
  // کریپتو - فقط BTC و ETH
  'BTC': { name: 'بیت‌کوین', flag: '', category: 'crypto' },
  'ETH': { name: 'اتریوم', flag: '', category: 'crypto' },
};

const DEFAULT_SELECTED = ['USDT_IRT', 'EUR', 'IR_GOLD_18K', 'IR_COIN_EMAMI', 'BTC'];

export default function App() {
  const [rates, setRates] = useState({ TOMAN: 1 }); // تومان = 1
  const [allItems, setAllItems] = useState(['TOMAN']); // شامل تومان
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [converterVisible, setConverterVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState(DEFAULT_SELECTED);
  const [lastUpdate, setLastUpdate] = useState('');
  const [persianDate, setPersianDate] = useState('');
  const [gregorianDate, setGregorianDate] = useState('');
  const [fromCurrency, setFromCurrency] = useState('USDT_IRT');
  const [toCurrency, setToCurrency] = useState('IR_GOLD_18K');
  const [amount, setAmount] = useState('1000');
  const [result, setResult] = useState('');

  // تبدیل درست به شمسی
  const convertToJalali = (gDate) => {
    let gy = gDate.getFullYear();
    let gm = gDate.getMonth() + 1;
    let gd = gDate.getDate();
    
    let g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    let jy = (gy <= 1600) ? 0 : 979;
    
    gy -= (gy <= 1600) ? 621 : 1600;
    let gy2 = (gm > 2) ? (gy + 1) : gy;
    
    let days = (365 * gy) + (Math.floor((gy2 + 3) / 4)) - (Math.floor((gy2 + 99) / 100)) + 
               (Math.floor((gy2 + 399) / 400)) - 80 + gd + g_d_m[gm - 1];
    
    jy += 33 * Math.floor(days / 12053);
    days %= 12053;
    
    jy += 4 * Math.floor(days / 1461);
    days %= 1461;
    
    if (days > 365) {
      jy += Math.floor((days - 1) / 365);
      days = (days - 1) % 365;
    }
    
    let jm, jd;
    if (days < 186) {
      jm = 1 + Math.floor(days / 31);
      jd = 1 + (days % 31);
    } else {
      jm = 7 + Math.floor((days - 186) / 30);
      jd = 1 + ((days - 186) % 30);
    }
    
    const weekDays = ['یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنجشنبه', 'جمعه', 'شنبه'];
    const months = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];
    const weekDay = weekDays[gDate.getDay()];
    
    return `${weekDay} ${jd} ${months[jm - 1]} ${jy}`;
  };

  const updateDates = () => {
    const now = new Date();
    setPersianDate(convertToJalali(now));
    
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    setGregorianDate(`${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`);
  };

  const loadFromCache = async () => {
    try {
      const cachedData = await AsyncStorage.getItem(CACHE_KEY);
      const cachedUpdate = await AsyncStorage.getItem(LAST_UPDATE_KEY);
      const cachedSelected = await AsyncStorage.getItem(SELECTED_ITEMS_KEY);
      
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        setRates({ ...parsed, TOMAN: 1 });
      }
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
      
      const newRates = { TOMAN: 1 };
      const items = ['TOMAN'];
      
      // فقط چیزهایی که تو DISPLAY_MAP هست رو اضافه کن
      const allowedSymbols = Object.keys(DISPLAY_MAP).filter(k => k !== 'TOMAN');
      
      if (data.gold && Array.isArray(data.gold)) {
        data.gold.forEach(item => {
          if (item.symbol && item.price && allowedSymbols.includes(item.symbol)) {
            newRates[item.symbol] = parseInt(item.price);
            items.push(item.symbol);
          }
        });
      }
      
      if (data.currency && Array.isArray(data.currency)) {
        data.currency.forEach(item => {
          if (item.symbol && item.price && allowedSymbols.includes(item.symbol)) {
            newRates[item.symbol] = parseInt(item.price);
            items.push(item.symbol);
          }
        });
      }
      
      if (data.cryptocurrency && Array.isArray(data.cryptocurrency)) {
        data.cryptocurrency.forEach(item => {
          if (item.symbol && item.price && allowedSymbols.includes(item.symbol)) {
            newRates[item.symbol] = parseInt(item.price);
            items.push(item.symbol);
          }
        });
      }
      
      setRates(newRates);
      setAllItems(items);
      updateDates();
      
      // ذخیره زمان واقعی آپدیت
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      setLastUpdate(timeStr);
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
    const fromRate = rates[fromCurrency] || 1;
    const toRate = rates[toCurrency] || 1;
    const amountNum = parseFloat(amount) || 0;
    
    if (amountNum > 0) {
      const converted = (amountNum * fromRate) / toRate;
      
      const toInfo = getDisplayInfo(toCurrency);
      
      if (toCurrency === 'TOMAN') {
        setResult(`${Math.round(converted).toLocaleString('fa-IR')} تومان`);
      } else if (toCurrency.includes('GOLD')) {
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
  }, [amount, fromCurrency, toCurrency, converterVisible, rates]);

  if (converterVisible) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        
        <View style={styles.converterHeader}>
          <TouchableOpacity onPress={() => setConverterVisible(false)} style={styles.backButton}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.converterTitle}>تبدیل ارز</Text>
          <View style={{width: 40}} />
        </View>
        
        <ScrollView style={styles.converterScreen}>
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
                  <Text style={[styles.currencyOptionText, fromCurrency === symbol && styles.currencyOptionTextSelected]}>
                    {info.name}
                  </Text>
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
            placeholderTextColor="#999"
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
                  <Text style={[styles.currencyOptionText, toCurrency === symbol && styles.currencyOptionTextSelected]}>
                    {info.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
          
          <View style={styles.resultContainer}>
            <Text style={styles.resultLabel}>نتیجه:</Text>
            <Text style={styles.resultText}>{result}</Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />
      
      {/* هدر خیلی بلند */}
      <View style={styles.header}>
        <View style={styles.dateContainer}>
          <Text style={styles.datePersian}>{persianDate}</Text>
          <Text style={styles.dateGregorian}>{gregorianDate}</Text>
          <Text style={styles.lastUpdateText}>آخرین بروزرسانی: {lastUpdate}</Text>
        </View>
      </View>

      {/* دکمه ماشین‌حساب */}
      <TouchableOpacity 
        style={styles.calcButton}
        onPress={() => setConverterVisible(true)}
      >
        <Text style={styles.calcIcon}>🧮</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#00CBA9" />
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
                  {info.category === 'currency' && <Text style={styles.flag}>{info.flag}</Text>}
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
                          {info.category === 'currency' && <Text style={styles.modalItemFlag}>{info.flag}</Text>}
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
  container: { flex: 1, backgroundColor: '#F0F9F6' },
  header: {
    backgroundColor: '#E8F8F5',
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 35,
    borderBottomRightRadius: 35,
    shadowColor: '#00CBA9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 5,
  },
  dateContainer: { alignItems: 'center', marginTop: 15 },
  datePersian: { fontSize: 30, fontWeight: 'bold', color: '#1A5F4F', marginBottom: 10 },
  dateGregorian: { fontSize: 16, color: '#5B7A6F', marginBottom: 12 },
  lastUpdateText: { fontSize: 13, color: '#7D9B8F' },
  calcButton: {
    position: 'absolute',
    top: 165,
    left: 20,
    width: 55,
    height: 55,
    backgroundColor: '#00CBA9',
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#00CBA9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
    zIndex: 10,
  },
  calcIcon: { fontSize: 28 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  loadingText: { color: '#00CBA9', fontSize: 16, marginTop: 15 },
  errorIcon: { fontSize: 60, marginBottom: 15 },
  error: { color: '#E74C3C', fontSize: 18, textAlign: 'center' },
  list: { flex: 1, padding: 16, marginTop: 40 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: '#D4F1E8',
    shadowColor: '#00CBA9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  flag: { fontSize: 28, marginRight: 12 },
  name: { fontSize: 17, fontWeight: '600', color: '#2C3E50', flex: 1 },
  price: { fontSize: 22, fontWeight: 'bold', color: '#00CBA9', textAlign: 'right' },
  settingsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4ECDC4',
    padding: 16,
    borderRadius: 15,
    marginTop: 10,
    marginBottom: 20,
    shadowColor: '#4ECDC4',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  settingsIcon: { fontSize: 24, marginRight: 10 },
  settingsText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
  footer: { alignItems: 'center', paddingVertical: 25 },
  footerText: { color: '#95A5A6', fontSize: 12 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.6)', justifyContent: 'flex-end' },
  modalContent: {
    backgroundColor: '#FFFFFF',
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
    borderBottomColor: '#E8F8F5',
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold', color: '#00CBA9' },
  closeButton: { fontSize: 30, color: '#95A5A6', fontWeight: '300' },
  modalList: { padding: 15 },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#00CBA9',
    marginTop: 15,
    marginBottom: 10,
    marginRight: 10,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FCFB',
    padding: 15,
    borderRadius: 12,
    marginBottom: 8,
  },
  modalItemSelected: {
    backgroundColor: '#D4F1E8',
    borderWidth: 2,
    borderColor: '#00CBA9',
  },
  modalItemFlag: { fontSize: 24, marginRight: 12 },
  modalItemText: { flex: 1, fontSize: 16, color: '#2C3E50' },
  checkmark: { fontSize: 24, color: '#00CBA9', fontWeight: 'bold' },
  doneButton: {
    backgroundColor: '#00CBA9',
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#00CBA9',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  doneButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
  converterHeader: {
    backgroundColor: '#E8F8F5',
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  backButton: { padding: 5 },
  backIcon: { fontSize: 28, color: '#00CBA9', fontWeight: 'bold' },
  converterTitle: { fontSize: 22, fontWeight: 'bold', color: '#1A5F4F' },
  converterScreen: { flex: 1, padding: 20, backgroundColor: '#F0F9F6' },
  converterLabel: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#00CBA9',
    marginTop: 20,
    marginBottom: 12,
  },
  currencyPicker: { marginBottom: 10 },
  currencyOption: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#D4F1E8',
  },
  currencyOptionSelected: {
    backgroundColor: '#00CBA9',
    borderColor: '#00CBA9',
  },
  currencyOptionText: { color: '#2C3E50', fontSize: 15, fontWeight: '600' },
  currencyOptionTextSelected: { color: '#FFFFFF' },
  input: {
    backgroundColor: '#FFFFFF',
    color: '#2C3E50',
    padding: 18,
    borderRadius: 15,
    fontSize: 17,
    borderWidth: 2,
    borderColor: '#D4F1E8',
    fontWeight: '600',
  },
  resultContainer: {
    backgroundColor: '#D4F1E8',
    padding: 25,
    borderRadius: 20,
    marginTop: 25,
    borderWidth: 3,
    borderColor: '#00CBA9',
  },
  resultLabel: { fontSize: 15, color: '#1A5F4F', marginBottom: 10, fontWeight: '600' },
  resultText: { fontSize: 26, fontWeight: 'bold', color: '#00CBA9', textAlign: 'center' },
});
