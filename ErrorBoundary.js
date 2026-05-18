import React, { Component } from 'react';
import { View } from 'react-native';

class ErrorBoundary extends Component {
  state = { hasError: false, error: null, errorInfo: null };

  componentDidCatch(error, errorInfo) {
    this.setState({ hasError: true, error, errorInfo });
    // Log error to console
    console.error(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render a fallback UI here
      return <View />;
    }
    return this.props.children;
  }
}

// Override console.error to prevent errors from being logged to the screen
console.error = (error, errorInfo) => {
  // Customize logging behavior here (e.g., using a logging library)
  console.log('Error:', error);
  console.log('Error Info:', errorInfo);
};

// Override console.warn to prevent warnings from being logged to the screen
console.warn = (warning) => {
  // Customize logging behavior here (e.g., using a logging library)
  console.log('Warning:', warning);
};

export default ErrorBoundary;
