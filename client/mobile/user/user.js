import React from 'react';
import {
    StyleSheet,
    View,
    Dimensions,
    TouchableWithoutFeedback,
    Keyboard, AsyncStorage
} from 'react-native';
import {TabView, TabBar, SceneMap} from 'react-native-tab-view';
import UserIndex from "./user-index";
import BlankUser from "./blank-user";
import {Constants} from "expo";

class User extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            pageIsSign: true,
            hasAuthorized: false,
            index: 0,
            routes: [
                {key: 'profile', title: 'First'},
                {key: 'art', title: 'Second'},
                {key: 'artizen', title: 'Third'},
            ],
        };
    }

    componentDidMount() {

        AsyncStorage.getItem('isAuthorized', null).then((value) => {
            if (value === undefined || value === 'false') {
                AsyncStorage.multiSet([
                    ['isAuthorized', 'false'],
                    ["username", 'undefined'],
                    ["token", 'undefined'],
                    ["id", 'undefined'],
                ]);
                this.setState({hasAuthorized: false});
            } else {
                this.setState({hasAuthorized: true});
            }
        });
    };

    render() {

        let _toLogOut = () => {
            AsyncStorage.multiSet([
                ['isAuthorized', 'false'],
                ["username", 'undefined'],
                ["token", 'undefined'],
                ["id", 'undefined'],
            ]).then(this.setState({hasAuthorized: false}));
        };

        let _toLogIn = () => {
            this.setState({hasAuthorized: true});
        };

        const ProfileRoute = () => (
            <UserIndex screenProps={{toLogOut: _toLogOut}}/>
        );

        const ArtRoute = () => (
            <View style={{
                backgroundColor: 'white', scene: {
                    flex: 1,
                }
            }}/>
        );

        const ArtizenRoute = () => (
            <View style={{
                backgroundColor: 'white', scene: {
                    flex: 1,
                }
            }}/>
        );

        if (this.state.hasAuthorized !== true) {
            return (
                <BlankUser screenProps={{toLogIn: _toLogIn}}/>
            );
        } else {
            return (
                <TabView
                    navigationState={this.state}
                    renderScene={SceneMap({
                        profile: ProfileRoute,
                        art: ArtRoute,
                        artizen: ArtizenRoute
                    })}
                    onIndexChange={index => this.setState({index})}
                    renderTabBar={props =>
                        <TabBar
                            {...props}
                            indicatorStyle={{backgroundColor: 'black'}}
                            style={{backgroundColor: 'white'}}
                            labelStyle={{color: '#666666'}}
                        />
                    }
                    initialLayout={{
                        width: Dimensions.get('window').width,
                    }}
                    style={{paddingTop: Constants.statusBarHeight,}}
                />
            )
        }

    }
}

export default User;
