import { useContract, useContractWrite } from '@thirdweb-dev/react-native';
import { CHAIN_DETAILS } from '../constants';
import { useDispatch } from 'react-redux';
import { setError } from '../redux';

export interface PaymentInputUnit {
  user: string;
  token: string;
  amount: number;
}

export interface PaymentInputStruct {
  senders: PaymentInputUnit[];
  receivers: PaymentInputUnit[];
}

interface CreatePaymentInput {
  paymentId: number;
  input: PaymentInputStruct;
  description: string;
  hasAddedShare: boolean;
}

const usePaymentContract = () => {
  const { contract, isLoading, error } = useContract(
    CHAIN_DETAILS.CONTRACT_ADDRESS,
    CHAIN_DETAILS.CONTRACT_ABI,
  );
  const { mutateAsync: createPayment } = useContractWrite(
    contract,
    'createPayment',
  );

  const dispatch = useDispatch();

  if (error && !isLoading) {
    dispatch(
      setError({
        hasError: true,
        errorMessage:
          // @ts-ignore
          error?.message || 'Error loading contract please try again.',
      }),
    );
  }

  const addPayment = async (data: CreatePaymentInput) => {
    console.log('This function is being called', data);
    const result = await createPayment({
      args: [data.paymentId, data.input, data.description, data.hasAddedShare],
      overrides: {
        gasLimit: 1000000,
      },
    });
    console.log('RESULT: ', result);
  };

  return { addPayment, contract };
};

export default usePaymentContract;
