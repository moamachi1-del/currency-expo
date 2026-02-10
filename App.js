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
  green: { name: 'سبز', nameEn: 'Green', bg: '#F0F9F6', headerBg: '#E8F8F5', primary: '#00CBA9', secondary: '#4ECDC4', cardBg: '#FFFFFF', cardBorder: '#D4F1E8', textPrimary: '#1A5F4F', textSecondary: '#5B7A6F' },
  blue: { name: 'آبی', nameEn: 'Blue', bg: '#F0F8FF', headerBg: '#E3F2FD', primary: '#2196F3', secondary: '#03A9F4', cardBg: '#FFFFFF', cardBorder: '#BBDEFB', textPrimary: '#0D47A1', textSecondary: '#1976D2' },
  purple: { name: 'بنفش', nameEn: 'Purple', bg: '#F8F4FF', headerBg: '#F3E5F5', primary: '#9C27B0', secondary: '#BA68C8', cardBg: '#FFFFFF', cardBorder: '#E1BEE7', textPrimary: '#4A148C', textSecondary: '#7B1FA2' },
  orange: { name: 'نارنجی', nameEn: 'Orange', bg: '#FFF8F0', headerBg: '#FFF3E0', primary: '#FF9800', secondary: '#FFB74D', cardBg: '#FFFFFF', cardBorder: '#FFE0B2', textPrimary: '#E65100', textSecondary: '#F57C00' },
  pink: { name: 'صورتی', nameEn: 'Pink', bg: '#FFF0F8', headerBg: '#FCE4EC', primary: '#E91E63', secondary: '#F06292', cardBg: '#FFFFFF', cardBorder: '#F8BBD0', textPrimary: '#880E4F', textSecondary: '#C2185B' },
  gold: { name: 'طلایی', nameEn: 'Gold', bg: '#1A1A1A', headerBg: '#2C2C2C', primary: '#FFD700', secondary: '#FFA500', cardBg: '#2C2C2C', cardBorder: '#444444', textPrimary: '#FFD700', textSecondary: '#FFA500' },
  neon: { name: 'نئون', nameEn: 'Neon', bg: '#0A1628', headerBg: '#1A2742', primary: '#00FFC6', secondary: '#00D9FF', cardBg: '#1A2742', cardBorder: '#2C3E50', textPrimary: '#00FFC6', textSecondary: '#00D9FF' },
};

const FONT_SIZES = {
  small: { name: 'کوچک', nameEn: 'Small', scale: 0.85 },
  medium: { name: 'متوسط', nameEn: 'Medium', scale: 1 },
  large: { name: 'بزرگ', nameEn: 'Large', scale: 1.15 },
};

const CURRENCIES = {
  'TOMAN': { name: 'تومان ایران', nameEn: 'Iranian Toman', flag: '🇮🇷', cat: 'converter_only', unit: 'تومان', unitEn: 'Toman' },
  'USDT_IRT': { name: 'تتر', nameEn: 'Tether', flag: '🇺🇸', cat: 'currency', unit: 'تومان', unitEn: 'Toman' },
  'USD': { name: 'دلار', nameEn: 'US Dollar', flag: '🇺🇸', cat: 'currency', unit: 'تومان', unitEn: 'Toman' },
  'EUR': { name: 'یورو', nameEn: 'Euro', flag: '🇪🇺', cat: 'currency', unit: 'تومان', unitEn: 'Toman' },
  'GBP': { name: 'پوند', nameEn: 'Pound', flag: '🇬🇧', cat: 'currency', unit: 'تومان', unitEn: 'Toman' },
  'TRY': { name: 'لیر ترکیه', nameEn: 'Turkish Lira', flag: '🇹🇷', cat: 'currency', unit: 'تومان', unitEn: 'Toman' },
  'AED': { name: 'درهم', nameEn: 'Dirham', flag: '🇦🇪', cat: 'currency', unit: 'تومان', unitEn: 'Toman' },
  'SAR': { name: 'ریال سعودی', nameEn: 'Saudi Riyal', flag: '🇸🇦', cat: 'currency', unit: 'تومان', unitEn: 'Toman' },
  'CHF': { name: 'فرانک', nameEn: 'Swiss Franc', flag: '🇨🇭', cat: 'currency', unit: 'تومان', unitEn: 'Toman' },
  'CNY': { name: 'یوان', nameEn: 'Yuan', flag: '🇨🇳', cat: 'currency', unit: 'تومان', unitEn: 'Toman' },
  'JPY': { name: 'ین', nameEn: 'Yen', flag: '🇯🇵', cat: 'currency', unit: 'تومان', unitEn: 'Toman' },
  'KRW': { name: 'وون', nameEn: 'Won', flag: '🇰🇷', cat: 'currency', unit: 'تومان', unitEn: 'Toman' },
  'INR': { name: 'روپیه هند', nameEn: 'Indian Rupee', flag: '🇮🇳', cat: 'currency', unit: 'تومان', unitEn: 'Toman' },
  'PKR': { name: 'روپیه پاکستان', nameEn: 'Pakistani Rupee', flag: '🇵🇰', cat: 'currency', unit: 'تومان', unitEn: 'Toman' },
  'THB': { name: 'بات', nameEn: 'Baht', flag: '🇹🇭', cat: 'currency', unit: 'تومان', unitEn: 'Toman' },
  'RUB': { name: 'روبل', nameEn: 'Ruble', flag: '🇷🇺', cat: 'currency', unit: 'تومان', unitEn: 'Toman' },
  'CAD': { name: 'دلار کانادا', nameEn: 'Canadian Dollar', flag: '🇨🇦', cat: 'currency', unit: 'تومان', unitEn: 'Toman' },
  'AUD': { name: 'دلار استرالیا', nameEn: 'Australian Dollar', flag: '🇦🇺', cat: 'currency', unit: 'تومان', unitEn: 'Toman' },
  'IR_GOLD_18K': { name: 'طلا ۱۸', nameEn: 'Gold 18K', flag: '', cat: 'gold', unit: 'تومان', unitEn: 'Toman' },
  'IR_GOLD_24K': { name: 'طلا ۲۴', nameEn: 'Gold 24K', flag: '', cat: 'gold', unit: 'تومان', unitEn: 'Toman' },
  'IR_COIN_EMAMI': { name: 'سکه امامی', nameEn: 'Emami Coin', flag: '', cat: 'gold', unit: 'تومان', unitEn: 'Toman' },
  'IR_COIN_BAHAR': { name: 'سکه بهار', nameEn: 'Bahar Coin', flag: '', cat: 'gold', unit: 'تومان', unitEn: 'Toman' },
  'IR_COIN_HALF': { name: 'نیم سکه', nameEn: 'Half Coin', flag: '', cat: 'gold', unit: 'تومان', unitEn: 'Toman' },
  'IR_COIN_QUARTER': { name: 'ربع سکه', nameEn: 'Quarter Coin', flag: '', cat: 'gold', unit: 'تومان', unitEn: 'Toman' },
  'BTC': { name: 'بیت‌کوین', nameEn: 'Bitcoin', flag: '', cat: 'crypto', unit: 'تومان', unitEn: 'Toman' },
  'ETH': { name: 'اتریوم', nameEn: 'Ethereum', flag: '', cat: 'crypto', unit: 'تومان', unitEn: 'Toman' },
};

export default function App() {
  const [rates, setRates] = useState({ TOMAN: 1 });
  const [allItems, setAllItems] = useState([]);
  const [converterItems, setConverterItems] = useState(['TOMAN']);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [settingsSubMenu, setSettingsSubMenu] = useState(null);
  const [converterVisible, setConverterVisible] = useState(false);
  const [currencyModal, setCurrencyModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState(['USDT_IRT', 'USD', 'EUR', 'IR_GOLD_18K', 'IR_COIN_EMAMI', 'BTC']);
  const [lastUpdate, setLastUpdate] = useState('');
  const [persianDate, setPersianDate] = useState('');
  const [gregorianDate, setGregorianDate] = useState('');
  const [fromCurrency, setFromCurrency] = useState('TOMAN');
  const [amount, setAmount] = useState('1000000');
  const [currentTheme, setCurrentTheme] = useState('green');
  const [fontSize, setFontSize] = useState('medium');
  const [language, setLanguage] = useState('fa');

  const theme = THEMES[currentTheme];
  const fontScale = FONT_SIZES[fontSize].scale;

  const t = (fa, en) => language === 'fa' ? fa : en;

  const toJalali = (gDate) => {
    let gy = gDate.getFullYear(), gm = gDate.getMonth() + 1, gd = gDate.getDate();
    const g_d_m = [0,31,59,90,120,151,181,212,243,273,304,334];
    let jy = gy <= 1600 ? 0 : 979;
    gy -= gy <= 1600 ? 621 : 1600;
    const gy2 = gm > 2 ? gy + 1 : gy;
    let days = 365*gy + Math.floor((gy2+3)/4) - Math.floor((gy2+99)/100) + Math.floor((gy2+399)/400) - 80 + gd + g_d_m[gm-1];
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
      
      let usdRate = 1;
      
      // First pass: get USD rate
      [data.gold, data.currency, data.cryptocurrency].forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach(item => {
            if (item.symbol === 'USD' && item.price) {
              usdRate = parseInt(item.price);
            }
          });
        }
      });
      
      // Second pass: process all items
      [data.gold, data.currency, data.cryptocurrency].forEach(arr => {
        if (arr && Array.isArray(arr)) {
          arr.forEach(item => {
            if (item.symbol && item.price && allowed.includes(item.symbol)) {
              // BTC and ETH prices are in USD, convert to Toman
              if (item.symbol === 'BTC' || item.symbol === 'ETH') {
                newRates[item.symbol] = parseInt(item.price) * usdRate;
              } else {
                newRates[item.symbol] = parseInt(item.price);
              }
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
      setError(t('خطا در دریافت', 'Fetch Error'));
    }
    setLoading(false);
  };

  useEffect(() => {
    (async () => {
      try {
        const [[,cache], [,update], [,selected], [,thm], [,fsize], [,lang]] = await AsyncStorage.multiGet(['@cache','@update','@selected','@theme','@fontsize','@lang']);
        if (cache) setRates({...JSON.parse(cache), TOMAN: 1});
        if (update) setLastUpdate(update);
        if (selected) setSelectedItems(JSON.parse(selected));
        if (thm) setCurrentTheme(thm);
        if (fsize) setFontSize(fsize);
        if (lang) setLanguage(lang);
        updateDates();
      } catch {}
      setLoading(false);
      fetchRates();
    })();
    const interval = setInterval(fetchRates, 5*60*1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => { AsyncStorage.setItem('@selected', JSON.stringify(selectedItems)); }, [selectedItems]);

  const getInfo = (symbol) => CURRENCIES[symbol] || { name: symbol, nameEn: symbol, flag: '🌍', cat: 'other', unit: 'تومان', unitEn: 'Toman' };

  const formatNumber = (num, decimals = 0) => {
    if (decimals > 0) {
      return num.toLocaleString('en-US', {maximumFractionDigits: decimals, minimumFractionDigits: 0});
    }
    return num.toLocaleString('en-US', {maximumFractionDigits: 0});
  };

  const convert = (target) => {
    const fromRate = rates[fromCurrency] || 1;
    const toRate = rates[target] || 1;
    const amt = parseFloat(amount) || 0;
    if (amt > 0) {
      const result = (amt * fromRate) / toRate;
      if (target === 'TOMAN') return formatNumber(result, 2);
      if (target.includes('GOLD')) return formatNumber(result, 3) + t(' گرم', ' g');
      if (target.includes('COIN')) return formatNumber(result, 4);
      if (target === 'BTC' || target === 'ETH') return formatNumber(result, 8);
      return formatNumber(result, 2);
    }
    return '---';
  };

  const saveTheme = async (t) => {
    setCurrentTheme(t);
    await AsyncStorage.setItem('@theme', t);
    setSettingsSubMenu(null);
    setSettingsVisible(false);
  };

  const saveFontSize = async (f) => {
    setFontSize(f);
    await AsyncStorage.setItem('@fontsize', f);
    setSettingsSubMenu(null);
    setSettingsVisible(false);
  };

  const saveLanguage = async (l) => {
    setLanguage(l);
    await AsyncStorage.setItem('@lang', l);
    setSettingsSubMenu(null);
    setSettingsVisible(false);
  };

  const s = createStyles(theme, fontScale, language);

  if (converterVisible) {
    const fromInfo = getInfo(fromCurrency);
    return (
      <SafeAreaView style={s.container}>
        <StatusBar style={currentTheme === 'gold' || currentTheme === 'neon' ? "light" : "dark"} />
        <View style={s.convHeader}>
          <TouchableOpacity onPress={() => setConverterVisible(false)} style={s.backBtn}>
            <Text style={s.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={s.convTitle}>{t('مبدل ارز', 'Converter')}</Text>
          <View style={{width:40}} />
        </View>
        <ScrollView style={s.convScreen} contentContainerStyle={{paddingBottom: 100}}>
          <TouchableOpacity style={s.currBox} onPress={() => setCurrencyModal(true)}>
            <Text style={s.currFlag}>{fromInfo.flag}</Text>
            <Text style={s.currText}>{language === 'fa' ? fromInfo.name : fromInfo.nameEn}</Text>
          </TouchableOpacity>
          <Text style={s.label}>{t('مقدار:', 'Amount:')}</Text>
          <TextInput style={s.input} value={amount} onChangeText={setAmount} keyboardType="numeric" placeholder={t('مثال: 1000000', 'e.g. 1000000')} placeholderTextColor="#999" />
          <Text style={s.resultsTitle}>{t('نتایج:', 'Results:')}</Text>
          {converterItems.filter(x => x !== fromCurrency && (getInfo(x).cat === 'currency' || getInfo(x).cat === 'crypto' || x === 'TOMAN')).map(sym => {
            const info = getInfo(sym);
            const res = convert(sym);
            return (
              <View key={sym} style={s.resCard}>
                <Text style={s.resValue}>{res}</Text>
                <Text style={s.resName}>{language === 'fa' ? info.name : info.nameEn}</Text>
              </View>
            );
          })}
        </ScrollView>
        <Modal animationType="slide" transparent visible={currencyModal} onRequestClose={() => setCurrencyModal(false)}>
          <View style={s.modalOverlay}>
            <View style={s.modalContent}>
              <View style={s.modalHeader}>
                <Text style={s.modalTitle}>{t('انتخاب ارز', 'Select Currency')}</Text>
                <TouchableOpacity onPress={() => setCurrencyModal(false)}><Text style={s.closeBtn}>✕</Text></TouchableOpacity>
              </View>
              <ScrollView style={s.modalList}>
                {converterItems.filter(x => getInfo(x).cat === 'currency' || getInfo(x).cat === 'crypto' || x === 'TOMAN').map(sym => {
                  const info = getInfo(sym);
                  return (
                    <TouchableOpacity key={sym} style={s.currModalItem} onPress={() => { setFromCurrency(sym); setCurrencyModal(false); }}>
                      <Text style={s.currModalFlag}>{info.flag}</Text>
                      <Text style={s.currModalText}>{language === 'fa' ? info.name : info.nameEn}</Text>
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
        <TouchableOpacity style={s.settingsTopBtn} onPress={() => setSettingsVisible(true)}>
          <View style={s.iconCircle}>
            <Text style={s.topBtnIcon}>≡</Text>
          </View>
        </TouchableOpacity>
        <View style={s.dateContainer}>
          <Text style={s.datePersian}>{persianDate}</Text>
          <Text style={s.dateGregorian}>{gregorianDate}</Text>
          <Text style={s.lastUpdate}>{t('آخرین بروزرسانی:', 'Last Update:')} {lastUpdate}</Text>
        </View>
      </View>
      <TouchableOpacity style={s.calcBtn} onPress={() => setConverterVisible(true)}>
        <Text style={s.calcIcon}>🧮</Text>
      </TouchableOpacity>
      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={s.loadingText}>{t('در حال بارگذاری...', 'Loading...')}</Text>
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
                  <Text style={s.name}>{language === 'fa' ? info.name : info.nameEn}</Text>
                </View>
                <Text style={s.price}>
                  {val ? formatNumber(val) : '...'}
                </Text>
              </View>
            );
          })}
          <View style={s.footer}><Text style={s.footerText}>{t('بروزرسانی خودکار هر ۵ دقیقه', 'Auto-refresh every 5 minutes')}</Text></View>
        </ScrollView>
      )}

      {/* Settings Modal */}
      <Modal animationType="slide" transparent visible={settingsVisible} onRequestClose={() => setSettingsVisible(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{t('تنظیمات', 'Settings')}</Text>
              <TouchableOpacity onPress={() => setSettingsVisible(false)}><Text style={s.closeBtn}>✕</Text></TouchableOpacity>
            </View>
            <ScrollView style={s.modalList}>
              <TouchableOpacity style={s.settingsMenuItem} onPress={() => setSettingsSubMenu('currencies')}>
                <Text style={s.settingsMenuText}>{t('لیست ارزها', 'Currency List')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.settingsMenuItem} onPress={() => setSettingsSubMenu('fontsize')}>
                <Text style={s.settingsMenuText}>{t('اندازه قلم', 'Font Size')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.settingsMenuItem} onPress={() => setSettingsSubMenu('language')}>
                <Text style={s.settingsMenuText}>{t('انتخاب زبان', 'Language')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.settingsMenuItem} onPress={() => setSettingsSubMenu('theme')}>
                <Text style={s.settingsMenuText}>{t('رنگ‌بندی', 'Colors')}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Sub-menus */}
      <Modal animationType="slide" transparent visible={settingsSubMenu === 'currencies'} onRequestClose={() => setSettingsSubMenu(null)}>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <TouchableOpacity onPress={() => setSettingsSubMenu(null)}><Text style={s.backIcon}>←</Text></TouchableOpacity>
              <Text style={s.modalTitle}>{t('لیست ارزها', 'Currency List')}</Text>
              <View style={{width:40}} />
            </View>
            <ScrollView style={s.modalList}>
              {['gold','currency','crypto'].map(cat => {
                const items = allItems.filter(sym => getInfo(sym).cat === cat);
                if (!items.length) return null;
                return (
                  <View key={cat}>
                    <Text style={s.catTitle}>{cat === 'gold' ? t('طلا و سکه', 'Gold & Coins') : cat === 'crypto' ? t('کریپتو', 'Crypto') : t('ارزها', 'Currencies')}</Text>
                    {items.map(sym => {
                      const info = getInfo(sym);
                      const sel = selectedItems.includes(sym);
                      return (
                        <TouchableOpacity key={sym} style={[s.modalItem, sel && s.modalItemSel]} onPress={() => setSelectedItems(sel ? selectedItems.filter(x => x !== sym) : [...selectedItems, sym])}>
                          {info.cat === 'currency' && <Text style={s.modalItemFlag}>{info.flag}</Text>}
                          <Text style={s.modalItemText}>{language === 'fa' ? info.name : info.nameEn}</Text>
                          {sel && <Text style={s.check}>✓</Text>}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                );
              })}
            </ScrollView>
            <TouchableOpacity style={s.doneBtn} onPress={() => setSettingsSubMenu(null)}>
              <Text style={s.doneBtnText}>{t('تایید', 'Done')} ({selectedItems.length})</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent visible={settingsSubMenu === 'fontsize'} onRequestClose={() => setSettingsSubMenu(null)}>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <TouchableOpacity onPress={() => setSettingsSubMenu(null)}><Text style={s.backIcon}>←</Text></TouchableOpacity>
              <Text style={s.modalTitle}>{t('اندازه قلم', 'Font Size')}</Text>
              <View style={{width:40}} />
            </View>
            <View style={s.choiceList}>
              {Object.keys(FONT_SIZES).map(k => (
                <TouchableOpacity key={k} style={[s.choiceItem, fontSize === k && s.choiceItemSel]} onPress={() => saveFontSize(k)}>
                  <Text style={s.choiceText}>{language === 'fa' ? FONT_SIZES[k].name : FONT_SIZES[k].nameEn}</Text>
                  {fontSize === k && <Text style={s.check}>✓</Text>}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent visible={settingsSubMenu === 'language'} onRequestClose={() => setSettingsSubMenu(null)}>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <TouchableOpacity onPress={() => setSettingsSubMenu(null)}><Text style={s.backIcon}>←</Text></TouchableOpacity>
              <Text style={s.modalTitle}>{t('انتخاب زبان', 'Language')}</Text>
              <View style={{width:40}} />
            </View>
            <View style={s.choiceList}>
              <TouchableOpacity style={[s.choiceItem, language === 'fa' && s.choiceItemSel]} onPress={() => saveLanguage('fa')}>
                <Text style={s.choiceText}>فارسی</Text>
                {language === 'fa' && <Text style={s.check}>✓</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={[s.choiceItem, language === 'en' && s.choiceItemSel]} onPress={() => saveLanguage('en')}>
                <Text style={s.choiceText}>English</Text>
                {language === 'en' && <Text style={s.check}>✓</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal animationType="slide" transparent visible={settingsSubMenu === 'theme'} onRequestClose={() => setSettingsSubMenu(null)}>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <TouchableOpacity onPress={() => setSettingsSubMenu(null)}><Text style={s.backIcon}>←</Text></TouchableOpacity>
              <Text style={s.modalTitle}>{t('رنگ‌بندی', 'Colors')}</Text>
              <View style={{width:40}} />
            </View>
            <ScrollView style={s.modalList}>
              {Object.keys(THEMES).map(k => {
                const tm = THEMES[k];
                return (
                  <TouchableOpacity key={k} style={[s.themeItem, {backgroundColor:tm.headerBg, borderColor:tm.primary}]} onPress={() => saveTheme(k)}>
                    <Text style={[s.themeItemText, {color:tm.textPrimary}]}>{language === 'fa' ? tm.name : tm.nameEn}</Text>
                    {currentTheme === k && <Text style={[s.check, {color:tm.primary}]}>✓</Text>}
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

function createStyles(t, scale, lang) {
  const isRTL = lang === 'fa';
  return StyleSheet.create({
    container: {flex:1, backgroundColor:t.bg},
    header: {backgroundColor:t.headerBg, paddingTop:40, paddingBottom:60, paddingHorizontal:20, borderBottomLeftRadius:35, borderBottomRightRadius:35, shadowColor:t.primary, shadowOffset:{width:0,height:3}, shadowOpacity:0.15, shadowRadius:6, elevation:5},
    settingsTopBtn: {position:'absolute', top:45, left:15, width:40, height:40, justifyContent:'center', alignItems:'center', zIndex:20},
    iconCircle: {width:40, height:40, borderRadius:20, backgroundColor:t.primary, justifyContent:'center', alignItems:'center', shadowColor:t.primary, shadowOffset:{width:0,height:2}, shadowOpacity:0.4, shadowRadius:4, elevation:4},
    topBtnIcon: {fontSize:22*scale, color:'#FFF', fontWeight:'600'},
    dateContainer: {alignItems:'center', marginTop:15},
    datePersian: {fontSize:30*scale, fontWeight:'bold', color:t.textPrimary, marginBottom:10},
    dateGregorian: {fontSize:16*scale, color:t.textSecondary, marginBottom:12},
    lastUpdate: {fontSize:13*scale, color:t.textSecondary},
    calcBtn: {position:'absolute', top:165, left:20, width:46, height:46, backgroundColor:t.primary, borderRadius:23, justifyContent:'center', alignItems:'center', shadowColor:t.primary, shadowOffset:{width:0,height:3}, shadowOpacity:0.3, shadowRadius:5, elevation:6, zIndex:10},
    calcIcon: {fontSize:24*scale, color:'#FFF', fontWeight:'600'},
    center: {flex:1, justifyContent:'center', alignItems:'center', padding:30},
    loadingText: {color:t.primary, fontSize:16*scale, marginTop:15},
    errorIcon: {fontSize:60, marginBottom:15},
    error: {color:'#E74C3C', fontSize:18*scale, textAlign:'center'},
    list: {flex:1, padding:16, marginTop:40},
    card: {backgroundColor:t.cardBg, borderRadius:20, padding:20, marginBottom:14, borderWidth:2, borderColor:t.cardBorder, shadowColor:t.primary, shadowOffset:{width:0,height:2}, shadowOpacity:0.12, shadowRadius:4, elevation:3},
    cardHeader: {flexDirection:'row', alignItems:'center', marginBottom:12},
    flag: {fontSize:28, marginRight:12},
    name: {fontSize:17*scale, fontWeight:'600', color:t.textPrimary, flex:1},
    price: {fontSize:22*scale, fontWeight:'bold', color:t.primary, textAlign:isRTL?'right':'left'},
    footer: {alignItems:'center', paddingVertical:25},
    footerText: {color:'#95A5A6', fontSize:12*scale},
    modalOverlay: {flex:1, backgroundColor:'rgba(0,0,0,0.6)', justifyContent:'flex-end'},
    modalContent: {backgroundColor:t.cardBg, borderTopLeftRadius:30, borderTopRightRadius:30, maxHeight:'85%', paddingBottom:20},
    modalHeader: {flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:20, borderBottomWidth:1, borderBottomColor:t.cardBorder},
    modalTitle: {fontSize:22*scale, fontWeight:'bold', color:t.primary},
    closeBtn: {fontSize:30, color:'#95A5A6', fontWeight:'300'},
    backIcon: {fontSize:28, color:t.primary, fontWeight:'bold'},
    modalList: {padding:15, paddingBottom:1},
    catTitle: {fontSize:16*scale, fontWeight:'bold', color:t.primary, marginTop:15, marginBottom:10, marginRight:10},
    modalItem: {flexDirection:'row', alignItems:'center', backgroundColor:t.headerBg, padding:18, borderRadius:12, marginBottom:10},
    modalItemSel: {backgroundColor:t.cardBorder, borderWidth:2, borderColor:t.primary},
    modalItemFlag: {fontSize:24, marginRight:12},
    modalItemText: {flex:1, fontSize:16*scale, color:t.textPrimary},
    check: {fontSize:24, fontWeight:'bold', color:t.primary},
    doneBtn: {backgroundColor:t.primary, marginHorizontal:20, padding:16, borderRadius:15, alignItems:'center', shadowColor:t.primary, shadowOffset:{width:0,height:3}, shadowOpacity:0.3, shadowRadius:5, elevation:6},
    doneBtnText: {color:'#FFF', fontSize:18*scale, fontWeight:'bold'},
    convHeader: {backgroundColor:t.headerBg, padding:20, flexDirection:'row', justifyContent:'space-between', alignItems:'center', borderBottomLeftRadius:25, borderBottomRightRadius:25},
    convTitle: {fontSize:22*scale, fontWeight:'bold', color:t.textPrimary},
    convScreen: {flex:1, padding:20, backgroundColor:t.bg},
    currBox: {backgroundColor:t.cardBg, borderRadius:20, padding:25, marginBottom:20, borderWidth:2, borderColor:t.cardBorder, flexDirection:'row', alignItems:'center', shadowColor:t.primary, shadowOffset:{width:0,height:2}, shadowOpacity:0.15, shadowRadius:4, elevation:4},
    currFlag: {fontSize:40, marginRight:15},
    currText: {fontSize:20*scale, fontWeight:'bold', color:t.textPrimary, flex:1},
    label: {fontSize:17*scale, fontWeight:'bold', color:t.primary, marginBottom:12},
    input: {backgroundColor:t.cardBg, color:t.textPrimary, padding:18, borderRadius:15, fontSize:17*scale, borderWidth:2, borderColor:t.cardBorder, fontWeight:'600', marginBottom:25},
    resultsTitle: {fontSize:18*scale, fontWeight:'bold', color:t.textPrimary, marginBottom:15},
    resCard: {backgroundColor:t.cardBg, borderRadius:16, padding:18, marginBottom:12, borderWidth:2, borderColor:t.cardBorder, flexDirection:'row', justifyContent:'space-between', alignItems:'center'},
    resName: {fontSize:16*scale, color:t.textPrimary, fontWeight:'600', textAlign:'right'},
    resValue: {fontSize:18*scale, fontWeight:'bold', color:t.primary, textAlign:'left'},
    currModalItem: {flexDirection:'row', alignItems:'center', backgroundColor:t.headerBg, padding:18, borderRadius:15, marginBottom:10, borderWidth:1, borderColor:t.cardBorder},
    currModalFlag: {fontSize:32, marginRight:15},
    currModalText: {fontSize:18*scale, color:t.textPrimary, fontWeight:'600'},
    settingsMenuItem: {flexDirection:'row', justifyContent:isRTL?'flex-end':'flex-start', alignItems:'center', backgroundColor:t.headerBg, padding:20, borderRadius:15, marginBottom:12, borderWidth:1, borderColor:t.cardBorder},
    settingsMenuText: {fontSize:17*scale, color:t.textPrimary, fontWeight:'600', textAlign:isRTL?'right':'left'},
    choiceList: {padding:20},
    choiceItem: {flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:t.headerBg, padding:20, borderRadius:15, marginBottom:12, borderWidth:2, borderColor:t.cardBorder},
    choiceItemSel: {backgroundColor:t.cardBorder, borderColor:t.primary},
    choiceText: {fontSize:18*scale, color:t.textPrimary, fontWeight:'600', textAlign:isRTL?'right':'left', flex:1},
    themeItem: {flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:18, borderRadius:15, marginBottom:10, borderWidth:2},
    themeItemText: {fontSize:17*scale, fontWeight:'600', textAlign:isRTL?'right':'left', flex:1},
    backBtn: {padding:5},
  });
}
