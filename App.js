import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const API_KEY = 'freeGcIODOZyhFq6Lj2qz3ciQ0Jg6kWP';

export default function App() {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [rawData, setRawData] = useState(''); // برای دیدن داده خام

  const fetchRates = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const url = `https://api.navasan.tech/latest/?api_key=${API_KEY}&item=usd,eur,try,aed,geram18,bitcoin,ethereum`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error(`خطای سرور: ${response.status}`);
      }
      
      const data = await response.json();
      
      // نمایش داده خام برای دیباگ
      setRawData(JSON.stringify(data, null, 2));
      
      // تابع کمکی برای گرفتن مقدار
      const getValue = (item) => {
        if (!item) return 0;
        if (typeof item === 'number') return item;
        if (item.value !== undefined) return item.value;
        if (item.price !== undefined) return item.price;
        if (item.sell !== undefined) return item.sell;
        if (item.buy !== undefined) return item.buy;
        return 0;
      };
      
      const newRates = {
        USD: Math.round(getValue(data.usd)),
        EUR: Math.round(getValue(data.eur)),
        TRY: Math.round(getValue(data.try)),
        AED: Math.round(getValue(data.aed)),
        GOLD: Math.round(getValue(data.geram18 || data.gold || data.gold_18)),
        BTC: Math.round(getValue(data.bitcoin || data.btc)),
        ETH: Math.round(getValue(data.ethereum || data.eth)),
      };

      setRates(newRates);
      
    } catch (err) {
      setError('خطا: ' + err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRates();
    // رفرش خودکار هر 30 ثانیه
    const interval = setInterval(() => {
      fetchRates();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.title}>ارزبان</Text>
        <TouchableOpacity onPress={fetchRates}>
          <Text style={styles.refresh}>↻</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#D4AF37" />
          <Text style={styles.loadingText}>در حال بروزرسانی...</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity onPress={fetchRates} style={styles.retryButton}>
            <Text style={styles.retryText}>تلاش مجدد</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.list}>
          {Object.entries(rates).map(([key, value]) => (
            <View key={key} style={styles.card}>
              <Text style={styles.name}>{key}</Text>
              <Text style={styles.price}>
                {value > 0 ? value.toLocaleString('fa-IR') + ' تومان' : 'خطا در دریافت'}
              </Text>
            </View>
          ))}
          
          {/* نمایش داده خام برای دیباگ - بعداً حذفش میکنیم */}
          <View style={styles.debugCard}>
            <Text style={styles.debugTitle}>اطلاعات API (برای تست):</Text>
            <ScrollView horizontal>
              <Text style={styles.debugText}>{rawData}</Text>
            </ScrollView>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0E17' },
  header: { 
    backgroundColor: '#5B21B6', 
    padding: 20, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  title: { color: '#D4AF37', fontSize: 28, fontWeight: 'bold' },
  refresh: { color: '#D4AF37', fontSize: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  loadingText: { color: '#D4AF37', fontSize: 16, marginTop: 10 },
  error: { color: '#FF6B6B', fontSize: 18, textAlign: 'center', marginBottom: 20 },
  retryButton: {
    backgroundColor: '#5B21B6',
    padding: 15,
    borderRadius: 10,
    marginTop: 10,
  },
  retryText: { color: '#D4AF37', fontSize: 16, fontWeight: 'bold' },
  list: { padding: 16 },
  card: { 
    backgroundColor: '#1A1A2E', 
    borderRadius: 16, 
    padding: 20, 
    marginBottom: 16 
  },
  name: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  price: { color: '#D4AF37', fontSize: 24, marginTop: 8 },
  debugCard: {
    backgroundColor: '#1A1A2E',
    borderRadius: 16,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  debugTitle: { color: '#FFD700', fontSize: 14, fontWeight: 'bold', marginBottom: 10 },
  debugText: { color: '#888', fontSize: 10, fontFamily: 'monospace' },
});
