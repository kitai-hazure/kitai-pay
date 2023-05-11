import React, { Component, useEffect } from 'react';

import { View, FlatList, StyleSheet, TextInput } from 'react-native';
import { ITransaction } from '../types/Transaction';
import TransactionCard from '../components/TransactionCard';
import { Text } from 'react-native-elements';

const TransactionsScreen = () => {
  const [loading, setLoading] = React.useState<boolean>(false);
  const [userTransactions, setUserTransactions] = React.useState<
    ITransaction[]
  >([]);
  const [filteredTransactions, setFilteredTransactions] = React.useState<
    ITransaction[]
  >([]);
  const [query, setQuery] = React.useState<string>('');

  let userWalletAddress = '0x1'; //TODO: Get this from context
  useEffect(() => {
    console.log('use Effect ran');
    //TODO: Make API CALL HERE
    const sampleTransactions = [
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
        recipientAddress: '0x3',
        amount: 1,
        token: 'KTP',
        date: '5/9/2023, 2:52:19 PM',
      },
      {
        _id: '3',
        senderAddress: '0x1',
        recipientAddress: '0x5',
        amount: 1,
        token: 'KTP',
        date: '5/9/2023, 2:52:19 PM',
      },
    ];
    const temp: ITransaction[] = sampleTransactions.map(transaction => {
      return transaction as ITransaction;
    });
    setUserTransactions(temp);
    setFilteredTransactions(temp);
  }, []);

  const renderItem = ({ item }: { item: ITransaction }) => {
    return <TransactionCard {...item} />;
  };

  const handleSearch = (text: string) => {
    if (text.length != 0) {
      const newData = userTransactions.filter(item => {
        const itemData =
          item.senderAddress === userWalletAddress
            ? item.recipientAddress.toLowerCase()
            : item.senderAddress.toLowerCase();
        const textData = text.toLowerCase();

        return itemData.indexOf(textData) > -1;
      });
      setFilteredTransactions(newData);
      setQuery(text);
    } else {
      setFilteredTransactions(userTransactions);
      setQuery(text);
    }
  };

  return (
    <View style={styles.container}>
      <View>
        <Text style={{ color: 'white', fontSize: 25, margin: 5, padding: 10 }}>
          Transactions
        </Text>
      </View>
      <View
        style={{ backgroundColor: 'white', marginLeft: 10, marginRight: 10 }}>
        <TextInput
          value={query}
          placeholder="Search based on wallet address"
          underlineColorAndroid="transparent"
          onChangeText={text => handleSearch(text)}
        />
      </View>
      <FlatList
        data={filteredTransactions}
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
  textInputStyle: {
    height: '40',
    width: '80%',
    borderWidth: 1,
    paddingLeft: 20,
    margin: 5,
    borderColor: 'red',
    backgroundColor: 'white',
  },
});

export default TransactionsScreen;
