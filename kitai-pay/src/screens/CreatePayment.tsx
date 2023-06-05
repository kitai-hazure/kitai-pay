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
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthState, setError } from '../redux';
import { convertToPaymentInput } from '../helpers';

const tempInput = {
  receivers: [
    {
      amount: 0.0000001 * 1e18,
      token: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
      user: '0xC5aE504A241ce3D4948213925f7c57783E51CBD1',
    },
  ],
  senders: [
    {
      amount: 0.0000001 * 1e18,
      token: '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889',
      user: '0x73b794FcA37Dc5951dcdb2674401C299f9775493',
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

  const { token } = useSelector(selectAuthState);

  // const { data } = useContractRead(contract, 'getPaymentDetails', [3 * 1e18]);

  // console.log('data', data);

  const onSubmit = async () => {
    console.log('submitted');
    setLoading(true);
    console.log('payment created');
    console.log('description', description);
    // const paymentId = 10;
    try {
      // backend call that adds the signature
      fetch('http://192.168.29.124:8080/graphql', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: `mutation Mutation($paymentInput: PaymentInput!) {
              createPayment(payment_input: $paymentInput)
            }
          `,
          variables: {
            paymentInput: tempInput,
          },
        }),
      }).then(res => {
        if (res.status !== 200) {
          throw new Error('Something went wrong');
        }
        res.json().then(async data => {
          const paymentIDFromBackend = data.data.createPayment;
          // TODO ADD AWAIT HERE
          addPayment({
            description: description,
            hasAddedShare: true,
            input: convertToPaymentInput({
              senderDetails,
              receiverDetails,
            }),
            // input: tempInput,
            paymentId: paymentIDFromBackend,
          });
          setTimeout(() => {
            setLoading(false);
            setSuccess(true);
          }, 15000);
        });
      });
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
