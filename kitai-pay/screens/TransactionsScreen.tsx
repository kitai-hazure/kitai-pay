import React, { Component } from 'react';

import { View, FlatList, StyleSheet } from 'react-native';
import { ITransaction } from '../types/Transaction';
import TransactionCard from '../components/TransactionCard';

const TransactionsScreen = () => {
  //TODO: Make API CALL HERE
  let sampleTransactions = [
    {
      _id: '1',
      senderAddress: '0x1',
      recipientAddress: '0x2',
      amount: 1,
      token: 'KTP',
      date: '5/9/2023, 2:52:19 PM',
    },
    {
      _id: '2',
      senderAddress: '0x1',
      recipientAddress: '0x2',
      amount: 1,
      token: 'KTP',
      date: '5/9/2023, 2:52:19 PM',
    },
    {
      _id: '3',
      senderAddress: '0x1',
      recipientAddress: '0x2',
      amount: 1,
      token: 'KTP',
      date: '5/9/2023, 2:52:19 PM',
    },
  ];

  let userTransactions = sampleTransactions.map(transaction => {
    return transaction as ITransaction;
  });

  const renderItem = ({ item }: { item: ITransaction }) => {
    console.log(item);
    return <TransactionCard {...item} />;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={userTransactions}
        renderItem={renderItem}
        keyExtractor={item => item._id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default TransactionsScreen;
