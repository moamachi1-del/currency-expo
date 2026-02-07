import React, { useState, useEffect } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator,
  Modal, SafeAreaView, TextInput,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_KEY = 'B2JhTivIrHZHFFJDdKtE1vxP1Mp3LBuH';
const API_URL = `https://BrsApi.ir/Api/Market/Gold_Currency.php?key=${API_KEY}`;

const THEMES = {
  green: { name: 'سبز فیروزه‌ای', bg: '#F0F9F6', headerBg: '#E8F8F5', primary: '#00CBA9', secondary: '#4ECDC4', cardBg: '#FFFFFF', cardBorder: '#D4F1E8', textPrimary: '#1A5F4F', textSecondary: '#5B7A6F' },
  blue: { name: 'آبی اقیانوسی', bg: '#F0F8FF', headerBg: '#E3F2FD', primary: '#2196F3', secondary: '#03A9F4', cardBg: '#FFFFFF', cardBorder: '#BBDEFB', textPrimary: '#0D47A1', textSecondary: '#1976D2' },
  purple: { name: 'بنفش شاهانه', bg: '#F8F4FF', headerBg: '#F3E5F5', primary: '#9C27B0', secondary: '#BA68C8', cardBg: '#FFFFFF', cardBorder: '#E1BEE7', textPrimary: '#4A148C', textSecondary: '#7B1FA2' },
  orange: { name: 'نارنجی غروب', bg: '#FFF8F0', headerBg: '#FFF3E0', primary: '#FF9800', secondary: '#FFB74D', cardBg: '#FFFFFF', cardBorder: '#FFE0B2', textPrimary: '#E65100', textSecondary: '#F57C00' },
  pink: { name: 'صورتی-بنفش', bg: '#FFF0F8', headerBg: '#FCE4EC', primary: '#E91E63', secondary: '#F06292', cardBg: '#FFFFFF', cardBorder: '#F8BBD0', textPrimary: '#880E4F', textSecondary: '#C2185B' },
  gold: { name: 'طلایی-مشکی', bg: '#1A1A1A', headerBg: '#2C2C2C', primary: '#FFD700', secondary: '#FFA500', cardBg: '#2C2C2C', cardBorder: '#444444', textPrimary: '#FFD700', textSecondary: '#FFA500' },
  neon: { name: 'سبز-آبی نئون', bg: '#0A1628', headerBg: '#1A2742', primary: '#00FFC6', secondary: '#00D9FF', cardBg: '#1A2742', cardBorder: '#2C3E50', textPrimary: '#00FFC6', textSecondary: '#00D9FF' },
};

const CURRENCIES = {
  'TOMAN': { name: 'تومان ایران', flag: '🇮🇷', cat: 'converter_only', unit: 'تومان' },
  'USDT_IRT': { name: 'تتر', flag: '🇺🇸', cat: 'currency', unit: 'تومان' },
  'USD': { name: 'دلار', flag: '🇺🇸', cat: 'currency', unit: 'تومان' },
  'EUR': { name: 'یورو', flag: '🇪🇺', cat: 'currency', unit: 'تومان' },
  'GBP': { name: 'پوند', flag: '🇬🇧', cat: 'currency', unit: 'تومان' },
  'TRY': { name: 'لیر ترکیه', flag: '🇹🇷', cat: 'currency', unit: 'تومان' },
  'AED': { name: 'درهم', flag: '🇦🇪', cat: 'currency', unit: 'تومان' },
  'SAR': { name: 'ریال سعودی', flag: '🇸🇦', cat: 'currency', unit: 'تومان' },
  'CHF': { name: 'فرانک', flag: '🇨🇭', cat: 'currency', unit: 'تومان' },
  'CNY': { name: 'یوان', flag: '🇨🇳', cat: 'currency', unit: 'تومان' },
  'JPY': { name: 'ین', flag: '🇯🇵', cat: 'currency', unit: 'تومان' },
  'KRW': { name: 'وون', flag: '🇰🇷', cat: 'currency', unit: 'تومان' },
  'INR': { name: 'روپیه هند', flag: '🇮🇳', cat: 'currency', unit: 'تومان' },
  'PKR': { name: 'روپیه پاکستان', flag: '🇵🇰', cat: 'currency', unit: 'تومان' },
  'THB': { name: 'بات', flag: '🇹🇭', cat: 'currency', unit: 'تومان' },
  'RUB': { name: 'روبل', flag: '🇷🇺', cat: 'currency', unit: 'تومان' },
  'CAD': { name: 'دلار کانادا', flag: '🇨🇦', cat: 'currency', unit: 'تومان' },
  'AUD': { name: 'دلار استرالیا', flag: '🇦🇺', cat: 'currency', unit: 'تومان' },
  'IR_GOLD_18K': { name: 'طلا ۱۸', flag: '', cat: 'gold', unit: 'تومان' },
  'IR_GOLD_24K': { name: 'طلا ۲۴', flag: '', cat: 'gold', unit: 'تومان' },
  'IR_COIN_EMAMI': { name: 'سکه امامی', flag: '', cat: 'gold', unit: 'تومان' },
  'IR_COIN_BAHAR': { name: 'سکه بهار', flag: '', cat: 'gold', unit: 'تومان' },
  'IR_COIN_HALF': { name: 'نیم سکه', flag: '', cat: 'gold', unit: 'تومان' },
  'IR_COIN_QUARTER': { name: 'ربع سکه', flag: '', cat: 'gold', unit: 'تومان' },
  'BTC': { name: 'بیت‌کوین', flag: '', cat: 'crypto', unit: 'دلار' },
  'ETH': { name: 'اتریوم', flag: '', cat: 'crypto', unit: 'دلار' },
};

export default function App() {
  const [rates, setRates] = useState({ TOMAN: 1 });
  const [allItems, setAllItems] = useState([]);
  const [converterItems, setConverterItems] = useState(['TOMAN']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [converterVisible, setConverterVisible] = useState(false);
  const [currencyModal, setCurrencyModal] = useState(false);
  const [themeModal, setThemeModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState(['USDT_IRT', 'USD', 'EUR', 'IR_GOLD_18K', 'IR_COIN_EMAMI', 'BTC']);
  const [lastUpdate, setLastUpdate] = useState('');
  const [persianDate, setPersianDate] = useState('');
  const [gregorianDate, setGregorianDate] = useState('');
  const [fromCurrency, setFromCurrency] = useState('TOMAN');
  const [amount, setAmount] = useState('1000000');
  const [currentTheme, setCurrentTheme] = useState('green');

  const theme = THEMES[currentTheme];

  const toJalali = (gDate) => {
    let gy = gDate.getFullYear(), gm = gDate.getMonth() + 1, gd = gDate.getDate();
    const g_d_m = [0,31,59,90,120,151,181,212,243,273,304,334];
    let jy = gy <= 1600 ? 0 : 979;
    gy -= gy <= 1600 ? 621 : 1600;
    const gy2 = gm > 2 ? gy + 1 : gy;
    let days = 365*gy + Math.floor((gy2+3)/4) - Math.floor((gy2+99)/100) + Math.floor((gy2+399)/400) - 80 + gd + g_d_m[gm-1];
    if (gm > 2 && ((gy%4===0 && gy%100!==0) || gy%400===0)) days++;
    jy += 33 * Math.floor(days / 12053);
    days %= 12053;
    jy += 4 * Math.floor(days / 1461);
    days %= 1461;
    if (days > 365) { jy += Math.floor((days-1)/365); days = (days-1) % 365; }
    const jm = days < 186 ? 1 + Math.floor(days/31) : 7 + Math.floor((days-186)/30);
    const jd = 1 + (days < 186 ? days%31 : (days-186)%30);
    const weekDays = ['یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه','شنبه'];
    const months = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
    return `${weekDays[gDate.getDay()]} ${jd} ${months[jm-1]} ${jy}`;
  };

  const updateDates = () => {
    const now = new Date();
    setPersianDate(toJalali(now));
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    setGregorianDate(`${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`);
  };

  const fetchRates = async () => {
    setError(null);
    try {
      const res = await fetch(API_URL, { headers: { 'Accept': 'application/json', 'User-Agent': 'ArzbanApp/1.0' }});
      if (!res.ok) throw new Error(`خطای ${res.status}`);
      const data = await res.json();
      const newRates = { TOMAN: 1 };
      const items = [];
      const convItems = ['TOMAN'];
      const allowed = Object.keys(CURRENCIES).filter(k => k !== 'TOMAN');
      [data.gold, data.currency, data.cryptocurrency].forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach(item => {
            if (item.symbol && item.price && allowed.includes(item.symbol)) {
              newRates[item.symbol] = parseInt(item.price);
              items.push(item.symbol);
              convItems.push(item.symbol);
            }
          });
        }
      });
      setRates(newRates);
      setAllItems(items);
      setConverterItems(convItems);
      updateDates();
      const now = new Date();
      const time = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
      setLastUpdate(time);
      await AsyncStorage.multiSet([['@cache', JSON.stringify(newRates)], ['@update', time]]);
    } catch (err) {
      setError('خطا در دریافت');
    }
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const [[,cache], [,update], [,selected], [,thm]] = await AsyncStorage.multiGet(['@cache','@update','@selected','@theme']);
        if (cache) setRates({...JSON.parse(cache), TOMAN: 1});
        if (update) setLastUpdate(update);
        if (selected) setSelectedItems(JSON.parse(selected));
        if (thm) setCurrentTheme(thm);
        updateDates();
      } catch {}
      setLoading(false);
      await fetchRates();
    })();
    const interval = setInterval(fetchRates, 5*60*1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { AsyncStorage.setItem('@selected', JSON.stringify(selectedItems)); }, [selectedItems]);

  const getInfo = (symbol) => CURRENCIES[symbol] || { name: symbol, flag: '🌍', cat: 'other', unit: 'تومان' };

  const convert = (target) => {
    const fromRate = rates[fromCurrency] || 1;
    const toRate = rates[target] || 1;
    const amt = parseFloat(amount) || 0;
    if (amt > 0) {
      const result = (amt * fromRate) / toRate;
      if (target === 'TOMAN') return result.toLocaleString('fa-IR', {maximumFractionDigits:2});
      if (target.includes('GOLD')) return result.toLocaleString('fa-IR', {maximumFractionDigits:3}) + ' گرم';
      if (target.includes('COIN')) return result.toLocaleString('fa-IR', {maximumFractionDigits:4});
      if (target === 'BTC' || target === 'ETH') return result.toLocaleString('fa-IR', {maximumFractionDigits:8});
      return result.toLocaleString('fa-IR', {maximumFractionDigits:2});
    }
    return '---';
  };

  const changeTheme = async (t) => {
    setCurrentTheme(t);
    await AsyncStorage.setItem('@theme', t);
    setThemeModal(false);
  };

  const s = createStyles(theme);

  if (converterVisible) {
    const fromInfo = getInfo(fromCurrency);
    return (
      <SafeAreaView style={s.container}>
        <StatusBar style={currentTheme === 'gold' || currentTheme === 'neon' ? "light" : "dark"} />
        <View style={s.convHeader}>
          <TouchableOpacity onPress={() => setConverterVisible(false)} style={s.backBtn}>
            <Text style={s.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={s.convTitle}>مبدل ارز</Text>
          <View style={{width:40}} />
        </View>
        <ScrollView style={s.convScreen}>
          <TouchableOpacity style={s.currBox} onPress={() => setCurrencyModal(true)}>
            <Text style={s.currFlag}>{fromInfo.flag}</Text>
            <Text style={s.currText}>{fromInfo.name}</Text>
          </TouchableOpacity>
          <Text style={s.label}>مقدار:</Text>
          <TextInput style={s.input} value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder="مثال: 1000000" placeholderTextColor="#999" />
          <Text style={s.resultsTitle}>نتایج:</Text>
          {converterItems.filter(x => x !== fromCurrency).map(sym => {
            const info = getInfo(sym);
            const res = convert(sym);
            return (
              <View key={sym} style={s.resCard}>
                <View style={s.resHeader}>
                  {info.cat === 'currency' && <Text style={s.resFlag}>{info.flag}</Text>}
                  <Text style={s.resName}>{info.name}</Text>
                </View>
                <Text style={s.resValue}>{res}</Text>
              </View>
            );
          })}
        </ScrollView>
        <Modal animationType="slide" transparent visible={currencyModal} onRequestClose={() => setCurrencyModal(false)}>
          <View style={s.modalOverlay}>
            <View style={s.modalContent}>
              <View style={s.modalHeader}>
                <Text style={s.modalTitle}>انتخاب ارز</Text>
                <TouchableOpacity onPress={() => setCurrencyModal(false)}><Text style={s.closeBtn}>✕</Text></TouchableOpacity>
              </View>
              <ScrollView style={s.modalList}>
                {converterItems.map(sym => {
                  const info = getInfo(sym);
                  return (
                    <TouchableOpacity key={sym} style={s.currModalItem} onPress={() => { setFromCurrency(sym); setCurrencyModal(false); }}>
                      <Text style={s.currModalFlag}>{info.flag}</Text>
                      <Text style={s.currModalText}>{info.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s.container}>
      <StatusBar style={currentTheme === 'gold' || currentTheme === 'neon' ? "light" : "dark"} />
      <View style={s.header}>
        <View style={s.dateContainer}>
          <Text style={s.datePersian}>{persianDate}</Text>
          <Text style={s.dateGregorian}>{gregorianDate}</Text>
          <Text style={s.lastUpdate}>آخرین بروزرسانی: {lastUpdate}</Text>
        </View>
      </View>
      <TouchableOpacity style={s.calcBtn} onPress={() => setConverterVisible(true)}>
        <Text style={s.calcIcon}>🧮</Text>
      </TouchableOpacity>
      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={s.loadingText}>در حال بارگذاری...</Text>
        </View>
      ) : error ? (
        <View style={s.center}>
          <Text style={s.errorIcon}>⚠️</Text>
          <Text style={s.error}>{error}</Text>
        </View>
      ) : (
        <ScrollView style={s.list} showsVerticalScrollIndicator={false}>
          {selectedItems.map(sym => {
            const info = getInfo(sym);
            const val = rates[sym];
            return (
              <View key={sym} style={s.card}>
                <View style={s.cardHeader}>
                  {info.cat === 'currency' && <Text style={s.flag}>{info.flag}</Text>}
                  <Text style={s.name}>{info.name}</Text>
                </View>
                <Text style={s.price}>{val ? `${val.toLocaleString('fa-IR')} ${info.unit}` : '...'}</Text>
              </View>
            );
          })}
          <TouchableOpacity style={s.settingsBtn} onPress={() => setModalVisible(true)}>
            <Text style={s.settingsIcon}>⚙️</Text>
            <Text style={s.settingsText}>تنظیم لیست</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.themeBtn} onPress={() => setThemeModal(true)}>
            <Text style={s.themeIcon}>🎨</Text>
            <Text style={s.themeText}>تغییر تم</Text>
          </TouchableOpacity>
          <View style={s.footer}><Text style={s.footerText}>بروزرسانی خودکار هر ۵ دقیقه</Text></View>
        </ScrollView>
      )}
      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>انتخاب ارزها</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}><Text style={s.closeBtn}>✕</Text></TouchableOpacity>
            </View>
            <ScrollView style={s.modalList}>
              {['gold','currency','crypto'].map(cat => {
                const items = allItems.filter(sym => getInfo(sym).cat === cat);
                if (!items.length) return null;
                return (
                  <View key={cat}>
                    <Text style={s.catTitle}>{cat === 'gold' ? '🏆 طلا و سکه' : cat === 'crypto' ? '₿ کریپتو' : '🌍 ارزها'}</Text>
                    {items.map(sym => {
                      const info = getInfo(sym);
                      const sel = selectedItems.includes(sym);
                      return (
                        <TouchableOpacity key={sym} style={[s.modalItem, sel && s.modalItemSel]} onPress={() => setSelectedItems(sel ? selectedItems.filter(x => x !== sym) : [...selectedItems, sym])}>
                          {info.cat === 'currency' && <Text style={s.modalItemFlag}>{info.flag}</Text>}
                          <Text style={s.modalItemText}>{info.name}</Text>
                          {sel && <Text style={s.check}>✓</Text>}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                );
              })}
            </ScrollView>
            <TouchableOpacity style={s.doneBtn} onPress={() => setModalVisible(false)}>
              <Text style={s.doneBtnText}>تایید ({selectedItems.length})</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal animationType="fade" transparent visible={themeModal} onRequestClose={() => setThemeModal(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>انتخاب تم</Text>
              <TouchableOpacity onPress={() => setThemeModal(false)}><Text style={s.closeBtn}>✕</Text></TouchableOpacity>
            </View>
            <ScrollView style={s.modalList}>
              {Object.keys(THEMES).map(k => {
                const t = THEMES[k];
                return (
                  <TouchableOpacity key={k} style={[s.themeItem, {backgroundColor:t.headerBg, borderColor:t.primary}]} onPress={() => changeTheme(k)}>
                    <Text style={[s.themeItemText, {color:t.textPrimary}]}>{t.name}</Text>
                    {currentTheme === k && <Text style={[s.check, {color:t.primary}]}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function createStyles(t) {
  return StyleSheet.create({
    container: {flex:1, backgroundColor:t.bg},
    header: {backgroundColor:t.headerBg, paddingTop:40, paddingBottom:60, paddingHorizontal:20, borderBottomLeftRadius:35, borderBottomRightRadius:35, shadowColor:t.primary, shadowOffset:{width:0,height:3}, shadowOpacity:0.15, shadowRadius:6, elevation:5},
    dateContainer: {alignItems:'center', marginTop:15},
    datePersian: {fontSize:30, fontWeight:'bold', color:t.textPrimary, marginBottom:10},
    dateGregorian: {fontSize:16, color:t.textSecondary, marginBottom:12},
    lastUpdate: {fontSize:13, color:t.textSecondary},
    calcBtn: {position:'absolute', top:165, left:20, width:55, height:55, backgroundColor:t.primary, borderRadius:28, justifyContent:'center', alignItems:'center', shadowColor:t.primary, shadowOffset:{width:0,height:3}, shadowOpacity:0.3, shadowRadius:5, elevation:6, zIndex:10},
    calcIcon: {fontSize:28},
    center: {flex:1, justifyContent:'center', alignItems:'center', padding:30},
    loadingText: {color:t.primary, fontSize:16, marginTop:15},
    errorIcon: {fontSize:60, marginBottom:15},
    error: {color:'#E74C3C', fontSize:18, textAlign:'center'},
    list: {flex:1, padding:16, marginTop:40},
    card: {backgroundColor:t.cardBg, borderRadius:20, padding:20, marginBottom:14, borderWidth:2, borderColor:t.cardBorder, shadowColor:t.primary, shadowOffset:{width:0,height:2}, shadowOpacity:0.12, shadowRadius:4, elevation:3},
    cardHeader: {flexDirection:'row', alignItems:'center', marginBottom:12},
    flag: {fontSize:28, marginRight:12},
    name: {fontSize:17, fontWeight:'600', color:t.textPrimary, flex:1},
    price: {fontSize:22, fontWeight:'bold', color:t.primary, textAlign:'right'},
    settingsBtn: {flexDirection:'row', alignItems:'center', justifyContent:'center', backgroundColor:t.secondary, padding:16, borderRadius:15, marginTop:10, marginBottom:12, shadowColor:t.secondary, shadowOffset:{width:0,height:3}, shadowOpacity:0.3, shadowRadius:5, elevation:5},
    settingsIcon: {fontSize:24, marginRight:10},
    settingsText: {color:'#FFF', fontSize:16, fontWeight:'bold'},
    themeBtn: {flexDirection:'row', alignItems:'center', justifyContent:'center', backgroundColor:t.primary, padding:16, borderRadius:15, marginBottom:20, shadowColor:t.primary, shadowOffset:{width:0,height:3}, shadowOpacity:0.3, shadowRadius:5, elevation:5},
    themeIcon: {fontSize:24, marginRight:10},
    themeText: {color:'#FFF', fontSize:16, fontWeight:'bold'},
    footer: {alignItems:'center', paddingVertical:25},
    footerText: {color:'#95A5A6', fontSize:12},
    modalOverlay: {flex:1, backgroundColor:'rgba(0,0,0,0.6)', justifyContent:'flex-end'},
    modalContent: {backgroundColor:t.cardBg, borderTopLeftRadius:30, borderTopRightRadius:30, maxHeight:'85%', paddingBottom:20},
    modalHeader: {flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:20, borderBottomWidth:1, borderBottomColor:t.cardBorder},
    modalTitle: {fontSize:22, fontWeight:'bold', color:t.primary},
    closeBtn: {fontSize:30, color:'#95A5A6', fontWeight:'300'},
    modalList: {padding:15},
    catTitle: {fontSize:16, fontWeight:'bold', color:t.primary, marginTop:15, marginBottom:10, marginRight:10},
    modalItem: {flexDirection:'row', alignItems:'center', backgroundColor:t.headerBg, padding:15, borderRadius:12, marginBottom:8},
    modalItemSel: {backgroundColor:t.cardBorder, borderWidth:2, borderColor:t.primary},
    modalItemFlag: {fontSize:24, marginRight:12},
    modalItemText: {flex:1, fontSize:16, color:t.textPrimary},
    check: {fontSize:24, fontWeight:'bold'},
    doneBtn: {backgroundColor:t.primary, marginHorizontal:20, padding:16, borderRadius:15, alignItems:'center', shadowColor:t.primary, shadowOffset:{width:0,height:3}, shadowOpacity:0.3, shadowRadius:5, elevation:6},
    doneBtnText: {color:'#FFF', fontSize:18, fontWeight:'bold'},
    convHeader: {backgroundColor:t.headerBg, padding:20, flexDirection:'row', justifyContent:'space-between', alignItems:'center', borderBottomLeftRadius:25, borderBottomRightRadius:25},
    backBtn: {padding:5},
    backIcon: {fontSize:28, color:t.primary, fontWeight:'bold'},
    convTitle: {fontSize:22, fontWeight:'bold', color:t.textPrimary},
    convScreen: {flex:1, padding:20, backgroundColor:t.bg},
    currBox: {backgroundColor:t.cardBg, borderRadius:20, padding:25, marginBottom:20, borderWidth:2, borderColor:t.cardBorder, flexDirection:'row', alignItems:'center', shadowColor:t.primary, shadowOffset:{width:0,height:2}, shadowOpacity:0.15, shadowRadius:4, elevation:4},
    currFlag: {fontSize:40, marginRight:15},
    currText: {fontSize:20, fontWeight:'bold', color:t.textPrimary, flex:1},
    label: {fontSize:17, fontWeight:'bold', color:t.primary, marginBottom:12},
    input: {backgroundColor:t.cardBg, color:t.textPrimary, padding:18, borderRadius:15, fontSize:17, borderWidth:2, borderColor:t.cardBorder, fontWeight:'600', marginBottom:25},
    resultsTitle: {fontSize:18, fontWeight:'bold', color:t.textPrimary, marginBottom:15},
    resCard: {backgroundColor:t.cardBg, borderRadius:16, padding:18, marginBottom:12, borderWidth:2, borderColor:t.cardBorder, flexDirection:'row', justifyContent:'space-between', alignItems:'center'},
    resHeader: {flexDirection:'row', alignItems:'center', flex:1},
    resFlag: {fontSize:24, marginRight:12},
    resName: {fontSize:16, color:t.textPrimary, fontWeight:'600'},
    resValue: {fontSize:18, fontWeight:'bold', color:t.primary},
    currModalItem: {flexDirection:'row', alignItems:'center', backgroundColor:t.headerBg, padding:18, borderRadius:15, marginBottom:10, borderWidth:1, borderColor:t.cardBorder},
    currModalFlag: {fontSize:32, marginRight:15},
    currModalText: {fontSize:18, color:t.textPrimary, fontWeight:'600'},
    themeItem: {flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:18, borderRadius:15, marginBottom:10, borderWidth:2},
    themeItemText: {fontSize:17, fontWeight:'600'},
  });
}
