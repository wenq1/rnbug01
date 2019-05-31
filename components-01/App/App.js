
import      React                               from 'react';
import    { useEffect }                         from 'react';
import    { StyleSheet }                        from 'react-native';
import    { ScrollView }                        from 'react-native';
import    { PermissionsAndroid }                from 'react-native';
import    { View }                              from 'react-native';
import    { Text }                              from 'react-native';
import    { Button }                            from 'react-native';

import    { ListItem }                          from 'react-native-elements';
import    { BallIndicator }                     from 'react-native-indicators';
import      CameraRollPicker                    from 'react-native-camera-roll-picker';

import    { NavigationEvents }                  from 'react-navigation';
import    { createStackNavigator }              from 'react-navigation';
import    { createSwitchNavigator }             from 'react-navigation';
import    { createBottomTabNavigator }          from 'react-navigation';
import    { createAppContainer }                from 'react-navigation';

var MainBottomTabNav   = createBottomTabNavigator ({
        'settings-screen':          SettingsScreen,
}, {
        initialRouteName:   'settings-screen',
        lazy:               true,
        swipeEnabled:       false,
        animationEnabled:   false,
        navigationOptions:  {
                header: null,
        },
        tabBarOptions: {
                activeTintColor:        'tomato',
                inactiveTintColor:      'gray',
        },
});

var AppStackNav     = createStackNavigator ({
        'main-bottom-tab':                      MainBottomTabNav,


        'camera-roll-picker-screen':            CameraRollPickerScreen,

}, {
        initialRouteName:           'main-bottom-tab',
        headerLayoutPreset:         'center',
});

var RootSwitchNav       = createSwitchNavigator ({
        'auth-loading-screen':      AuthLoadingScreen,
        'app-stack':                AppStackNav,
}, {initialRouteName: 'auth-loading-screen'});


var AppContainer        = createAppContainer (RootSwitchNav);


function App (props) {

        console.log (`- app initial.2`);

        return (
                <AppContainer uriPrefix='rokcat://' />
        );
}



function AuthLoadingScreen (props) {
        useEffect (() => {
                console.log (`AuthLoadingScreen Ctx.Warning.13 ()`);
                props.navigation.navigate ('app-stack');
        }, []);

        let     indicatorText   = 'loading...';
        if (typeof progress === 'number') {
                indicatorText   = (progress < 1.0) ? 'updating...' : 'updated';
        }

        return (
                <View style={styles.container}>

                        <View>
                                <Text h3>testreact</Text>
                        </View>

                        <View>
                                {typeof progress !== 'number' ?
                                <BallIndicator color={'#ff0000'} /> : null}
                        </View>

                        <View>
                                <Text h4>{indicatorText}</Text>

                                {typeof progress === 'number' ?
                                progress < 1.0 ?
                                <ProgressBarAndroid style={styles.progressBar} styleAttr="Horizontal" indeterminate={false} progress={progress} /> :
                                <Button title="restart now" onPress={restartApk} buttonStyle={styles.restartButton} /> :
                                null }
                        </View>


                </View>
        );
}



function CameraRollPickerScreen (props) {
        return (
                <View style={styles.container}>
                        <CameraRollPicker groupTypes='Album' maximum={1} assetType='Photos' imagesPerRow={4} imageMargin={5} />
                </View>
        );
}


function SettingsScreen (props) {

        function navDidFocus (payload) {
                console.log (`navDidFocus.1 ()`);
        }

        async function switchToCameraRollPickerScr () {
                try {
                        let     granted;
                        try {
                                granted = await PermissionsAndroid.request (
                                        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                                );
                        } catch (err) {
                                console.log (err);
                        }
                        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                                console.log ('permission READ_EXTERNAL_STORAGE got');
                        }
                        else {
                                throw new Error ('failed');
                        }


                        props.navigation.push ('camera-roll-picker-screen');
                }
                catch (err) {
                }
        }


        return (
                <View style={styles.container}>
                        <NavigationEvents onDidFocus={navDidFocus}/>
                        <ScrollView>
                                <View style={styles.container}>
                                        <ListItem containerStyle={styles.container} leftIcon={{type: 'ionicon', name: 'md-eye', color: '#69520a'}} title={'test album'} onPress={switchToCameraRollPickerScr} chevron={true} />
                                </View>


                        </ScrollView>

                </View>
        );
}

SettingsScreen.navigationOptions    = function () {
        return {
                tabBarLabel:            'mine',
        };
};

CameraRollPickerScreen.navigationOptions     = function ({navigation}) {
        return {
                title:              'select pic',
        };
};



AuthLoadingScreen.navigationOptions  = function () {
        return {
                title:    'Loading',
        };
};



var styles   = StyleSheet.create ({
        viewContainer: {
                flex:               1,
        },
        container: {
                flex:               1,
        },
        progressBar: {
                flex:               1,
        },
        restartButton: {
                flex:               1,
        },
});

export default App;

