import { StyleSheet, View, Text } from 'react-native';
import { ITransaction } from '../types/Transaction';
import { ListItem, Avatar, Icon } from 'react-native-elements';
import React, { Component } from 'react';
import { GlassView } from '@metafic-co/react-native-glassmorphism';

const TransactionCard = (props: ITransaction) => {
  let userWalletAddress = '0x1'; //TODO: Get this from context
  // console.log('called');
  return (
    <View style={styles.container}>
      {/* <Text style={styles.item}>Hello</Text> */}

      <ListItem
        key={props._id}
        style={{ borderColor: 'blue' }}
        containerStyle={{ backgroundColor: 'transparent' }}>
        {/* <Avatar source={{ uri: 'https://picsum.photos/200' }} /> */}
        <ListItem.Content
          style={{
            flex: 4,
          }}>
          <ListItem.Title style={{ fontWeight: 'bold', color: 'white' }}>
            {props.senderAddress === userWalletAddress
              ? props.recipientAddress
              : props.senderAddress}
          </ListItem.Title>
          <ListItem.Subtitle style={{ fontWeight: 'bold', color: 'white' }}>
            {props.date}
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Content style={{}}>
          <ListItem.Title style={{ fontWeight: 'bold', color: 'white' }}>
            {props.amount} {props.token}
          </ListItem.Title>
        </ListItem.Content>
        <ListItem.Chevron
          iconProps={{
            name: 'rowing',
            color: props.senderAddress === userWalletAddress ? 'red' : 'green',
          }}
        />
      </ListItem>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'red',
    marginLeft: 5,
    marginRight: 5,
    marginTop: 1,
    padding: 10,
  },
  item: {
    color: '#FFF',
  },
});

export default TransactionCard;
