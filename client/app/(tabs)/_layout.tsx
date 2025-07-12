// app/(tabs)/_layout.tsx

import { TabBarIcon } from '@/components/navigation/TabBarIcon'; // アイコン用のコンポーネント
import { Tabs } from 'expo-router';
import React from 'react';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        // `name="index"` は `index.tsx` ファイルに対応
        name="index"
        options={{
          title: 'Home', // タブに表示される名前
          headerShown: false, // マップ画面のヘッダーは不要なら消す
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="passport"
        options={{
          title: 'Passport',
          headerShown: true,
          tabBarIcon: ({ color, focused }) => (
            <TabBarIcon name={focused ? 'id-card' : 'id-card-outline'} color={color} />
          ),
        }}
      />
      {/* 他のタブがあればここに追加 */}
      {/* <Tabs.Screen name="settings" ... /> */}
    </Tabs>
  );
}