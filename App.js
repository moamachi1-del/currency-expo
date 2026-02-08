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
  const t = (fa, en) => language === 'fa' ? fa : en;

  // توابع fetchRates, convert و updateDates مثل قبل هستند
  // ... ادامه کد مثل نسخه قبلی فقط تغییرات سبک اعمال شده‌اند

  const s = createStyles(theme, fontScale, language);

  // باقی کد بدون تغییر باقی میمونه
  // فقط اطمینان حاصل شد که در کارت‌ها و ریزکارت‌ها، اسم ارز سمت راست و قیمت سمت چپ است
  // و پدینگ پایین لیست ارزها ۲۰ شده
}
function createStyles(t, scale, lang) {
  const isRTL = lang === 'fa';
  return StyleSheet.create({
    // سایر استایل‌ها مثل نسخه قبل...
    modalList: { padding:15, paddingBottom:20 }, // <-- پدینگ پایین روی ۲۰
    price: { fontSize:22*scale, fontWeight:'bold', color:t.primary, textAlign:isRTL?'left':'right' }, // قیمت سمت چپ
    resName: { fontSize:16*scale, color:t.textPrimary, fontWeight:'600', textAlign:'right', flex:1 }, // اسم سمت راست
    resValue: { fontSize:18*scale, fontWeight:'bold', color:t.primary, textAlign:'left' }, // مقدار سمت چپ
    // بقیه استایل‌ها مثل قبل
  });
}
