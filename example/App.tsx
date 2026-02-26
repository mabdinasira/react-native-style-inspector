import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleInspector } from '../src';
import {
  BasicLayoutScreen,
  NestedScreen,
  OverlapScreen,
  ScrollScreen,
  StressScreen,
} from './screens';

const SCREENS = [
  { key: 'basic', label: 'Basic', component: BasicLayoutScreen },
  { key: 'nested', label: 'Nested', component: NestedScreen },
  { key: 'overlap', label: 'Overlap', component: OverlapScreen },
  { key: 'scroll', label: 'Scroll', component: ScrollScreen },
  { key: 'stress', label: 'Stress', component: StressScreen },
] as const;

const App = () => {
  const [activeScreen, setActiveScreen] = useState<string>('basic');
  const ActiveComponent =
    SCREENS.find((screen) => screen.key === activeScreen)?.component ?? BasicLayoutScreen;

  return (
    <StyleInspector enabled={__DEV__}>
      <View style={styles.container}>
        <StatusBar style='light' />
        <SafeAreaView style={styles.content}>
          <ActiveComponent />
        </SafeAreaView>
        <View style={styles.tabBar}>
          {SCREENS.map((screen) => (
            <TouchableOpacity
              key={screen.key}
              style={[styles.tab, activeScreen === screen.key && styles.tabActive]}
              onPress={() => setActiveScreen(screen.key)}
            >
              <Text style={[styles.tabText, activeScreen === screen.key && styles.tabTextActive]}>
                {screen.label}
              </Text>
            </TouchableOpacity>
          ))}
          <SafeAreaView edges={['bottom']} />
        </View>
      </View>
    </StyleInspector>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1A1A2E',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#16213E',
    borderTopWidth: 1,
    borderTopColor: '#0F3460',
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    alignItems: 'center',
  },
  tabActive: {
    borderTopWidth: 2,
    borderTopColor: '#E94560',
  },
  tabText: {
    color: '#666',
    fontSize: 14,
    fontWeight: '500',
  },
  tabTextActive: {
    color: '#E94560',
  },
});
