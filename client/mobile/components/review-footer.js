import React from 'react';
import {StyleSheet, View, Image, Text, TouchableOpacity} from 'react-native';
import thumbs_down from '../assets/icons/thumbs-down.png';
import thumbs_up from '../assets/icons/thumbs-up.png';

class ReviewFooter extends React.Component {

    render() {
        const styles = StyleSheet.create({
            viewStyle: {
                flex: 1, flexDirection: 'row',
                height: 40,
                alignItems: 'center',
                justifyContent: 'flex-end',
                borderTopColor: '#666666',
                borderTopWidth: 1,
            },
            textStyle: {
                fontSize: 20,
                color: '#666666',
                marginRight: 20,
            },
            imageStyle: {
                width: 20, height: 20, margin: 10,
                tintColor: '#cdcdcd'
            }
        });

        return (
            <View style={styles.viewStyle}>
                <TouchableOpacity onPress={() => {
                    alert("itemId: " + this.props.itemId +
                        "\nitemType: " + this.props.itemType +
                        "\ntextId: " + this.props.textId +
                        "\ntextType: " + this.props.textType)
                }}>
                    <Image source={thumbs_up} style={styles.imageStyle}/>
                </TouchableOpacity>
                <Text style={styles.textStyle}>{this.props.up}</Text>
                <Image source={thumbs_down} style={styles.imageStyle}/>
                <Text style={styles.textStyle}>{this.props.down}</Text>
            </View>
        )
    }

}

export default ReviewFooter;
