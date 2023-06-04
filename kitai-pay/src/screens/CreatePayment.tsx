import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useRef, useState } from 'react';
import { PaymentItemInput } from '../types/payments';
import PaymentInput from '../components/PaymentInput';
import { DEVICE_WIDTH, ROUTES } from '../constants';
import { ErrorSheet, LoadingButton, SuccessModal } from '../components';
import { COLORS } from '../constants';
import { StackNavigationProps, navigate } from '../helpers';
import { MainNavigatorParamList } from '../navigation';
import { usePaymentContract } from '../hooks';
import { useDispatch } from 'react-redux';
import { setError } from '../redux';
// import { convertToPaymentInput } from '../helpers';

const tempInput = {
  receivers: [
    {
      amount: 0 * 1e18,
      token: '0x0000000000000000000000000000000000000000',
      user: '0xACEe0D180d0118FD4F3027Ab801cc862520570d1',
    },
    {
      amount: 0.00016 * 1e18,
      token: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
      user: '0xACEe0D180d0118FD4F3027Ab801cc862520570d1',
    },
  ],
  senders: [
    {
      amount: 0 * 1e18,
      token: '0x0000000000000000000000000000000000000000',
      user: '0xACEe0D180d0118FD4F3027Ab801cc862520570d1',
    },
    {
      amount: 0.00016 * 1e18,
      token: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
      user: '0xACEe0D180d0118FD4F3027Ab801cc862520570d1',
    },
  ],
};

type CreatePaymentProps = StackNavigationProps<
  MainNavigatorParamList,
  'CREATE_PAYMENT'
>;

const CreatePayment = ({ navigation }: CreatePaymentProps) => {
  const [senderDetails, setSenderDetails] = useState<PaymentItemInput[]>([]);
  const [receiverDetails, setReceiverDetails] = useState<PaymentItemInput[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [description, setDescription] = useState('');

  const ref = useRef<FlatList>(null);

  const { addPayment, contract } = usePaymentContract();

  const slideToFront = () => {
    ref.current?.scrollToIndex({ index: 0 });
  };

  const slideToLast = () => {
    ref.current?.scrollToIndex({ index: 2 });
  };

  const slideToMiddle = () => {
    ref.current?.scrollToIndex({ index: 1 });
  };

  const navigateOnSuccess = () => {
    setSuccess(false);
    navigate({ navigation, routeName: ROUTES.DASHBOARD });
  };

  const dispatch = useDispatch();

  // const { data } = useContractRead(contract, 'getPaymentDetails', [3 * 1e18]);

  // console.log('data', data);

  const onSubmit = async () => {
    console.log('submitted');
    setLoading(true);
    console.log('payment created');
    console.log('description', description);
    const paymentId = 1;
    try {
      await addPayment({
        description: description,
        hasAddedShare: false,
        // input: convertToPaymentInput({
        //   senderDetails,
        //   receiverDetails,
        // }),
        input: tempInput,
        paymentId: paymentId,
      });
      setLoading(false);
      setSuccess(true);
    } catch (error: any) {
      console.log('error', error);
      dispatch(
        setError({
          hasError: true,
          errorMessage: error.message,
        }),
      );
    }
  };

  return (
    <View style={styles.container}>
      <ErrorSheet />
      <FlatList
        ref={ref}
        horizontal
        pagingEnabled
        renderItem={({ item }) => item}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(_, index) => index.toString()}
        data={[
          <>
            <View style={styles.centerContainer}>
              <Text style={styles.title}>Creating New Payment</Text>
              <TextInput
                placeholder="Payment Description"
                style={styles.paymentDescriptionInput}
                onChangeText={text => setDescription(text)}
              />
              <TouchableOpacity
                onPress={slideToMiddle}
                style={styles.buttonSmall}>
                <Text style={styles.buttonText}>Edit Sender Details</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={slideToLast}
                style={styles.buttonSmall}>
                <Text style={styles.buttonText}>Edit Receiver Details</Text>
              </TouchableOpacity>
              <LoadingButton
                buttonText="Create Payment"
                loading={loading}
                onSubmit={onSubmit}
              />
            </View>
            <SuccessModal
              successfull={success}
              next={navigateOnSuccess}
              successText="Payment Created Successfully!"
            />
          </>,
          <PaymentInput
            data={senderDetails}
            onSubmit={slideToFront}
            setData={setSenderDetails}
            title="Sender's Details"
          />,
          <PaymentInput
            data={receiverDetails}
            onSubmit={slideToFront}
            setData={setReceiverDetails}
            title="Receiver's Details"
          />,
        ]}
      />
    </View>
  );
};

export default CreatePayment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.BACKGROUND,
  },
  centerContainer: {
    width: DEVICE_WIDTH,
  },
  buttonSmall: {
    backgroundColor: COLORS.LIGHT_GREY,
    borderRadius: 16,
    marginHorizontal: 20,
    marginVertical: 15,
    height: 50,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.WHITE,
    textAlign: 'center',
    marginVertical: 40,
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: 16,
  },
  paymentDescriptionInput: {
    backgroundColor: COLORS.LIGHT_GREY,
    borderRadius: 16,
    marginHorizontal: 20,
    marginVertical: 15,
    height: 50,
    paddingHorizontal: 20,
    fontSize: 16,
  },
});
