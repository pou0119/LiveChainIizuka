// app/(tabs)/passport.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Image as ExpoImage } from 'expo-image';

// NFTデータの型を定義しておくと、コードが書きやすくなります
interface Nft {
  id: string;
  name: string;
  imageUrl: string;
}

const userProfile = {
  name: 'Mineraru',
  avatar: require('../../assets/images/avatar.png'),
  memberSince: 'My Digital Passport',
};

const MyPassportScreen = () => {
  // 1. Stateを3種類用意
  const [nfts, setNfts] = useState<Nft[]>([]);
  const [loading, setLoading] = useState(true); // ローディング状態
  const [error, setError] = useState<string | null>(null); // エラーメッセージ

  // 2. useEffectでサーバーからデータを取得
  useEffect(() => {
    const fetchNfts = async () => {
      try {
        // あなたのサーバーのURLに置き換えてください
        const response = await fetch('http://192.168.0.133:3000/users/mineraru/nfts');    
        const data = await response.json();
        setNfts(data);
      } catch (e) {
        setError('データの取得に失敗しました。');
        console.error(e);
      } finally {
        setLoading(false); // 成功・失敗どちらでもローディングは終了
      }
    };

    fetchNfts();
  }, []); // 初回表示時に一度だけ実行

  // 3. ローディング中の表示
  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#2C3E50" />
        <Text style={{ marginTop: 10 }}>NFTを読み込んでいます...</Text>
      </View>
    );
  }

  // 4. エラー発生時の表示
  if (error) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  // 5. データ取得成功時の表示
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image source={userProfile.avatar} style={styles.avatar} />
        <Text style={styles.userName}>{userProfile.name}</Text>
        <Text style={styles.memberSince}>{userProfile.memberSince}</Text>
        <View style={styles.statsContainer}>
          <Text style={styles.statsText}>{nfts.length} NFTs Collected</Text>
        </View>
      </View>

      <View style={styles.nftsSection}>
        <Text style={styles.sectionTitle}>My NFT Collection</Text>
        <View style={styles.nftsGrid}>
          {nfts.map((nft) => (
            <View key={nft.id} style={styles.nftCard}>
              {/* 画像ソースの指定方法を変更 */}
              <ExpoImage source={{ uri: nft.imageUrl }} style={styles.nftImage} contentFit="cover" />
              <Text style={styles.nftName} numberOfLines={1}>{nft.name}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

// スタイル定義はほぼ同じですが、中央揃え用のスタイルを追加
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF6E3',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    backgroundColor: '#2C3E50',
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#D4AF37',
    marginBottom: 10,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  memberSince: {
    fontSize: 14,
    color: '#BDC3C7',
    marginTop: 4,
  },
  statsContainer: {
    marginTop: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  statsText: {
    fontSize: 16,
    color: '#D4AF37',
    fontWeight: '600',
  },
  nftsSection: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2C3E50',
    marginBottom: 20,
    textAlign: 'center',
  },
  nftsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  nftCard: {
    width: '48%',
    marginBottom: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  nftImage: {
    width: '100%',
    aspectRatio: 1,
  },
  nftName: {
    fontSize: 12,
    color: '#616161',
    textAlign: 'center',
    padding: 8,
  },
});

export default MyPassportScreen;