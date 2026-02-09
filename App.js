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
  'BTC': { name: 'بیت‌کوین', nameEn: 'Bitcoin', flag: '', cat: 'crypto', unit: 'دلار', unitEn: 'USD' },
  'ETH': { name: 'اتریوم', nameEn: 'Ethereum', flag: '', cat: 'crypto', unit: 'دلار', unitEn: 'USD' },
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
  const isRTL = language === 'fa';

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

  const s = createStyles(theme, fontScale, isRTL);

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
        <ScrollView style={s.convScreen} contentContainerStyle={{paddingBottom: 150}}>
          <TouchableOpacity style={s.currBox} onPress={() => setCurrencyModal(true)}>
            <Text style={s.currFlag}>{fromInfo.flag}</Text>
            <Text style={s.currText}>{isRTL ? fromInfo
