import React from 'react';
import {
    StyleSheet,
    View,
    FlatList,
    Dimensions,
} from 'react-native';
import {Constants} from 'expo';
import {withNavigation} from 'react-navigation';
import TopSearchBar from "../components/top-search-bar";
import ActivityCard from "../components/activity-card";
import config from "../config.json";
import {OrderedSet} from "../utils";
import {withAuth} from "../App";
import MessageCard from "../components/message-card";


class TimeLine extends React.Component {
    constructor(props) {
        super(props);
        this.state = {timeline: new OrderedSet(), refreshing: false, next: null};
        this.onEndReachedCalledDuringMomentum = true;
        this.refreshTimelineHandler = this.refreshTimelineHandler.bind(this);
        this.loadMoreTimelineHandler = this.loadMoreTimelineHandler.bind(this);
    }

    componentDidMount() {
        this._loadInitialState().done();
    }

    componentDidUpdate(prevProps) {
        const prevId = prevProps.auth.id;
        const {id} = this.props.auth;

        if (prevId !== id) {
            this._loadInitialState().done();
        }
    }

    async _loadInitialState() {
        try {
            const {id, token} = this.props.auth;
            if (id) {
                const timelineInfo = await fetch(`${config.API_ENDPOINT}/timeline`, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${token}`
                    },
                });
                const timelineInfoJson = await timelineInfo.json();
                this.setState({timeline: new OrderedSet(timelineInfoJson.data), next: timelineInfoJson.next});
            } else {
                this.setState({timeline: new OrderedSet(), next: null});
            }
        } catch (error) {
            console.log(error);
        }
    }

    async refreshTimelineHandler() {
        this.setState({refreshing: true});
        const {id, token} = this.props.auth;
        if (id) {
            const body = {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
            };
            if (this.state.timeline.size) {
                const min = this.state.timeline.toArray()[0].id;
                const timelineInfo = await fetch(`${config.API_ENDPOINT}/timeline?min=${min}`, body);
                const timelineInfoJson = await timelineInfo.json();

                if (timelineInfoJson.next) {
                    this.setState({timeline: new OrderedSet(timelineInfoJson.data), next: timelineInfoJson.next});
                } else {
                    this.setState(previousState => ({
                        timeline: previousState.timeline.unionFront(timelineInfoJson.data)
                    }));
                }
            } else {
                const timelineInfo = await fetch(`${config.API_ENDPOINT}/timeline`, body);
                const timelineInfoJson = await timelineInfo.json();
                this.setState({timeline: new OrderedSet(timelineInfoJson.data), next: timelineInfoJson.next});
            }
        } else {
            this.setState({timeline: new OrderedSet(), next: null});
        }
        this.setState({refreshing: false});
    }

    async loadMoreTimelineHandler() {
        const {id, token} = this.props.auth;
        if (!this.onEndReachedCalledDuringMomentum && this.state.next && id) {
            const response = await fetch(this.state.next, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
            });
            const responseJsonRaw = await response.json();
            this.setState(previousState => ({
                timeline: previousState.timeline.union(responseJsonRaw.data),
                next: responseJsonRaw.next,
            }));
            this.onEndReachedCalledDuringMomentum = true;
        }
    }

    render() {
        const styles = StyleSheet.create({
            mainStruct: {
                flex: 1,
                marginTop: Constants.statusBarHeight,
                height: Dimensions.get('window').height
            },
            backPage: {
                backgroundColor: '#cdcdcd',
                marginBottom: 40,
                height: Dimensions.get('window').height
            }
        });

        return (
            <View style={styles.mainStruct}>
                <View style={styles.backPage}>

                    <TopSearchBar navigation={this.props.navigation}
                                  fontLoaded={this.props.screenProps.fontLoaded}/>

                    {this.props.auth.id ? this.state.timeline.size ?
                        <FlatList data={this.state.timeline.toArray().concat([{}])}
                                  renderItem={({item}) => {
                                      return (
                                          item.art_id ?
                                              <ActivityCard
                                                  key={item.id}
                                                  fontLoaded={this.props.screenProps.fontLoaded}
                                                  authorId={item.author_id}
                                                  source={item.author_avatar}
                                                  artId={item.art_id}
                                                  artImage={item.art_image}
                                                  artName={item.art_name && item.art_name.default}
                                                  name={item.author_name && item.author_name.default}
                                                  content={item.content}
                                                  up={item.up}
                                                  down={item.down}
                                                  status={item.status}
                                                  created={item.created}
                                                  itemType="art"
                                                  textType="review"
                                                  itemId={item.art_id}
                                                  textId={item.id}/> :
                                              item.artizen_id ?
                                                  <ActivityCard
                                                      key={item.id}
                                                      fontLoaded={this.props.screenProps.fontLoaded}
                                                      authorId={item.author_id}
                                                      source={item.author_avatar}
                                                      artizenId={item.artizen_id}
                                                      artizenAvatar={item.artizen_avatar}
                                                      artizenName={item.artizen_name && item.artizen_name.default}
                                                      name={item.author_name && item.author_name.default}
                                                      content={item.content}
                                                      up={item.up}
                                                      down={item.down}
                                                      status={item.status}
                                                      created={item.created}
                                                      itemType="artizen"
                                                      textType="review"
                                                      itemId={item.artizen_id}
                                                      textId={item.id}/> :
                                                  <View style={{height: 200}}/>)
                                  }}
                                  onRefresh={this.refreshTimelineHandler}
                                  refreshing={this.state.refreshing}
                                  onEndReached={this.loadMoreTimelineHandler}
                                  onMomentumScrollBegin={() => {
                                      this.onEndReachedCalledDuringMomentum = false;
                                  }}
                                  keyExtractor={(item, index) => index.toString()}/> :
                        <FlatList data={[
                            <MessageCard fontLoaded={this.props.screenProps.fontLoaded}
                                         text={'Please follow arts/artizens to get their latest activities!'}
                                         onPress={() => {
                                             this.props.navigation.push('Explore');
                                         }}/>
                        ]}
                                  renderItem={({item}) => item}
                                  onRefresh={this.refreshTimelineHandler}
                                  refreshing={this.state.refreshing}
                                  keyExtractor={(item, index) => index.toString()}/> :
                        <FlatList data={[
                            <MessageCard fontLoaded={this.props.screenProps.fontLoaded}
                                         text={'Please log in to view timeline!'}
                                         onPress={() => {
                                             this.props.navigation.navigate('User');
                                         }}/>
                        ]}
                                  renderItem={({item}) => item}
                                  onRefresh={this.refreshTimelineHandler}
                                  refreshing={this.state.refreshing}
                                  keyExtractor={(item, index) => index.toString()}/>
                    }
                </View>
            </View>
        );
    }
}

export default withNavigation(withAuth(TimeLine));
