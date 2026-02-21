import React, { useState, useEffect, useMemo } from 'react';
import {
  StyleSheet, Text, View, ScrollView, TouchableOpacity, ActivityIndicator,
  Modal, TextInput, Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const FETCH_TIMEOUT = 10000;
const SERVER_URL    = 'https://arzb1234.ir/api/rates';
const API_TOKEN     = 'arzban_secure_2026';

const THEMES = {
  green:  { name: 'سبز',    nameEn: 'Green',  bg: '#F0F9F6', headerBg: '#E8F8F5', primary: '#00CBA9', cardBg: '#FFFFFF', cardBorder: '#D4F1E8', textPrimary: '#1A5F4F', textSecondary: '#5B7A6F' },
  blue:   { name: 'آبی',    nameEn: 'Blue',   bg: '#F0F8FF', headerBg: '#E3F2FD', primary: '#2196F3', cardBg: '#FFFFFF', cardBorder: '#BBDEFB', textPrimary: '#0D47A1', textSecondary: '#1976D2' },
  purple: { name: 'بنفش',   nameEn: 'Purple', bg: '#F8F4FF', headerBg: '#F3E5F5', primary: '#9C27B0', cardBg: '#FFFFFF', cardBorder: '#E1BEE7', textPrimary: '#4A148C', textSecondary: '#7B1FA2' },
  orange: { name: 'نارنجی', nameEn: 'Orange', bg: '#FFF8F0', headerBg: '#FFF3E0', primary: '#FF9800', cardBg: '#FFFFFF', cardBorder: '#FFE0B2', textPrimary: '#E65100', textSecondary: '#F57C00' },
  pink:   { name: 'صورتی',  nameEn: 'Pink',   bg: '#FFF0F8', headerBg: '#FCE4EC', primary: '#E91E63', cardBg: '#FFFFFF', cardBorder: '#F8BBD0', textPrimary: '#880E4F', textSecondary: '#C2185B' },
  gold:   { name: 'طلایی',  nameEn: 'Gold',   bg: '#1A1A1A', headerBg: '#2C2C2C', primary: '#FFD700', cardBg: '#2C2C2C', cardBorder: '#444444', textPrimary: '#FFD700', textSecondary: '#FFA500' },
  neon:   { name: 'نئون',   nameEn: 'Neon',   bg: '#0A1628', headerBg: '#1A2742', primary: '#00FFC6', cardBg: '#1A2742', cardBorder: '#2C3E50', textPrimary: '#00FFC6', textSecondary: '#00D9FF' },
};

const FONT_SIZES = {
  small:  { name: 'کوچک',  nameEn: 'Small',  scale: 0.85 },
  medium: { name: 'متوسط', nameEn: 'Medium', scale: 1    },
  large:  { name: 'بزرگ',  nameEn: 'Large',  scale: 1.15 },
};

const CURRENCIES = {
  'TOMAN':           { name: 'تومان ایران',   nameEn: 'Iranian Toman',     flag: '🇮🇷', cat: 'currency' },
  'USDT_IRT':        { name: 'تتر',           nameEn: 'Tether',            flag: '🇺🇸', cat: 'currency' },
  'USD':             { name: 'دلار',          nameEn: 'US Dollar',         flag: '🇺🇸', cat: 'currency' },
  'EUR':             { name: 'یورو',          nameEn: 'Euro',              flag: '🇪🇺', cat: 'currency' },
  'GBP':             { name: 'پوند',          nameEn: 'Pound',             flag: '🇬🇧', cat: 'currency' },
  'TRY':             { name: 'لیر ترکیه',     nameEn: 'Turkish Lira',      flag: '🇹🇷', cat: 'currency' },
  'AED':             { name: 'درهم',          nameEn: 'Dirham',            flag: '🇦🇪', cat: 'currency' },
  'SAR':             { name: 'ریال سعودی',    nameEn: 'Saudi Riyal',       flag: '🇸🇦', cat: 'currency' },
  'CHF':             { name: 'فرانک',         nameEn: 'Swiss Franc',       flag: '🇨🇭', cat: 'currency' },
  'CNY':             { name: 'یوان',          nameEn: 'Yuan',              flag: '🇨🇳', cat: 'currency' },
  'JPY':             { name: 'ین',            nameEn: 'Yen',               flag: '🇯🇵', cat: 'currency' },
  'KRW':             { name: 'وون',           nameEn: 'Won',               flag: '🇰🇷', cat: 'currency' },
  'INR':             { name: 'روپیه هند',     nameEn: 'Indian Rupee',      flag: '🇮🇳', cat: 'currency' },
  'PKR':             { name: 'روپیه پاکستان', nameEn: 'Pakistani Rupee',   flag: '🇵🇰', cat: 'currency' },
  'THB':             { name: 'بات',           nameEn: 'Baht',              flag: '🇹🇭', cat: 'currency' },
  'RUB':             { name: 'روبل',          nameEn: 'Ruble',             flag: '🇷🇺', cat: 'currency' },
  'CAD':             { name: 'دلار کانادا',   nameEn: 'Canadian Dollar',   flag: '🇨🇦', cat: 'currency' },
  'AUD':             { name: 'دلار استرالیا', nameEn: 'Australian Dollar', flag: '🇦🇺', cat: 'currency' },
  'IR_GOLD_18K':     { name: 'طلا ۱۸',        nameEn: 'Gold 18K',          flag: '',    cat: 'gold'     },
  'IR_GOLD_24K':     { name: 'طلا ۲۴',        nameEn: 'Gold 24K',          flag: '',    cat: 'gold'     },
  'IR_COIN_EMAMI':   { name: 'سکه امامی',     nameEn: 'Emami Coin',        flag: '',    cat: 'gold'     },
  'IR_COIN_BAHAR':   { name: 'سکه بهار',      nameEn: 'Bahar Coin',        flag: '',    cat: 'gold'     },
  'IR_COIN_HALF':    { name: 'نیم سکه',       nameEn: 'Half Coin',         flag: '',    cat: 'gold'     },
  'IR_COIN_QUARTER': { name: 'ربع سکه',       nameEn: 'Quarter Coin',      flag: '',    cat: 'gold'     },
  'BTC':             { name: 'بیت‌کوین',      nameEn: 'Bitcoin',           flag: '',    cat: 'crypto'   },
  'ETH':             { name: 'اتریوم',        nameEn: 'Ethereum',          flag: '',    cat: 'crypto'   },
};

const fmt = (num, dec = 0) =>
  num.toLocaleString('en-US', { maximumFractionDigits: dec, minimumFractionDigits: 0 });

const fmtDisplay = (raw) => {
  const n = String(raw).replace(/,/g, '');
  if (!n || isNaN(n)) return raw;
  return Number(n).toLocaleString('en-US');
};

export default function App() {
  // ─── State اصلی ───
  const [rates, setRates]                   = useState({ TOMAN: 1 });
  const [allItems, setAllItems]             = useState([]);
  const [converterItems, setConverterItems] = useState(['TOMAN']);
  const [loading, setLoading]               = useState(true);
  const [error, setError]                   = useState(null);
  const [lastUpdate, setLastUpdate]         = useState('');
  const [persianDate, setPersianDate]       = useState('');
  const [gregorianDate, setGregorianDate]   = useState('');
  const [currentTheme, setCurrentTheme]     = useState('green');
  const [fontSize, setFontSize]             = useState('medium');
  const [language, setLanguage]             = useState('fa');
  const [initialized, setInitialized]       = useState(false);

  // ─── State صفحه اصلی ───
  const [selectedItems, setSelectedItems]   = useState(['USDT_IRT','USD','EUR','IR_GOLD_18K','IR_COIN_EMAMI','BTC']);
  const [settingsVisible, setSettingsVisible]     = useState(false);
  const [settingsSubMenu, setSettingsSubMenu]     = useState(null);

  // ─── State مبدل ───
  const [converterVisible, setConverterVisible]   = useState(false);
  const [fromCurrency, setFromCurrency]           = useState('TOMAN');
  const [toCurrency, setToCurrency]               = useState('USD');
  const [fromRaw, setFromRaw]                     = useState('1000000');
  const [pickingFor, setPickingFor]               = useState(null); // 'from' | 'to'
  const [currSearch, setCurrSearch]               = useState('');

  // ─── State کیف پول ───
  const [walletVisible, setWalletVisible]         = useState(false);
  const [walletItems, setWalletItems]             = useState([]); // [{sym, amount}]
  const [walletAddVisible, setWalletAddVisible]   = useState(false);
  const [walletPickSym, setWalletPickSym]         = useState('USD');
  const [walletPickSearch, setWalletPickSearch]   = useState('');
  const [walletPickAmt, setWalletPickAmt]         = useState('');
  const [walletEditIdx, setWalletEditIdx]         = useState(null); // ویرایش یا null

  const theme     = THEMES[currentTheme];
  const fontScale = FONT_SIZES[fontSize].scale;
  const t = (fa, en) => language === 'fa' ? fa : en;
  const s = useMemo(() => createStyles(theme, fontScale, language), [currentTheme, fontSize, language]);

  // ─── تاریخ شمسی ───
  const toJalali = (gDate) => {
    let gy = gDate.getFullYear(), gm = gDate.getMonth()+1, gd = gDate.getDate();
    const g_d_m = [0,31,59,90,120,151,181,212,243,273,304,334];
    let jy = gy <= 1600 ? 0 : 979;
    gy -= gy <= 1600 ? 621 : 1600;
    const gy2 = gm > 2 ? gy+1 : gy;
    let days = 365*gy + Math.floor((gy2+3)/4) - Math.floor((gy2+99)/100) + Math.floor((gy2+399)/400) - 80 + gd + g_d_m[gm-1];
    jy += 33*Math.floor(days/12053); days %= 12053;
    jy += 4*Math.floor(days/1461);   days %= 1461;
    if (days > 365) { jy += Math.floor((days-1)/365); days = (days-1)%365; }
    const jm = days < 186 ? 1+Math.floor(days/31) : 7+Math.floor((days-186)/30);
    const jd = 1+(days < 186 ? days%31 : (days-186)%30);
    const wd = ['یکشنبه','دوشنبه','سه‌شنبه','چهارشنبه','پنجشنبه','جمعه','شنبه'];
    const mn = ['فروردین','اردیبهشت','خرداد','تیر','مرداد','شهریور','مهر','آبان','آذر','دی','بهمن','اسفند'];
    return `${wd[gDate.getDay()]} ${jd} ${mn[jm-1]} ${jy}`;
  };

  const updateDates = () => {
    const now = new Date();
    setPersianDate(toJalali(now));
    const mn = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    setGregorianDate(`${now.getDate()} ${mn[now.getMonth()]} ${now.getFullYear()}`);
  };

  // ─── Fetch با توکن + timeout ───
  const fetchRates = async () => {
    setError(null);
    const controller = new AbortController();
    const tid = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    try {
      const res = await fetch(SERVER_URL, {
        headers: {
          'Accept':       'application/json',
          'User-Agent':   'ArzbanApp/1.0',
          'x-app-token':  API_TOKEN,
        },
        signal: controller.signal,
      });
      if (!res.ok) throw new Error(`server_${res.status}`);
      const data = await res.json();

      const newRates = { TOMAN: 1 };
      const items = [], convItems = ['TOMAN'];
      const allowed = Object.keys(CURRENCIES).filter(k => k !== 'TOMAN');
      let usdRate = 1;

      [data.gold, data.currency, data.cryptocurrency].forEach(arr => {
        if (!Array.isArray(arr)) return;
        arr.forEach(item => { if (item.symbol === 'USD' && item.price) usdRate = parseFloat(item.price); });
      });
      [data.gold, data.currency, data.cryptocurrency].forEach(arr => {
        if (!Array.isArray(arr)) return;
        arr.forEach(item => {
          if (item.symbol && item.price && allowed.includes(item.symbol)) {
            newRates[item.symbol] = (item.symbol === 'BTC' || item.symbol === 'ETH')
              ? parseFloat(item.price) * usdRate
              : parseFloat(item.price);
            items.push(item.symbol);
            convItems.push(item.symbol);
          }
        });
      });

      setRates(newRates);
      setAllItems(items);
      setConverterItems(convItems);
      updateDates();
      const now  = new Date();
      const time = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
      setLastUpdate(time);
      await AsyncStorage.multiSet([['@cache', JSON.stringify(newRates)], ['@update', time]]);
    } catch (err) {
      if (err.name === 'AbortError')               setError(t('سرور پاسخ نداد','Server timeout'));
      else if (err.message?.startsWith('server_')) setError(t(`خطای سرور: ${err.message.replace('server_','')}`,`Server error: ${err.message.replace('server_','')}`));
      else                                          setError(t('خطا در اتصال به اینترنت','No internet connection'));
    } finally {
      clearTimeout(tid);
      setLoading(false);
    }
  };

  // ─── بارگذاری اولیه ───
  useEffect(() => {
    (async () => {
      try {
        const [[,cache],[,upd],[,sel],[,thm],[,fsz],[,lng],[,wlt]] =
          await AsyncStorage.multiGet(['@cache','@update','@selected','@theme','@fontsize','@lang','@wallet']);
        if (cache) setRates({...JSON.parse(cache), TOMAN:1});
        if (upd)   setLastUpdate(upd);
        if (sel)   setSelectedItems(JSON.parse(sel));
        if (thm)   setCurrentTheme(thm);
        if (fsz)   setFontSize(fsz);
        if (lng)   setLanguage(lng);
        if (wlt)   setWalletItems(JSON.parse(wlt));
        updateDates();
      } catch(e) { console.log('storage error', e); }
      setInitialized(true);
      setLoading(false);
      fetchRates();
    })();
    const iv = setInterval(fetchRates, 5*60*1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    AsyncStorage.setItem('@selected', JSON.stringify(selectedItems)).catch(()=>{});
  }, [selectedItems]);

  useEffect(() => {
    if (!initialized) return;
    AsyncStorage.setItem('@wallet', JSON.stringify(walletItems)).catch(()=>{});
  }, [walletItems]);

  const getInfo = (sym) => CURRENCIES[sym] || { name: sym, nameEn: sym, flag: '🌍', cat: 'other' };

  // ─── محاسبه مبدل ───
  const calcConvert = (fromSym, toSym, rawVal) => {
    const amt      = parseFloat(String(rawVal).replace(/,/g,'')) || 0;
    const fromRate = rates[fromSym] || 1;
    const toRate   = rates[toSym]   || 1;
    if (amt <= 0) return '---';
    const r = (amt * fromRate) / toRate;
    if (toSym === 'BTC' || toSym === 'ETH') return fmt(r, 8);
    if (toSym.includes('GOLD'))             return fmt(r, 3);
    if (toSym.includes('COIN'))             return fmt(r, 4);
    return fmt(r, 2);
  };

  const toResult = calcConvert(fromCurrency, toCurrency, fromRaw);

  // ─── ذخیره تنظیمات ───
  const saveTheme    = async (k) => { setCurrentTheme(k); await AsyncStorage.setItem('@theme', k);    setSettingsSubMenu(null); setSettingsVisible(false); };
  const saveFontSize = async (f) => { setFontSize(f);     await AsyncStorage.setItem('@fontsize', f); setSettingsSubMenu(null); setSettingsVisible(false); };
  const saveLanguage = async (l) => { setLanguage(l);     await AsyncStorage.setItem('@lang', l);     setSettingsSubMenu(null); setSettingsVisible(false); };

  // ─── کیف پول: ذخیره دارایی ───
  const saveWalletItem = () => {
    const amt = parseFloat(String(walletPickAmt).replace(/,/g,''));
    if (!amt || amt <= 0) { Alert.alert(t('خطا','Error'), t('مقدار را وارد کنید','Enter amount')); return; }
    if (walletEditIdx !== null) {
      const updated = [...walletItems];
      updated[walletEditIdx] = { sym: walletPickSym, amount: amt };
      setWalletItems(updated);
    } else {
      const exists = walletItems.findIndex(w => w.sym === walletPickSym);
      if (exists >= 0) {
        const updated = [...walletItems];
        updated[exists].amount += amt;
        setWalletItems(updated);
      } else {
        setWalletItems([...walletItems, { sym: walletPickSym, amount: amt }]);
      }
    }
    setWalletAddVisible(false);
    setWalletPickAmt('');
    setWalletEditIdx(null);
  };

  const deleteWalletItem = (idx) => {
    Alert.alert(
      t('حذف','Delete'),
      t('این دارایی حذف شود؟','Remove this asset?'),
      [
        { text: t('لغو','Cancel'), style: 'cancel' },
        { text: t('حذف','Delete'), style: 'destructive', onPress: () => setWalletItems(walletItems.filter((_,i)=>i!==idx)) },
      ]
    );
  };

  const walletTotalToman = walletItems.reduce((sum, w) => {
    const rate = rates[w.sym] || 1;
    return sum + w.amount * rate;
  }, 0);

  // ─── لیست ارزهای قابل انتخاب در picker ───
  const pickerList = converterItems.filter(sym => {
    const info = getInfo(sym);
    if (!currSearch) return true;
    const q = currSearch.toLowerCase();
    return info.name.includes(q) || info.nameEn.toLowerCase().includes(q);
  });

  const walletPickerList = Object.keys(CURRENCIES).filter(sym => {
    if (sym === 'TOMAN') return false;
    const info = getInfo(sym);
    if (!walletPickSearch) return true;
    const q = walletPickSearch.toLowerCase();
    return info.name.includes(q) || info.nameEn.toLowerCase().includes(q);
  });

  // ════════════════════════════════════════════════════════════
  // converter visible
  // ════════════════════════════════════════════════════════════
  if (converterVisible) {
    const fromInfo = getInfo(fromCurrency);
    const toInfo   = getInfo(toCurrency);

    const listItems = converterItems.filter(sym =>
      sym !== fromCurrency && sym !== toCurrency
    );

    return (
      <SafeAreaProvider>
      <SafeAreaView style={s.container}>
        <StatusBar style={currentTheme==='gold'||currentTheme==='neon'?'light':'dark'} />
        <View style={s.convHeader}>
          <TouchableOpacity onPress={()=>{ setConverterVisible(false); setCurrSearch(''); }} style={s.backBtn}>
            <Text style={s.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={s.convTitle}>{t('مبدل ارز','Converter')}</Text>
          <View style={{width:40}} />
        </View>

        <ScrollView style={s.convScreen} contentContainerStyle={{paddingBottom:100}} keyboardShouldPersistTaps="handled">

          {/* ─── دو باکس + swap ─── */}
          <View style={s.swapContainer}>
            {/* باکس بالا — مبدأ */}
            <View style={s.swapBox}>
              <TouchableOpacity style={s.swapCurrBtn} onPress={()=>{ setPickingFor('from'); setCurrSearch(''); }}>
                <Text style={s.swapFlag}>{fromInfo.flag}</Text>
                <Text style={s.swapCurrName} numberOfLines={1}>{language==='fa'?fromInfo.name:fromInfo.nameEn}</Text>
                <Text style={s.swapChevron}>▾</Text>
              </TouchableOpacity>
              <TextInput
                style={s.swapInput}
                value={fmtDisplay(fromRaw)}
                onChangeText={(txt)=>{
                  const clean = txt.replace(/,/g,'');
                  if (clean===''||/^\d*\.?\d*$/.test(clean)) setFromRaw(clean);
                }}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            {/* دکمه swap */}
            <TouchableOpacity style={s.swapBtn} onPress={()=>{
              setFromCurrency(toCurrency);
              setToCurrency(fromCurrency);
            }}>
              <Text style={s.swapBtnIcon}>⇅</Text>
            </TouchableOpacity>

            {/* باکس پایین — مقصد */}
            <View style={s.swapBox}>
              <TouchableOpacity style={s.swapCurrBtn} onPress={()=>{ setPickingFor('to'); setCurrSearch(''); }}>
                <Text style={s.swapFlag}>{toInfo.flag}</Text>
                <Text style={s.swapCurrName} numberOfLines={1}>{language==='fa'?toInfo.name:toInfo.nameEn}</Text>
                <Text style={s.swapChevron}>▾</Text>
              </TouchableOpacity>
              <Text style={s.swapResult}>{toResult}</Text>
            </View>
          </View>

          {/* ─── لیست بقیه ارزها ─── */}
          <Text style={s.resultsTitle}>{t('سایر ارزها:','Other currencies:')}</Text>
          {listItems.map(sym => {
            const info = getInfo(sym);
            const res  = calcConvert(fromCurrency, sym, fromRaw);
            return (
              <View key={sym} style={s.resCard}>
                <View style={s.resCardLeft}>
                  <Text style={s.resFlag}>{info.flag}</Text>
                  <Text style={s.resName}>{language==='fa'?info.name:info.nameEn}</Text>
                </View>
                <Text style={s.resValue}>{res}</Text>
              </View>
            );
          })}
        </ScrollView>

        {/* مدال انتخاب ارز */}
        <Modal animationType="slide" transparent visible={pickingFor!==null} onRequestClose={()=>setPickingFor(null)}>
          <View style={s.modalOverlay}>
            <View style={s.modalContent}>
              <View style={s.modalHeader}>
                <Text style={s.modalTitle}>{t('انتخاب ارز','Select Currency')}</Text>
                <TouchableOpacity onPress={()=>{ setPickingFor(null); setCurrSearch(''); }}><Text style={s.closeBtn}>✕</Text></TouchableOpacity>
              </View>
              <View style={[s.searchBox,{marginHorizontal:15,marginTop:10}]}>
                <Text style={s.searchIcon}>🔍</Text>
                <TextInput style={s.searchInput} value={currSearch} onChangeText={setCurrSearch}
                  placeholder={t('جستجو...','Search...')} placeholderTextColor="#999" />
                {currSearch.length>0 && <TouchableOpacity onPress={()=>setCurrSearch('')}><Text style={s.searchClear}>✕</Text></TouchableOpacity>}
              </View>
              <ScrollView style={s.modalList}>
                {pickerList.map(sym => {
                  const info = getInfo(sym);
                  return (
                    <TouchableOpacity key={sym} style={s.currModalItem} onPress={()=>{
                      if (pickingFor==='from') setFromCurrency(sym);
                      else setToCurrency(sym);
                      setPickingFor(null); setCurrSearch('');
                    }}>
                      <Text style={s.currModalFlag}>{info.flag}</Text>
                      <Text style={s.currModalText}>{language==='fa'?info.name:info.nameEn}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // ════════════════════════════════════════════════════════════
  // صفحه کیف پول
  // ════════════════════════════════════════════════════════════
  if (walletVisible) {
    return (
      <SafeAreaProvider>
      <SafeAreaView style={s.container}>
        <StatusBar style={currentTheme==='gold'||currentTheme==='neon'?'light':'dark'} />
        <View style={s.convHeader}>
          <TouchableOpacity onPress={()=>setWalletVisible(false)} style={s.backBtn}>
            <Text style={s.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={s.convTitle}>{t('کیف پول','Wallet')}</Text>
          <TouchableOpacity style={s.addBtn} onPress={()=>{ setWalletEditIdx(null); setWalletPickAmt(''); setWalletPickSym('USD'); setWalletAddVisible(true); }}>
            <Text style={s.addBtnText}>+</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={s.convScreen} contentContainerStyle={{paddingBottom:100}}>
          {/* کارت جمع کل */}
          <View style={s.totalCard}>
            <Text style={s.totalLabel}>{t('ارزش کل دارایی','Total Portfolio Value')}</Text>
            <Text style={s.totalValue}>{fmt(walletTotalToman)} {t('تومان','Toman')}</Text>
          </View>

          {walletItems.length === 0 ? (
            <View style={s.emptyWallet}>
              <Text style={s.emptyWalletIcon}>🏦</Text>
              <Text style={s.emptyWalletText}>{t('هنوز دارایی ثبت نکردی','No assets yet')}</Text>
            </View>
          ) : (
            walletItems.map((w, idx) => {
              const info    = getInfo(w.sym);
              const rate    = rates[w.sym] || 1;
              const valToman = w.amount * rate;
              return (
                <View key={idx} style={s.walletCard}>
                  <View style={s.walletCardLeft}>
                    <Text style={s.walletFlag}>{info.flag}</Text>
                    <View>
                      <Text style={s.walletName}>{language==='fa'?info.name:info.nameEn}</Text>
                      <Text style={s.walletAmt}>{fmt(w.amount, 6).replace(/\.?0+$/, '')} {language==='fa'?info.name:info.nameEn}</Text>
                    </View>
                  </View>
                  <View style={s.walletCardRight}>
                    <Text style={s.walletValue}>{fmt(valToman)} {t('ت','T')}</Text>
                    <View style={s.walletActions}>
                      <TouchableOpacity onPress={()=>{
                        setWalletEditIdx(idx);
                        setWalletPickSym(w.sym);
                        setWalletPickAmt(String(w.amount));
                        setWalletAddVisible(true);
                      }}>
                        <Text style={s.walletEdit}>✏️</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={()=>deleteWalletItem(idx)}>
                        <Text style={s.walletDelete}>🗑️</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>

        {/* مدال افزودن/ویرایش دارایی */}
        <Modal animationType="slide" transparent visible={walletAddVisible} onRequestClose={()=>setWalletAddVisible(false)}>
          <View style={s.modalOverlay}>
            <View style={s.modalContent}>
              <View style={s.modalHeader}>
                <Text style={s.modalTitle}>{walletEditIdx!==null ? t('ویرایش دارایی','Edit Asset') : t('افزودن دارایی','Add Asset')}</Text>
                <TouchableOpacity onPress={()=>setWalletAddVisible(false)}><Text style={s.closeBtn}>✕</Text></TouchableOpacity>
              </View>
              <View style={{padding:20}}>
                {/* انتخاب ارز */}
                <Text style={s.walletInputLabel}>{t('نوع دارایی:','Asset type:')}</Text>
                <View style={[s.searchBox,{marginBottom:12}]}>
                  <Text style={s.searchIcon}>🔍</Text>
                  <TextInput style={s.searchInput} value={walletPickSearch} onChangeText={setWalletPickSearch}
                    placeholder={t('جستجوی ارز...','Search...')} placeholderTextColor="#999" />
                  {walletPickSearch.length>0 && <TouchableOpacity onPress={()=>setWalletPickSearch('')}><Text style={s.searchClear}>✕</Text></TouchableOpacity>}
                </View>
                <ScrollView style={{maxHeight:160, marginBottom:16}} showsVerticalScrollIndicator={false}>
                  {walletPickerList.map(sym => {
                    const info = getInfo(sym);
                    const sel  = walletPickSym === sym;
                    return (
                      <TouchableOpacity key={sym} style={[s.walletPickItem, sel && s.walletPickItemSel]} onPress={()=>setWalletPickSym(sym)}>
                        <Text style={s.currModalFlag}>{info.flag}</Text>
                        <Text style={[s.currModalText, sel && {color: theme.primary}]}>{language==='fa'?info.name:info.nameEn}</Text>
                        {sel && <Text style={s.check}>✓</Text>}
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                {/* مقدار */}
                <Text style={s.walletInputLabel}>{t('مقدار:','Amount:')}</Text>
                <TextInput
                  style={s.input}
                  value={walletPickAmt}
                  onChangeText={setWalletPickAmt}
                  keyboardType="numeric"
                  placeholder={t('مثال: 0.5','e.g. 0.5')}
                  placeholderTextColor="#999"
                />

                <TouchableOpacity style={s.doneBtn} onPress={saveWalletItem}>
                  <Text style={s.doneBtnText}>{t('ذخیره','Save')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  // ════════════════════════════════════════════════════════════
  // صفحه اصلی
  // ════════════════════════════════════════════════════════════
  return (
    <SafeAreaProvider>
    <SafeAreaView style={s.container}>
      <StatusBar style={currentTheme==='gold'||currentTheme==='neon'?'light':'dark'} />
      <View style={s.header}>
        <TouchableOpacity style={s.settingsTopBtn} onPress={()=>setSettingsVisible(true)}>
          <View style={s.iconCircle}><Text style={s.topBtnIcon}>≡</Text></View>
        </TouchableOpacity>
        <View style={s.dateContainer}>
          <Text style={s.datePersian}>{persianDate}</Text>
          <Text style={s.dateGregorian}>{gregorianDate}</Text>
          <Text style={s.lastUpdate}>{t('آخرین بروزرسانی:','Last Update:')} {lastUpdate}</Text>
        </View>
      </View>

      {/* دکمه کیف پول (جای چرتکه قبلی) */}
      <TouchableOpacity style={s.calcBtn} onPress={()=>setWalletVisible(true)}>
        <Text style={s.calcIcon}>🏦</Text>
      </TouchableOpacity>

      {/* دکمه مبدل */}
      <TouchableOpacity style={s.converterBtn} onPress={()=>setConverterVisible(true)}>
        <Text style={s.calcIcon}>⚖️</Text>
      </TouchableOpacity>

      {loading ? (
        <View style={s.center}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={s.loadingText}>{t('در حال بارگذاری...','Loading...')}</Text>
        </View>
      ) : error ? (
        <View style={s.center}>
          <Text style={s.errorIcon}>⚠️</Text>
          <Text style={s.error}>{error}</Text>
          <TouchableOpacity style={s.retryBtn} onPress={fetchRates}>
            <Text style={s.retryBtnText}>{t('تلاش مجدد','Retry')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={s.list} showsVerticalScrollIndicator={false}>
          {selectedItems.map(sym => {
            const info = getInfo(sym);
            const val  = rates[sym];
            return (
              <View key={sym} style={s.card}>
                <View style={s.cardHeader}>
                  <Text style={s.flag}>{info.flag}</Text>
                  <Text style={s.name}>{language==='fa'?info.name:info.nameEn}</Text>
                </View>
                <Text style={s.price}>{val ? fmt(val) : '...'}</Text>
              </View>
            );
          })}
          <View style={s.footer}>
            <Text style={s.footerText}>{t('بروزرسانی خودکار هر ۵ دقیقه','Auto-refresh every 5 minutes')}</Text>
          </View>
        </ScrollView>
      )}

      {/* ─── Settings Modal ─── */}
      <Modal animationType="slide" transparent visible={settingsVisible} onRequestClose={()=>setSettingsVisible(false)}>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{t('تنظیمات','Settings')}</Text>
              <TouchableOpacity onPress={()=>setSettingsVisible(false)}><Text style={s.closeBtn}>✕</Text></TouchableOpacity>
            </View>
            <ScrollView style={s.modalList}>
              <TouchableOpacity style={s.settingsMenuItem} onPress={()=>setSettingsSubMenu('currencies')}>
                <Text style={s.settingsMenuText}>{t('لیست ارزها','Currency List')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.settingsMenuItem} onPress={()=>setSettingsSubMenu('fontsize')}>
                <Text style={s.settingsMenuText}>{t('اندازه قلم','Font Size')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.settingsMenuItem} onPress={()=>setSettingsSubMenu('language')}>
                <Text style={s.settingsMenuText}>{t('انتخاب زبان','Language')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.settingsMenuItem} onPress={()=>setSettingsSubMenu('theme')}>
                <Text style={s.settingsMenuText}>{t('رنگ‌بندی','Colors')}</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ─── Currency List ─── */}
      <Modal animationType="slide" transparent visible={settingsSubMenu==='currencies'} onRequestClose={()=>setSettingsSubMenu(null)}>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <TouchableOpacity onPress={()=>setSettingsSubMenu(null)}><Text style={s.backIcon}>←</Text></TouchableOpacity>
              <Text style={s.modalTitle}>{t('لیست ارزها','Currency List')}</Text>
              <View style={{width:40}} />
            </View>
            <ScrollView style={s.modalList}>
              {['gold','currency','crypto'].map(cat => {
                const items = allItems.filter(sym => getInfo(sym).cat===cat);
                if (!items.length) return null;
                return (
                  <View key={cat}>
                    <Text style={s.catTitle}>{cat==='gold'?t('طلا و سکه','Gold & Coins'):cat==='crypto'?t('کریپتو','Crypto'):t('ارزها','Currencies')}</Text>
                    {items.map(sym => {
                      const info = getInfo(sym);
                      const sel  = selectedItems.includes(sym);
                      return (
                        <TouchableOpacity key={sym} style={[s.modalItem, sel&&s.modalItemSel]}
                          onPress={()=>setSelectedItems(sel ? selectedItems.filter(x=>x!==sym) : [...selectedItems,sym])}>
                          <Text style={s.modalItemFlag}>{info.flag}</Text>
                          <Text style={s.modalItemText}>{language==='fa'?info.name:info.nameEn}</Text>
                          {sel && <Text style={s.check}>✓</Text>}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                );
              })}
            </ScrollView>
            <TouchableOpacity style={s.doneBtn} onPress={()=>setSettingsSubMenu(null)}>
              <Text style={s.doneBtnText}>{t('تایید','Done')} ({selectedItems.length})</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ─── Font Size ─── */}
      <Modal animationType="slide" transparent visible={settingsSubMenu==='fontsize'} onRequestClose={()=>setSettingsSubMenu(null)}>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <TouchableOpacity onPress={()=>setSettingsSubMenu(null)}><Text style={s.backIcon}>←</Text></TouchableOpacity>
              <Text style={s.modalTitle}>{t('اندازه قلم','Font Size')}</Text>
              <View style={{width:40}} />
            </View>
            <View style={s.choiceList}>
              {Object.keys(FONT_SIZES).map(k=>(
                <TouchableOpacity key={k} style={[s.choiceItem, fontSize===k&&s.choiceItemSel]} onPress={()=>saveFontSize(k)}>
                  <Text style={s.choiceText}>{language==='fa'?FONT_SIZES[k].name:FONT_SIZES[k].nameEn}</Text>
                  {fontSize===k && <Text style={s.check}>✓</Text>}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* ─── Language ─── */}
      <Modal animationType="slide" transparent visible={settingsSubMenu==='language'} onRequestClose={()=>setSettingsSubMenu(null)}>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <TouchableOpacity onPress={()=>setSettingsSubMenu(null)}><Text style={s.backIcon}>←</Text></TouchableOpacity>
              <Text style={s.modalTitle}>{t('انتخاب زبان','Language')}</Text>
              <View style={{width:40}} />
            </View>
            <View style={s.choiceList}>
              <TouchableOpacity style={[s.choiceItem, language==='fa'&&s.choiceItemSel]} onPress={()=>saveLanguage('fa')}>
                <Text style={s.choiceText}>فارسی</Text>
                {language==='fa'&&<Text style={s.check}>✓</Text>}
              </TouchableOpacity>
              <TouchableOpacity style={[s.choiceItem, language==='en'&&s.choiceItemSel]} onPress={()=>saveLanguage('en')}>
                <Text style={s.choiceText}>English</Text>
                {language==='en'&&<Text style={s.check}>✓</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ─── Theme ─── */}
      <Modal animationType="slide" transparent visible={settingsSubMenu==='theme'} onRequestClose={()=>setSettingsSubMenu(null)}>
        <View style={s.modalOverlay}>
          <View style={s.modalContent}>
            <View style={s.modalHeader}>
              <TouchableOpacity onPress={()=>setSettingsSubMenu(null)}><Text style={s.backIcon}>←</Text></TouchableOpacity>
              <Text style={s.modalTitle}>{t('رنگ‌بندی','Colors')}</Text>
              <View style={{width:40}} />
            </View>
            <ScrollView style={s.modalList}>
              {Object.keys(THEMES).map(k=>{
                const tm = THEMES[k];
                return (
                  <TouchableOpacity key={k} style={[s.themeItem,{backgroundColor:tm.headerBg,borderColor:tm.primary}]} onPress={()=>saveTheme(k)}>
                    <Text style={[s.themeItemText,{color:tm.textPrimary}]}>{language==='fa'?tm.name:tm.nameEn}</Text>
                    {currentTheme===k&&<Text style={[s.check,{color:tm.primary}]}>✓</Text>}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
    </SafeAreaProvider>
  );
}

// ════════════════════════════════════════════════════════════
// Styles
// ════════════════════════════════════════════════════════════
function createStyles(t, scale, lang) {
  const isRTL = lang === 'fa';
  return StyleSheet.create({
    container:        { flex:1, backgroundColor:t.bg },
    header:           { backgroundColor:t.headerBg, paddingTop:40, paddingBottom:60, paddingHorizontal:20, borderBottomLeftRadius:35, borderBottomRightRadius:35, shadowColor:t.primary, shadowOffset:{width:0,height:3}, shadowOpacity:0.15, shadowRadius:6, elevation:5 },
    settingsTopBtn:   { position:'absolute', top:45, left:15, width:40, height:40, justifyContent:'center', alignItems:'center', zIndex:20 },
    iconCircle:       { width:40, height:40, borderRadius:20, backgroundColor:t.primary, justifyContent:'center', alignItems:'center', shadowColor:t.primary, shadowOffset:{width:0,height:2}, shadowOpacity:0.4, shadowRadius:4, elevation:4 },
    topBtnIcon:       { fontSize:22*scale, color:'#FFF', fontWeight:'600' },
    dateContainer:    { alignItems:'center', marginTop:20 },
    datePersian:      { fontSize:30*scale, fontWeight:'bold', color:t.textPrimary, marginBottom:14 },
    dateGregorian:    { fontSize:16*scale, color:t.textSecondary, marginBottom:14 },
    lastUpdate:       { fontSize:13*scale, color:t.textSecondary, marginTop:4 },

    // دکمه کیف پول (چپ)
    calcBtn:          { position:'absolute', top:165, left:20, width:46, height:46, backgroundColor:t.primary, borderRadius:23, justifyContent:'center', alignItems:'center', shadowColor:t.primary, shadowOffset:{width:0,height:3}, shadowOpacity:0.3, shadowRadius:5, elevation:6, zIndex:10 },
    // دکمه مبدل (راست)
    converterBtn:     { position:'absolute', top:165, right:20, width:46, height:46, backgroundColor:t.primary, borderRadius:23, justifyContent:'center', alignItems:'center', shadowColor:t.primary, shadowOffset:{width:0,height:3}, shadowOpacity:0.3, shadowRadius:5, elevation:6, zIndex:10 },
    calcIcon:         { fontSize:24*scale },

    center:           { flex:1, justifyContent:'center', alignItems:'center', padding:30 },
    loadingText:      { color:t.primary, fontSize:16*scale, marginTop:15 },
    errorIcon:        { fontSize:60, marginBottom:15 },
    error:            { color:'#E74C3C', fontSize:18*scale, textAlign:'center', marginBottom:20 },
    retryBtn:         { backgroundColor:t.primary, paddingHorizontal:30, paddingVertical:12, borderRadius:12 },
    retryBtnText:     { color:'#FFF', fontSize:16*scale, fontWeight:'bold' },
    list:             { flex:1, padding:16, marginTop:40 },
    card:             { backgroundColor:t.cardBg, borderRadius:20, padding:20, marginBottom:14, borderWidth:2, borderColor:t.cardBorder, shadowColor:t.primary, shadowOffset:{width:0,height:2}, shadowOpacity:0.12, shadowRadius:4, elevation:3 },
    cardHeader:       { flexDirection:'row', alignItems:'center', marginBottom:12 },
    flag:             { fontSize:28, marginRight:12 },
    name:             { fontSize:17*scale, fontWeight:'600', color:t.textPrimary, flex:1 },
    price:            { fontSize:22*scale, fontWeight:'bold', color:t.primary, textAlign:isRTL?'right':'left' },
    footer:           { alignItems:'center', paddingVertical:25 },
    footerText:       { color:'#95A5A6', fontSize:12*scale },

    // مودال
    modalOverlay:     { flex:1, backgroundColor:'rgba(0,0,0,0.6)', justifyContent:'flex-end' },
    modalContent:     { backgroundColor:t.cardBg, borderTopLeftRadius:30, borderTopRightRadius:30, maxHeight:'90%', paddingBottom:20 },
    modalHeader:      { flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:20, borderBottomWidth:1, borderBottomColor:t.cardBorder },
    modalTitle:       { fontSize:22*scale, fontWeight:'bold', color:t.primary },
    closeBtn:         { fontSize:30, color:'#95A5A6', fontWeight:'300' },
    backIcon:         { fontSize:28, color:t.primary, fontWeight:'bold' },
    modalList:        { padding:15, paddingBottom:1 },
    catTitle:         { fontSize:16*scale, fontWeight:'bold', color:t.primary, marginTop:15, marginBottom:10 },
    modalItem:        { flexDirection:'row', alignItems:'center', backgroundColor:t.headerBg, padding:18, borderRadius:12, marginBottom:10 },
    modalItemSel:     { backgroundColor:t.cardBorder, borderWidth:2, borderColor:t.primary },
    modalItemFlag:    { fontSize:24, marginRight:12 },
    modalItemText:    { flex:1, fontSize:16*scale, color:t.textPrimary },
    check:            { fontSize:24, fontWeight:'bold', color:t.primary },
    doneBtn:          { backgroundColor:t.primary, marginHorizontal:20, marginTop:10, padding:16, borderRadius:15, alignItems:'center', shadowColor:t.primary, shadowOffset:{width:0,height:3}, shadowOpacity:0.3, shadowRadius:5, elevation:6 },
    doneBtnText:      { color:'#FFF', fontSize:18*scale, fontWeight:'bold' },
    addBtn:           { width:40, height:40, borderRadius:20, backgroundColor:t.primary, justifyContent:'center', alignItems:'center' },
    addBtnText:       { fontSize:28, color:'#FFF', fontWeight:'300', lineHeight:32 },

    // تنظیمات
    settingsMenuItem: { flexDirection:'row', justifyContent:isRTL?'flex-end':'flex-start', alignItems:'center', backgroundColor:t.headerBg, padding:20, borderRadius:15, marginBottom:12, borderWidth:1, borderColor:t.cardBorder },
    settingsMenuText: { fontSize:17*scale, color:t.textPrimary, fontWeight:'600', textAlign:isRTL?'right':'left' },
    choiceList:       { padding:20 },
    choiceItem:       { flexDirection:'row', justifyContent:'space-between', alignItems:'center', backgroundColor:t.headerBg, padding:20, borderRadius:15, marginBottom:12, borderWidth:2, borderColor:t.cardBorder },
    choiceItemSel:    { backgroundColor:t.cardBorder, borderColor:t.primary },
    choiceText:       { fontSize:18*scale, color:t.textPrimary, fontWeight:'600', textAlign:isRTL?'right':'left', flex:1 },
    themeItem:        { flexDirection:'row', alignItems:'center', justifyContent:'space-between', padding:18, borderRadius:15, marginBottom:10, borderWidth:2 },
    themeItemText:    { fontSize:17*scale, fontWeight:'600', textAlign:isRTL?'right':'left', flex:1 },

    // مبدل
    convHeader:       { backgroundColor:t.headerBg, paddingTop:50, paddingBottom:15, paddingHorizontal:20, flexDirection:'row', justifyContent:'space-between', alignItems:'center', borderBottomLeftRadius:25, borderBottomRightRadius:25 },
    convTitle:        { fontSize:22*scale, fontWeight:'bold', color:t.textPrimary },
    convScreen:       { flex:1, padding:20, backgroundColor:t.bg },
    backBtn:          { padding:5 },

    // دو باکس swap
    swapContainer:    { backgroundColor:t.cardBg, borderRadius:24, borderWidth:2, borderColor:t.cardBorder, marginBottom:24, shadowColor:t.primary, shadowOffset:{width:0,height:3}, shadowOpacity:0.12, shadowRadius:6, elevation:4 },
    swapBox:          { padding:18, flexDirection:'row', alignItems:'center', justifyContent:'space-between' },
    swapCurrBtn:      { flexDirection:'row', alignItems:'center', flex:1, marginRight:12 },
    swapFlag:         { fontSize:30, marginRight:10 },
    swapCurrName:     { fontSize:16*scale, fontWeight:'600', color:t.textPrimary, flex:1 },
    swapChevron:      { fontSize:14, color:t.textSecondary, marginLeft:4 },
    swapInput:        { fontSize:22*scale, fontWeight:'bold', color:t.primary, textAlign:'right', flex:1, minWidth:80 },
    swapResult:       { fontSize:22*scale, fontWeight:'bold', color:t.primary, textAlign:'left', flex:1 },
    swapBtn:          { alignSelf:'center', width:44, height:44, borderRadius:22, backgroundColor:t.primary, justifyContent:'center', alignItems:'center', marginVertical:-10, zIndex:10, shadowColor:t.primary, shadowOffset:{width:0,height:3}, shadowOpacity:0.4, shadowRadius:5, elevation:6, borderWidth:3, borderColor:t.cardBg },
    swapBtnIcon:      { fontSize:22, color:'#FFF', fontWeight:'bold' },

    // نتایج مبدل
    resultsTitle:     { fontSize:18*scale, fontWeight:'bold', color:t.textPrimary, marginBottom:15 },
    resCard:          { backgroundColor:t.cardBg, borderRadius:16, padding:16, marginBottom:12, borderWidth:2, borderColor:t.cardBorder, flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
    resCardLeft:      { flexDirection:'row', alignItems:'center', flex:1 },
    resFlag:          { fontSize:22, marginRight:10 },
    resName:          { fontSize:15*scale, color:t.textPrimary, fontWeight:'600' },
    resValue:         { fontSize:18*scale, fontWeight:'bold', color:t.primary },

    // انتخابگر ارز
    currModalItem:    { flexDirection:'row', alignItems:'center', backgroundColor:t.headerBg, padding:16, borderRadius:15, marginBottom:10, borderWidth:1, borderColor:t.cardBorder },
    currModalFlag:    { fontSize:28, marginRight:12 },
    currModalText:    { fontSize:16*scale, color:t.textPrimary, fontWeight:'600', flex:1 },

    // جستجو
    searchBox:        { flexDirection:'row', alignItems:'center', backgroundColor:t.cardBg, borderRadius:12, borderWidth:1.5, borderColor:t.cardBorder, paddingHorizontal:12, marginBottom:12 },
    searchIcon:       { fontSize:16, marginRight:8 },
    searchInput:      { flex:1, padding:12, fontSize:15*scale, color:t.textPrimary },
    searchClear:      { fontSize:16, color:'#95A5A6', paddingLeft:8 },
    input:            { backgroundColor:t.headerBg, color:t.textPrimary, padding:16, borderRadius:15, fontSize:17*scale, borderWidth:2, borderColor:t.cardBorder, fontWeight:'600', marginBottom:16 },

    // کیف پول
    totalCard:        { backgroundColor:t.primary, borderRadius:20, padding:24, marginBottom:20, alignItems:'center', shadowColor:t.primary, shadowOffset:{width:0,height:4}, shadowOpacity:0.3, shadowRadius:8, elevation:6 },
    totalLabel:       { fontSize:15*scale, color:'rgba(255,255,255,0.8)', marginBottom:8 },
    totalValue:       { fontSize:26*scale, fontWeight:'bold', color:'#FFF' },
    emptyWallet:      { alignItems:'center', paddingTop:60 },
    emptyWalletIcon:  { fontSize:60, marginBottom:16, textAlign:'center' },
    emptyWalletText:  { fontSize:18*scale, color:t.textPrimary, fontWeight:'600', marginBottom:8 },
    emptyWalletSub:   { fontSize:14*scale, color:t.textSecondary },
    walletCard:       { backgroundColor:t.cardBg, borderRadius:18, padding:18, marginBottom:14, borderWidth:2, borderColor:t.cardBorder, flexDirection:'row', justifyContent:'space-between', alignItems:'center', shadowColor:t.primary, shadowOffset:{width:0,height:2}, shadowOpacity:0.1, shadowRadius:4, elevation:3 },
    walletCardLeft:   { flexDirection:'row', alignItems:'center', flex:1 },
    walletFlag:       { fontSize:32, marginRight:14 },
    walletName:       { fontSize:16*scale, fontWeight:'600', color:t.textPrimary, marginBottom:4 },
    walletAmt:        { fontSize:13*scale, color:t.textSecondary },
    walletCardRight:  { alignItems:'flex-end' },
    walletValue:      { fontSize:16*scale, fontWeight:'bold', color:t.primary, marginBottom:8 },
    walletActions:    { flexDirection:'row', columnGap:12 },
    walletEdit:       { fontSize:20 },
    walletDelete:     { fontSize:20 },
    walletInputLabel: { fontSize:15*scale, fontWeight:'600', color:t.textPrimary, marginBottom:8 },
    walletPickItem:   { flexDirection:'row', alignItems:'center', backgroundColor:t.headerBg, padding:14, borderRadius:12, marginBottom:8, borderWidth:1, borderColor:t.cardBorder },
    walletPickItemSel:{ borderColor:t.primary, borderWidth:2, backgroundColor:t.cardBorder },
  });
}
