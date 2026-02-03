import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

const API_KEY = 'freeGcIODOZyhFq6Lj2qz3ciQ0Jg6kWP';

export default function App() {
  const [rates, setRates] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState('');

  const fetchRates = async () => {
    setLoading(true);
    setError(null);
    setDebugInfo('در حال اتصال به سرور...');
    
    try {
      const url = `https://api.navasan.tech/latest/?api_key=${API_KEY}&item=usd,eur,try,aed,geram18,bitcoin,ethereum`;
      setDebugInfo('URL: ' + url);
      
      const response = await fetch(url);
      setDebugInfo(`وضعیت پاسخ: ${response.status}`);
      
      if (!response.ok) {
        throw new Error(`خطای سرور: ${response.status}`);
      }
      
      const data = await response.json();
      setDebugInfo('داده دریافت شد: ' + JSON.stringify(data).substring(0, 200));
      
      // چک کردن چند حالت مختلف برای ساختار داده
      const newRates = {
        USD: Math.round(data.usd?.value || data.usd || 0),
        EUR: Math.round(data.eur?.value || data.eur || 0),
        TRY: Math.round(data.try?.value || data.try || 0),
        AED: Math.round(data.aed?.value || data.aed || 0),
        GOLD: Math.round(data.geram18?.value || data.geram18 || 0),
        BTC: Math.round(data.bitcoin?.value || data.bitcoin || 0),
        ETH: Math.round(data.ethereum?.value || data.ethereum || 0),
      };

      setDebugInfo('قیمت‌ها پردازش شدند');
      setRates(newRates);
      
    } catch (err) {
      const errorMsg = 'خطا: ' + err.message;
      setError(errorMsg);
      setDebugInfo(errorMsg + ' - ' + err.toString());
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
          <Text style={styles.debugText}>{debugInfo}</Text>
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.error}>{error}</Text>
          <Text style={styles.debugText}>{debugInfo}</Text>
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
  error: { color: '#FF6B6B', fontSize: 18, textAlign: 'center', marginBottom: 20 },
  debugText: { 
    color: '#888', 
    fontSize: 12, 
    textAlign: 'center', 
    marginTop: 10,
    padding: 10 
  },
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
