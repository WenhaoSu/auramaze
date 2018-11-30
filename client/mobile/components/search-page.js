import React from 'react';
import {StyleSheet, View, ScrollView, Dimensions, FlatList, RefreshControl} from 'react-native';
import TitleBar from "../components/title-bar";
import Art from "../art/art";


class SearchPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {searchArtizen: []};
        SearchPage.renderRow = SearchPage.renderRow.bind(this);
    }

    static renderRow(item) {
        return (
            <View style={{margin: 5}}>
                <View style={{
                    width: Dimensions.get('window').width * 300 / 375,
                    marginTop: 10, marginHorizontal: 10,
                    alignItems: 'center', justifyContent: 'center'
                }}>
                    {item[0]}
                </View>
                {item.length > 1 ?
                    <View
                        style={{
                            width: Dimensions.get('window').width * 300 / 375, height: 100,
                            marginHorizontal: 10, marginBottom: -20,
                            alignItems: 'center', justifyContent: 'center'
                        }}>
                        {item[1]}
                    </View> : null}
            </View>
        );
    }

    render() {

        const styles = StyleSheet.create({
            mainContext: {
                paddingHorizontal: 15, justifyContent: 'center',
                height: Dimensions.get('window').height
            },
            headerText: {
                fontSize: 20,
                color: '#666666',
                fontFamily: this.props.fontLoaded ?
                    ('century-gothic-regular') : 'Cochin',
            },
            bottomLine: {
                borderBottomColor: '#666666',
                borderBottomWidth: 1,
                padding: 5,
            },
            container: {
                paddingVertical: 5,
            }
        });

        return (
            <View style={styles.mainContext}>
                <ScrollView keyboardDismissMode='on-drag' style={{height: Dimensions.get('window').height}}>
                    {this.props.searchResult.haveArtizen ?
                        <View style={{marginHorizontal: 5}}>
                            <TitleBar titleText={"Artizen"} fontLoaded={this.props.fontLoaded}/>
                        </View> : null}
                    <FlatList data={this.props.searchResult.searchArtizen.toArray()}
                              horizontal={true}
                              showsHorizontalScrollIndicator={false}
                              renderItem={({item}) => SearchPage.renderRow(item)}
                              keyExtractor={(item, index) => index.toString()}/>
                    {this.props.searchResult.haveArtizen ? <View style={{height: 20}}/> : null}

                    {this.props.searchResult.haveArt ?
                        <View style={{marginHorizontal: 5}}>
                            <TitleBar titleText={"Art"} fontLoaded={this.props.fontLoaded}/>
                        </View> : null}
                    <FlatList data={this.props.searchResult.searchArt.toArray()}
                              renderItem={({item}) => item}
                              onEndReached={this.props.searchResult.loadMoreArtHandler}
                              onEndThreshold={0}
                              keyExtractor={(item, index) => index.toString()}/>
                    <View style={{height: 140}}/>
                </ScrollView>
            </View>
        );
    }
}

export default SearchPage;
