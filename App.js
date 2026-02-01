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
      const response = await fetch(
        `https://api.navasan.tech/latest/?api_key=${API_KEY}&item=usd,eur,try,aed,geram18,bitcoin,ethereum`
      );
      const data = await response.json();

      // چک کن اگر داده اصلی نبود
      if (!data || typeof data !== 'object' || !data.usd) {
        throw new Error('داده نامعتبر از API');
      }

      const newRates = {
        USD: Math.round(data.usd?.value || 0),
        EUR: Math.round(data.eur?.value || 0),
        TRY: Math.round(data.try?.value || 0),
        AED: Math.round(data.aed?.value || 0),
        GOLD: Math.round(data.geram18?.value || 0),
        BTC: Math.round(data.bitcoin?.value || 0),
        ETH: Math.round(data.ethereum?.value || 0),
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
        <ActivityIndicator size="large" color="#D4AF37" style={styles.center} />
      ) : error ? (
        <Text style={styles.error}>{error}</Text>
      ) : (
        <ScrollView style={styles.list}>
          {Object.entries(rates).map(([key, value]) => (
            <View key={key} style={styles.card}>
              <Text style={styles.name}>{key}</Text>
              <Text style={styles.price}>{value.toLocaleString('fa-IR')} تومان</Text>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0F0E17' },
  header: { backgroundColor: '#5B21B6', padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: '#D4AF37', fontSize: 28, fontWeight: 'bold' },
  refresh: { color: '#D4AF37', fontSize: 32 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: '#FF6B6B', fontSize: 18, textAlign: 'center', marginTop: 100 },
  list: { padding: 16 },
  card: { backgroundColor: '#1A1A2E', borderRadius: 16, padding: 20, marginBottom: 16 },
  name: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  price: { color: '#D4AF37', fontSize: 24, marginTop: 8 },
});
