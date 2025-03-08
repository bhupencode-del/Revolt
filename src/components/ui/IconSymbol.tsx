import React from 'react';
import { TextStyle } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

interface IconSymbolProps {
  name: keyof typeof MAPPING;
  size?: number;
  color?: string;
  style?: TextStyle; // Ensuring the style prop is correctly typed
}

// Mapping for icon names
const MAPPING: Record<string, string> = {
  home: 'home',
  settings: 'settings',
  search: 'search',
  menu: 'menu',
  // Add more mappings as needed
};

const IconSymbol: React.FC<IconSymbolProps> = ({ name, size = 24, color = 'black', style }) => {
  // Ensure style is correctly typed as TextStyle
  const iconStyle: TextStyle = {
    ...(style as TextStyle),
    fontSize: size, // Ensuring fontSize is included
  };

  return <MaterialIcons color={color} size={size} name={MAPPING[name]} style={iconStyle} />;
};

export default IconSymbol;


