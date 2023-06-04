import {
  Image,
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { memo, useCallback, useEffect } from 'react';
import { AntDesign, Octicons } from '@expo/vector-icons';
import {
  ListFooterProps,
  ListHeaderProps,
  PaymentInputProps,
  PaymentItemProps,
  Token,
} from '../types/payments';
import { Text } from 'react-native';
import { CHAIN_DETAILS, DEVICE_WIDTH, COLORS } from '../constants';
import CustomBottomModalSheet from './CustomBottomModalSheet';
import BottomSheet, { BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { shortenedAddress } from '../helpers';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { Layout } from 'react-native-reanimated';
import TokenList from './TokenList';

const ListHeaderComponent = memo(({ title }: ListHeaderProps) => {
  return (
    <>
      <Text style={styles.title}>{title}</Text>
      <LinearGradient
        colors={['#000000', 'rgba(0,0,0,0.5)', 'rgba(0,0,0,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.titleBottomView}
      />
    </>
  );
});

const ListFooterComponent = memo(
  ({ addAddress, onSubmit }: ListFooterProps) => {
    return (
      <>
        <TouchableOpacity onPress={addAddress} style={styles.addAddressButton}>
          <Text style={styles.addAddressText}>Add Address</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSubmit} style={styles.onSubmitButton}>
          <Text style={styles.addAddressText}>Done</Text>
          <AntDesign name="checkcircleo" size={20} color="#c2f389" />
        </TouchableOpacity>
      </>
    );
  },
);

const PaymentItem = ({
  onChangeAddress,
  removeAddress,
  toggleDropdown,
  addToken,
  removeToken,
  onChangeAmount,
  openSheet,
  index,
  item,
}: PaymentItemProps) => {
  return (
    <>
      <View style={styles.addressRow}>
        <TextInput
          style={styles.addressInput}
          placeholder="Address"
          value={item.address}
          onChangeText={text => onChangeAddress(text, index)}
        />
        <TouchableOpacity
          onPress={() => removeAddress(index)}
          style={styles.removeButton}>
          <Octicons name="trash" size={26} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => toggleDropdown(index)}
          style={styles.toggleButton}>
          <AntDesign name="down" size={23} color="white" />
        </TouchableOpacity>
      </View>
      <TokenList
        addToken={() => addToken(index)}
        removeToken={removeToken}
        onChangeAmount={onChangeAmount}
        openSheet={openSheet}
        index={index}
        item={item}
      />
    </>
  );
};

const PaymentInput = ({
  data,
  setData,
  title,
  onSubmit,
}: PaymentInputProps) => {
  const [selectedData, setSelectedData] = React.useState<{
    index: number;
    tokenIndex: number;
    token: Token;
  } | null>(null);

  const modalSheetRef = React.useRef<BottomSheet>(null);

  const removeAddress = useCallback(
    (index: number) => {
      setData(prev => prev.filter((_, i) => i !== index));
    },
    [setData],
  );

  const toggleDropdown = useCallback(
    (index: number) => {
      setData(prev => {
        const newData = [...prev];
        newData[index].isOpen = !newData[index].isOpen;
        return newData;
      });
    },
    [setData],
  );

  const addAddress = useCallback(() => {
    setData(prev => [
      ...prev,
      {
        address: '',
        tokenDetails: [],
        isOpen: true,
      },
    ]);
  }, [setData]);

  const onChangeAddress = useCallback(
    (text: string, index: number) => {
      setData(prev => {
        const newData = [...prev];
        newData[index].address = text;
        return newData;
      });
    },
    [setData],
  );

  const addToken = useCallback(
    (index: number) => {
      setData(prev => {
        const newData = [...prev];
        newData[index].isOpen = true;
        newData[index].tokenDetails.push({
          amount: '',
          token: CHAIN_DETAILS.DEFAULT_TOKEN,
        });
        return newData;
      });
    },
    [setData],
  );

  const removeToken = useCallback(
    (index: number, tokenIndex: number) => {
      setData(prev => {
        const newData = [...prev];
        newData[index].tokenDetails = newData[index].tokenDetails.filter(
          (_, i) => i !== tokenIndex,
        );
        return newData;
      });
    },
    [setData],
  );

  const onChangeToken = useCallback(
    (token: Token, index?: number, tokenIndex?: number) => {
      if (index === undefined || tokenIndex === undefined) {
        modalSheetRef.current?.close();
        return;
      }
      setData(prev => {
        const newData = [...prev];
        newData[index].tokenDetails[tokenIndex].token = token;
        return newData;
      });
      modalSheetRef.current?.close();
    },
    [setData],
  );

  const openSheet = useCallback(
    (index: number, tokenIndex: number, token: Token) => {
      setSelectedData({
        index,
        tokenIndex,
        token,
      });
    },
    [setSelectedData],
  );

  const onChangeAmount = useCallback(
    (amount: string, index: number, tokenIndex: number) => {
      setData(prev => {
        const newData = [...prev];
        newData[index].tokenDetails[tokenIndex].amount = amount;
        return newData;
      });
    },
    [setData],
  );

  useEffect(() => {
    if (selectedData) {
      modalSheetRef.current?.expand();
    } else {
      modalSheetRef.current?.close();
    }
  }, [selectedData]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.FlatList
        data={data}
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        scrollEnabled={true}
        keyExtractor={(_, index) => index.toString()}
        style={styles.list}
        layout={Layout.springify()}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={<ListHeaderComponent title={title} />}
        ListFooterComponent={
          <ListFooterComponent addAddress={addAddress} onSubmit={onSubmit} />
        }
        renderItem={({ item, index }) => (
          <PaymentItem
            addToken={addToken}
            removeToken={removeToken}
            onChangeAmount={onChangeAmount}
            openSheet={openSheet}
            index={index}
            item={item}
            onChangeAddress={onChangeAddress}
            removeAddress={removeAddress}
            toggleDropdown={toggleDropdown}
          />
        )}
      />
      <CustomBottomModalSheet
        index={-1}
        ref={modalSheetRef}
        backgroundStyle={styles.modalSheetBackground}
        onClose={() => setSelectedData(null)}
        snapPoints={['40%', '60%']}>
        <BottomSheetFlatList
          data={CHAIN_DETAILS.TOKENS}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.bottomSheetButton}
              onPress={() =>
                onChangeToken(
                  item,
                  selectedData?.index,
                  selectedData?.tokenIndex,
                )
              }>
              <Image
                source={{ uri: item.image }}
                style={styles.bottomSheetIcon}
              />
              <View style={styles.bottomSheetTokenView}>
                <Text>{item.name}</Text>
                <Text style={styles.bottomSheetAddress}>
                  {shortenedAddress(item.address)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      </CustomBottomModalSheet>
    </SafeAreaView>
  );
};

export default PaymentInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
    width: DEVICE_WIDTH,
  },
  list: {
    width: DEVICE_WIDTH,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    padding: 20,
    paddingBottom: 5,
    backgroundColor: COLORS.BACKGROUND,
  },
  titleBottomView: {
    height: 20,
  },
  addressInput: {
    backgroundColor: COLORS.LIGHT_GREY,
    borderRadius: 16,
    padding: 10,
    flex: 1,
    color: COLORS.WHITE,
  },
  addressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 20,
    marginBottom: 5,
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
  toggleButton: {
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
  modalSheetBackground: {
    backgroundColor: COLORS.MODAL_BACKGROUND,
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
  onSubmitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.LIGHT_GREY,
    borderRadius: 16,
    height: 50,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 40,
  },
  addAddressButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.LIGHT_GREY,
    borderRadius: 16,
    height: 50,
    marginHorizontal: 20,
    marginTop: 20,
  },
  addAddressText: {
    color: COLORS.WHITE,
    fontSize: 16,
    marginRight: 10,
  },
  bottomSheetButton: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  bottomSheetAddress: {
    color: COLORS.LIGHT_GREY,
    fontSize: 12,
  },
  bottomSheetIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  bottomSheetTokenView: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginLeft: 20,
  },
});
