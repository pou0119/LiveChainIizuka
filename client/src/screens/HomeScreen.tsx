import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

// 白黒カスタムスタイル
const mapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#f5f5f5" }] },
  { "elementType": "labels.icon", "stylers": [{ "visibility": "off" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#f5f5f5" }] },
  { "featureType": "administrative.land_parcel", "elementType": "labels.text.fill", "stylers": [{ "color": "#bdbdbd" }] },
  { "featureType": "poi", "elementType": "geometry", "stylers": [{ "color": "#eeeeee" }] },
  { "featureType": "poi", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "featureType": "poi.park", "elementType": "geometry", "stylers": [{ "color": "#e5e5e5" }] },
  { "featureType": "poi.park", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#ffffff" }] },
  { "featureType": "road.arterial", "elementType": "labels.text.fill", "stylers": [{ "color": "#757575" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#dadada" }] },
  { "featureType": "road.highway", "elementType": "labels.text.fill", "stylers": [{ "color": "#616161" }] },
  { "featureType": "road.local", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] },
  { "featureType": "transit.line", "elementType": "geometry", "stylers": [{ "color": "#e5e5e5" }] },
  { "featureType": "transit.station", "elementType": "geometry", "stylers": [{ "color": "#eeeeee" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#c9c9c9" }] },
  { "featureType": "water", "elementType": "labels.text.fill", "stylers": [{ "color": "#9e9e9e" }] }
];

const minDelta = 0.005;
const maxDelta = 0.1;
const minSize = 30;
const maxSize = 60;
const LABEL_DELTA_THRESHOLD = 0.02; // この値以下でラベル表示

const HomeScreen = () => {
  const [location, setLocation] = useState<Location.LocationObjectCoords | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [pinSize, setPinSize] = useState<number>(40);
  const [latitudeDelta, setLatitudeDelta] = useState<number>(0.01);
  const [showLabel, setShowLabel] = useState<boolean>(false);
  const [denemonTeiSelected, setDenemonTeiSelected] = useState(false);

  // 旧伊藤伝右衛門邸の座標
  const denemonTei = {
    latitude: 33.6550,
    longitude: 130.6845,
    title: '旧伊藤伝右衛門邸',
    description: '福岡県飯塚市の歴史的建造物',
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('位置情報の許可が必要です');
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  const handleRegionChange = (region: any) => {
    setLatitudeDelta(region.latitudeDelta);
    const delta = Math.max(minDelta, Math.min(region.latitudeDelta, maxDelta));
    const size = maxSize - ((delta - minDelta) / (maxDelta - minDelta)) * (maxSize - minSize);
    setPinSize(size);
    // ズームインしているかどうかでラベル表示を切り替え
    const isZoomedIn = region.latitudeDelta < LABEL_DELTA_THRESHOLD;
    setShowLabel(isZoomedIn);
    // ズームアウトしたら選択も解除
    if (!isZoomedIn && denemonTeiSelected) setDenemonTeiSelected(false);
  };

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          style={styles.map}
          provider="google"
          customMapStyle={mapStyle}
          mapType="standard"
          initialRegion={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={false}
          moveOnMarkerPress={false}
          renderToHardwareTextureAndroid={true}
          minZoomLevel={10}
          maxZoomLevel={20}
          onRegionChange={handleRegionChange}
          onPress={() => setDenemonTeiSelected(false)}
        >
          {/* 旧伊藤伝右衛門邸のカスタムマーカー */}
          <Marker
            coordinate={denemonTei}
            title={denemonTei.title}
            description={denemonTei.description}
            onPress={e => {
              e.stopPropagation();
              setDenemonTeiSelected(true);
            }}
          >
            <View style={{ alignItems: 'center' }}>
              <Image
                source={require('../../assets/images/pin.png')}
                style={{ width: pinSize, height: pinSize, resizeMode: 'contain' }}
              />
              {(showLabel || denemonTeiSelected) && (
                <View style={styles.labelContainer}>
                  <Text style={styles.labelText}>{denemonTei.title}</Text>
                </View>
              )}
            </View>
          </Marker>
          {/* 現在地のカスタムマーカー */}
          <Marker
            coordinate={{ latitude: location.latitude, longitude: location.longitude }}
            title="あなたの現在地"
            description="現在地"
          >
            <Image
              source={require('../../assets/images/my-location.png')}
              style={{ width: pinSize, height: pinSize, resizeMode: 'contain' }}
            />
          </Marker>
        </MapView>
      ) : (
        <View style={styles.loading}><ActivityIndicator size="large" /><Text>現在地を取得中...</Text></View>
      )}
      <View style={styles.overlayHeader}>
        <Text style={styles.overlayTitle}>LiveChain Iizuka</Text>
      </View>
      {errorMsg && (
        <View style={styles.errorMsg}><Text style={{ color: 'red' }}>{errorMsg}</Text></View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  overlayHeader: {
    position: 'absolute',
    top: 60,
    left: '5%',
    right: '5%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  overlayTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorMsg: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  labelContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
    borderWidth: 1,
    borderColor: '#bbb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  labelText: {
    fontWeight: 'bold',
    color: '#333',
    fontSize: 14,
  },
});

export default HomeScreen;