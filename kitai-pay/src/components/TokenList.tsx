import React, { memo } from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import Animated, { Layout } from 'react-native-reanimated';
import { PaymentItemInput, Token } from '../types/payments';
import { Octicons } from '@expo/vector-icons';
import { COLORS } from '../constants';

interface TokenListProps {
  item: PaymentItemInput;
  index: number;
  onChangeAmount: (text: string, index: number, tokenIndex: number) => void;
  removeToken: (index: number, tokenIndex: number) => void;
  openSheet: (index: number, tokenIndex: number, token: Token) => void;
  addToken: (index: number) => void;
}

const TokenList = ({
  item,
  index,
  onChangeAmount,
  removeToken,
  openSheet,
  addToken,
}: TokenListProps) => {
  if (item.isOpen === false) {
    return null;
  }

  return (
    <Animated.FlatList
      data={item.tokenDetails}
      keyExtractor={(_, tokenIndex) => tokenIndex.toString()}
      layout={Layout.springify()}
      ListFooterComponent={
        <TouchableOpacity
          key={index}
          onPress={() => addToken(index)}
          style={styles.addTokenButton}>
          <Text style={styles.addTokenText}>Add token/currency</Text>
        </TouchableOpacity>
      }
      renderItem={({ item: tokenItem, index: tokenIndex }) => (
        <View style={styles.tokenRow} key={tokenIndex}>
          <TouchableOpacity
            style={styles.tokenButton}
            onPress={() => openSheet(index, tokenIndex, tokenItem.token)}>
            <Text style={styles.tokenButtonText}>{tokenItem.token.symbol}</Text>
            <Image
              source={{ uri: tokenItem.token.image }}
              style={styles.tokenButtonImage}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.addressInput}
            placeholder="Amount"
            keyboardType="numeric"
            onChangeText={text => onChangeAmount(text, index, tokenIndex)}
            value={tokenItem.amount}
          />
          <TouchableOpacity
            onPress={() => removeToken(index, tokenIndex)}
            style={styles.removeButton}>
            <Octicons name="trash" size={26} color="white" />
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

export default memo(TokenList);

const styles = StyleSheet.create({
  addressInput: {
    backgroundColor: COLORS.LIGHT_GREY,
    borderRadius: 16,
    padding: 10,
    flex: 1,
    color: COLORS.WHITE,
  },
  removeButton: {
    marginLeft: 10,
    backgroundColor: COLORS.LIGHT_GREY,
    borderRadius: 16,
    height: 45,
    width: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tokenRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 5,
    marginLeft: 50,
    marginRight: 20,
  },
  addTokenButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 50,
    backgroundColor: COLORS.LIGHT_GREY,
    marginTop: 8,
    borderRadius: 16,
    marginRight: 60,
    height: 40,
  },
  addTokenText: {
    color: COLORS.WHITE,
    fontSize: 14,
    textTransform: 'capitalize',
  },
  tokenButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: COLORS.LIGHT_GREY,
    borderRadius: 16,
    marginRight: 10,
    width: 120,
  },
  tokenButtonText: {
    color: COLORS.WHITE,
    marginRight: 10,
  },
  tokenButtonImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
});
