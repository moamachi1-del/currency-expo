import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [activeTab, setActiveTab] = useState('rates');
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('IRR');
  const [amount, setAmount] = useState('1');
  const [result, setResult] = useState(0);

  const currencies = [
    { code: 'USD', name: 'دلار', icon: '🇺🇸' },
    { code: 'EUR', name: 'یورو', icon: '🇪🇺' },
    { code: 'TRY', name: 'لیر ترکیه', icon: '🇹🇷' },
    { code: 'AED', name: 'درهم امارات', icon: '🇦🇪' },
    { code: 'GOLD', name: 'طلا ۱۸ عیار', icon: '🪙' },
    { code: 'BTC', name: 'بیت‌کوین', icon: '₿' },
    { code: 'ETH', name: 'اتریوم', icon: 'Ξ' },
  ];

  const fetchRates = async () => {
    setRefreshing(true);
    try {
      // brsapi.ir - مثال برای چند تا endpoint (می‌تونی بیشتر اضافه کنی)
      const [usdRes, eurRes, tryRes, aedRes, goldRes, btcRes, ethRes] = await Promise.all([
        fetch('https://brsapi.ir/api/v1/currency/usd'),
        fetch('https://brsapi.ir/api/v1/currency/eur'),
        fetch('https://brsapi.ir/api/v1/currency/try'),
        fetch('https://brsapi.ir/api/v1/currency/aed'),
        fetch('https://brsapi.ir/api/v1/gold/geram18'),
        fetch('https://brsapi.ir/api/v1/crypto/bitcoin'),
        fetch('https://brsapi.ir/api/v1/crypto/ethereum'),
      ]);

      const usdData = await usdRes.json();
      const eurData = await eurRes.json();
      const tryData = await tryRes.json();
      const aedData = await aedRes.json();
      const goldData = await goldRes.json();
      const btcData = await btcRes.json();
      const ethData = await ethRes.json();

      const newRates = {
        USD: Math.round(usdData?.p || 721000),
        EUR: Math.round(eurData?.p || 800000),
        TRY: Math.round(tryData?.p || 21000),
        AED: Math.round(aedData?.p || 196000),
        GOLD: Math.round(goldData?.p || 52000000), // هر گرم ۱۸ عیار
        BTC: Math.round(btcData?.p || 3520000000),
        ETH: Math.round(ethData?.p || 150000000),
      };

      setRates(newRates);
      setLastUpdate(new Date());
    } catch (error) {
      console.error('خطا در گرفتن قیمت‌ها:', error);
    }
    setLoading(false);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchRates();
  }, []);

  useEffect(() => {
    if (rates[fromCurrency] && rates[toCurrency]) {
      const from = fromCurrency === 'IRR' ? 1 : rates[fromCurrency];
      const to = toCurrency === 'IRR' ? 1 : rates[toCurrency];
      const calculated = (parseFloat(amount) || 0) * (to / from);
      setResult(calculated);
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  const formatNumber = (num) => {
    return new Intl.NumberFormat('fa-IR').format(Math.round(num));
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>در حال بارگذاری قیمت‌ها...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>نرخ ارز و طلا</Text>
        <TouchableOpacity onPress={fetchRates} style={styles.refreshButton}>
          <Text style={styles.refreshText}>{refreshing ? '...' : '🔄'}</Text>
        </TouchableOpacity>
      </View>

      {lastUpdate && (
        <Text style={styles.updateTime}>
          آخرین بروز: {lastUpdate.toLocaleTimeString('fa-IR')}
        </Text>
      )}

      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'rates' && styles.activeTab]}
          onPress={() => setActiveTab('rates')}>
          <Text style={[styles.tabText, activeTab === 'rates' && styles.activeTabText]}>
            💰 نرخ‌ها
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'converter' && styles.activeTab]}
          onPress={() => setActiveTab('converter')}>
          <Text style={[styles.tabText, activeTab === 'converter' && styles.activeTabText]}>
            🔄 تبدیل
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={fetchRates} />
        }>
        {activeTab === 'rates' ? (
          <View style={styles.ratesGrid}>
            {currencies.map((currency) => (
              <View key={currency.code} style={styles.rateCard}>
                <View style={styles.rateLeft}>
                  <Text style={styles.icon}>{currency.icon}</Text>
                  <Text style={styles.currencyName}>{currency.name}</Text>
                </View>
                <View style={styles.rateRight}>
                  <Text style={styles.price}>
                    {rates[currency.code] ? formatNumber(rates[currency.code]) : '---'}
                  </Text>
                  <Text style={styles.unit}>تومان</Text>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.converter}>
            <View style={styles.converterBox}>
              <Text style={styles.label}>مقدار</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="مقدار"
              />
            </View>
            <View style={styles.converterBox}>
              <Text style={styles.label}>نتیجه (تقریبی)</Text>
              <Text style={styles.resultValue}>{formatNumber(result)} تومان</Text>
            </View>
            {/* بعداً می‌تونی select برای from/to اضافه کنی */}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
  },
  header: {
    backgroundColor: '#4F46E5',
    padding: 20,
    paddingTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  refreshButton: {
    padding: 8,
  },
  refreshText: {
    fontSize: 20,
  },
  updateTime: {
    textAlign: 'center',
    padding: 8,
    fontSize: 12,
    color: '#64748B',
    backgroundColor: '#EEF2FF',
  },
  tabs: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: '#4F46E5',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#64748B',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  ratesGrid: {
    padding: 16,
  },
  rateCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rateLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    fontSize: 32,
    marginRight: 12,
  },
  currencyName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  rateRight: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  unit: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  converter: {
    padding: 16,
  },
  converterBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#64748B',
    marginBottom: 12,
  },
  input: {
    borderWidth: 2,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 16,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#1E293B',
  },
  resultValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#7C3AED',
  },
});
