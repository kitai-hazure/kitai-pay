import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { selectAuthState } from '../redux';
import { COLORS } from '../constants';
import { ScrollView } from 'react-native-gesture-handler';
import { shortenedAddress, shortenedSenderID } from '../helpers';

const PaymentHistoryScreen = () => {
  const [paymentHistory, setPaymentHistory] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  const { token } = useSelector(selectAuthState);
  const PAYMENT_HISTORY_QUERY = `
        query Query {
            getPayments {
            _id
            paymentID
            receivers {
                user
                token
                amount
            }
            senders {
                amount
                token
                user
            }
            }
        }
  `;
  React.useEffect(() => {
    const fetchUserPaymentHistory = async () => {
      setLoading(true);
      const res = await fetch('http://192.168.29.124:8080/graphql', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: PAYMENT_HISTORY_QUERY,
        }),
      });

      const jsonData = await res.json();
      console.log('jsonData', jsonData.data.getPayments);
      setPaymentHistory(jsonData.data.getPayments);
      setLoading(false);
    };

    fetchUserPaymentHistory();
  }, [PAYMENT_HISTORY_QUERY, token]);

  return !loading ? (
    <ScrollView>
      <Text style={styles.header}>Payment History Screen</Text>
      {paymentHistory.map((payment: any) => (
        <View key={payment._id} style={styles.cardContainer}>
          <Text style={styles.boldText}>Payment ID: {payment.paymentID}</Text>
          <Text style={styles.boldText2}>Senders:</Text>
          {payment.senders.map((sender: any) => (
            <View key={sender.user} style={styles.subCardContainer}>
              <Text style={styles.subCardText}>
                ID:
                <Text style={styles.subCardVal}>
                  {shortenedSenderID(sender.user)}
                </Text>
              </Text>
              <Text style={styles.subCardText}>
                Amount:
                <Text style={styles.subCardVal}>{sender.amount}</Text>
              </Text>
              <Text style={styles.subCardText}>
                Token:
                <Text style={styles.subCardVal}>
                  {shortenedAddress(sender.token)}
                </Text>
              </Text>
            </View>
          ))}
          <Text style={styles.boldText2}>Receivers:</Text>
          {payment.receivers.map((receiver: any) => (
            <View key={receiver.user} style={styles.subCardContainer}>
              <Text style={styles.subCardText}>
                ID:{' '}
                <Text style={styles.subCardVal}>
                  {shortenedSenderID(receiver.user)}
                </Text>
              </Text>
              <Text style={styles.subCardText}>
                Amount: <Text style={styles.subCardVal}>{receiver.amount}</Text>
              </Text>

              <Text style={styles.subCardText}>
                Token:{' '}
                <Text style={styles.subCardVal}>
                  {shortenedAddress(receiver.token)}
                </Text>
              </Text>
            </View>
          ))}
        </View>
      ))}
    </ScrollView>
  ) : (
    <View>
      <Text>Loading...</Text>
    </View>
  );
};

export default PaymentHistoryScreen;

const styles = StyleSheet.create({
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    margin: 20,
    marginBottom: 10,
  },
  cardContainer: {
    margin: 20,
    borderRadius: 20,
    backgroundColor: COLORS.LIGHT_GREY,
    shadowColor: COLORS.WHITE,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
    padding: 8,
  },
  boldText2: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'black',
  },
  subCardContainer: {
    padding: 8,
    margin: 10,
    width: '90%',
    borderRadius: 4,
    backgroundColor: COLORS.LIGHT_GREY,
    shadowColor: COLORS.WHITE,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  subCardText: {
    fontWeight: 'bold',
    fontSize: 10,
    color: 'black',
  },
  subCardVal: {
    fontWeight: 'bold',
    fontSize: 10,
    color: 'white',
  },
});
