/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, {useEffect} from 'react';
import {StatusBar, Text, View} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

import BootSplash from 'react-native-bootsplash';
import RootNavigation from './src/navigation';
import {Provider} from 'react-redux';
import store from './src/store/store.ts';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

function App(): React.JSX.Element {
  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
    };

    init().finally(async () => {
      await BootSplash.hide({fade: true});
      console.log('BootSplash has been hidden successfully');
    });
  }, []);
  return (
    <>
      <StatusBar barStyle={'dark-content'} />
      <SafeAreaProvider>
        <GestureHandlerRootView style={{flex: 1}}>
          <Provider store={store}>
            <BottomSheetModalProvider>
              <RootNavigation />
            </BottomSheetModalProvider>
          </Provider>
        </GestureHandlerRootView>
      </SafeAreaProvider>
    </>
  );
}

export default App;
