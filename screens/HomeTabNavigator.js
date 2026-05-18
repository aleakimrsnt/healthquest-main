import React, { useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; 
import { View, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';
import HomeScreen from './tabs/HomeScreen';
import PlanScreen from './tabs/PlanScreen';
import StoreScreen from './tabs/StoreScreen';
import AwardsScreen from './tabs/AwardsScreen';

const Tab = createBottomTabNavigator();

const CustomTabBar = ({ state, descriptors, navigation, keyboardVisible }) => {
  if (keyboardVisible) {
    return null; // Hide the tab bar if keyboard is visible
  }

  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          let iconName;

          if (route.name === 'Home') {
            iconName = isFocused ? 'ios-home' : 'ios-home-outline';
          } else if (route.name === 'Plan') {
            iconName = isFocused ? 'ios-calendar' : 'ios-calendar-outline';
          } else if (route.name === 'Store') {
            iconName = isFocused ? 'cart' : 'cart-outline'; // Change icon to cart-outline
          } else if (route.name === 'Awards') {
            iconName = isFocused ? 'ios-trophy' : 'ios-trophy-outline';
          }

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
            >
              <Ionicons name={iconName} size={24} color={isFocused ? '#ffffff' : '#8c8c8c'} />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const HomeTabNavigator = () => {
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} keyboardVisible={keyboardVisible} />} screenOptions={{ headerShown: false }}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Plan" component={PlanScreen} />
      <Tab.Screen name="Store" component={StoreScreen} />
      <Tab.Screen name="Awards" component={AwardsScreen} />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#212740',
    borderTopLeftRadius: 70,
    borderTopRightRadius: 70,
    marginBottom: 0,
    padding: 30,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HomeTabNavigator;
