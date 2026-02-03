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

  const fetchRates = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const url = `https://api.navasan.tech/latest/?api_key=${API_KEY}&item=usd,eur,try,aed,geram18,bitcoin,ethereum`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`خطای سرور: ${response.status}`);
      }
      
      const data = await response.json();
      
      // تابع کمکی برای گرفتن مقدار از ساختارهای مختلف
      const getValue = (item) => {
        if (!item) return 0;
        if (typeof item === 'number') return item;
        if (item.value) return item.value;
        if (item.price) return item.price;
        return 0;
      };
      
      const newRates = {
        USD: Math.round(getValue(data.usd)),
        EUR: Math.round(getValue(data.eur)),
        TRY: Math.round(getValue(data.try)),
        AED: Math.round(getValue(data.aed)),
        GOLD: Math.round(getValue(data.geram18)),
        BTC: Math.round(getValue(data.bitcoin)),
        ETH: Math.round(getValue(data.ethereum)),
      };

      setRates(newRates);
      
    } catch (err) {
      setError('خطا در گرفتن قیمت‌ها: ' + err.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRates();
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
        </View>
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
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
  error: { color: '#FF6B6B', fontSize: 18, textAlign: 'center', marginTop: 100 },
  list: { padding: 16 },
  card: { 
    backgroundColor: '#1A1A2E', 
    borderRadius: 16, 
    padding: 20, 
    marginBottom: 16 
  },
  name: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  price: { color: '#D4AF37', fontSize: 24, marginTop: 8 },
});
