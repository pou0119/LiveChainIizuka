import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

// TODO: 施設の型定義 (client/types/index.ts などに定義)
interface PlaceDetail {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  ticketPrice?: number;
  nftPreviewImages?: string[]; // NFTプレビュー画像のURLリスト
  officialWebsite?: string;
}



const PlaceDetailPage = () => {
  const { id } = useLocalSearchParams<{ id: string }>(); // URLからIDを取得
  const router = useRouter();

  // stateを3種類用意
  const [place, setPlace] = useState<PlaceDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return; // idがなければ何もしない

    const fetchPlaceDetails = async () => {
      try {
        setLoading(true);
        // サーバーにIDを使って問い合わせる
        const response = await fetch(`http://192.168.0.133:3000/places/${id}`);
        if (!response.ok) {
          throw new Error('施設データの取得に失敗しました。');
        }
        const data: PlaceDetail = await response.json();
        setPlace(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : '不明なエラーが発生しました');
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceDetails();
  }, [id]); // idが変わるたびにデータを再取得

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  if (error || !place) {
    return <View style={styles.center}><Text style={{ color: 'red' }}>{error || '施設が見つかりません'}</Text></View>;
  }

  const handleBuyTicket = () => {
    // TODO: チケット購入画面への遷移または処理を実装
    console.log('Buy ticket button pressed');
    // 例: router.push('/buy-ticket');
  };

  const handleScanQR = () => {
    // TODO: QRコードスキャン機能の実装
    console.log('Scan QR button pressed');
    // 例: router.push('/scan-qr');
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: place.imageUrl }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.title}>{place.name}</Text>
        <Text style={styles.description}>{place.description}</Text>

        {place.officialWebsite && (
          <TouchableOpacity onPress={() => Linking.openURL(place.officialWebsite!)} style={styles.linkButton}>
            <Text style={styles.linkText}>公式サイトはこちら</Text>
          </TouchableOpacity>
        )}

        {place.nftPreviewImages && place.nftPreviewImages.length > 0 && (
          <View style={styles.nftPreview}>
            <Text style={styles.subtitle}>入手できる「成長するNFT」プレビュー</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {place.nftPreviewImages.map((imageUrl, index) => (
                <Image key={index} source={{ uri: imageUrl }} style={styles.nftImage} />
              ))}
            </ScrollView>
          </View>
        )}

        <View style={styles.buttons}>
          {place.ticketPrice !== undefined && (
            <TouchableOpacity style={styles.buyButton} onPress={handleBuyTicket}>
              <Text style={styles.buttonText}>アプリ内でチケットを購入 ({place.ticketPrice}円)</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.qrButton} onPress={handleScanQR}>
            <Text style={styles.buttonText}>現地チケットのQRコードを読み込む</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  details: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },
  linkButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  linkText: {
    color: 'blue',
    textAlign: 'center',
    fontSize: 16,
  },
  nftPreview: {
    marginBottom: 20,
  },
  nftImage: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
    marginRight: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttons: {
    marginTop: 20,
  },
  buyButton: {
    backgroundColor: '#007bff',
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  qrButton: {
    backgroundColor: '#28a745',
    paddingVertical: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PlaceDetailPage;