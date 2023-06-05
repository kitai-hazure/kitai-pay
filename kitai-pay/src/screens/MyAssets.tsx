import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants';
import { getTokenDetails, getDisplayAmount } from '../helpers/chain_map';

const MyAssetScreen = () => {
  const [loading, setLoading] = React.useState(false);
  const [listOfAssets, setListOfAssets] = React.useState([]);
  const AUTH_TOKEN =
    'eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJoYkg5RmlFMkZfcEFSY2RWeWxGaHNtVVY1blZfOEVGYXN4VlVyajVtRU9JIn0.eyJleHAiOjE2ODY0MTg4MDksImlhdCI6MTY4NTgxNDAwOSwianRpIjoiZGNjYjA2ZGYtOWM1NS00MjZhLTgyZGYtNGI5ZWM2MWExNGFjIiwiaXNzIjoiaHR0cDovL2tleWNsb2FrLmx1bml2ZXJzZS5jb206MzEwMC9yZWFsbXMvbm92YSIsInN1YiI6ImViNWNmODUxLTViYmUtNGUxMi04OGExLWUyOGI4N2JmYjZiMSIsInR5cCI6IkJlYXJlciIsImF6cCI6IjE2ODU4MTM1OTU2MzU5OTk0MzIiLCJzZXNzaW9uX3N0YXRlIjoiYzIzY2M3ZjMtYWViZi00ODMwLWFiNTYtZTZhZjkwYzE1MGYwIiwiYWNyIjoiMSIsInJlYWxtX2FjY2VzcyI6eyJyb2xlcyI6WyJkZWZhdWx0LXJvbGVzLW5vdmEiXX0sInNjb3BlIjoicHJvZmlsZSIsInNpZCI6ImMyM2NjN2YzLWFlYmYtNDgzMC1hYjU2LWU2YWY5MGMxNTBmMCIsInByZWZlcnJlZF91c2VybmFtZSI6IjE2ODU4MTM1OTU2MzU5OTk0MzI6N3l4a2ViZTh0Ympqdnkya2p3YmJuZGpkajZ2ZzJtN2poNmJnZmlsdGE3dmtkeTQza3premFrbXh2NjZwaG1xdSIsImdyYW50Ijp7InByb3RvY29scyI6IjIiLCJhY2NvdW50cyI6IjIiLCJibG9ja3MiOiIyIiwidHJhbnNhY3Rpb25zIjoiMiIsImFzc2V0cyI6IjIiLCJldmVudHMiOiIyIiwic3RhdHMiOiIyIiwid2ViaG9va3MiOiIyIn19.I1uJlgR2Nhewjae4CMhn6pSvJPXNecHULwolJZpVtLyAwLNK8XCPSx4KtEEwzkNp65lx9bl_b45-MW0Jio3qokoYecD5ihia7PjzssCiXKoxjZFVKWIB8VXY6Wj_oqbnfLxxcYghNJmlZdKy0jJQDnaCS7ukapkoEiV6M4gbO2azn7jqJ3X1laDEilLaYZ3iduoS5wPk-2AcRUTwbgtSj_DO5Il9o3hTjVsftj9YxfWmeC7Xwj8pLvDNgC-jK9wQQ0eTZ7DdRpbVh1kygNq650nyx0RDRie0qvCq21ahYJlGwE5ZnZOLqegZ81W-GKojBHUHkRsgJMRfwcy90J_uzg';

  React.useEffect(() => {
    const fetchListOfAssets = async () => {
      setLoading(true);
      const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
          Authorization: `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify({
          ownerAddress: '0xACEe0D180d0118FD4F3027Ab801cc862520570d1',
        }),
      };

      const response = await fetch(
        'https://web3.luniverse.io/v1/polygon/mumbai/token/listTokenBalanceByOwner',
        options,
      );

      const data = await response.json();
      console.log(data);
      setListOfAssets(data.data.items);
      setLoading(false);
    };
    fetchListOfAssets();
  }, []);
  return !loading ? (
    <View>
      <Text style={styles.header}>My Assets</Text>

      {listOfAssets.map((asset: any) => {
        const token = getTokenDetails(asset.contractAddress);
        return (
          <View style={styles.cardContainer}>
            <Image
              source={{
                uri: token.image,
              }}
              style={styles.image}
            />
            <Text> {token.name} </Text>
            <Text>
              {' '}
              <Text>{getDisplayAmount(asset.balance)}</Text> {token.symbol}{' '}
            </Text>
          </View>
        );
      })}
    </View>
  ) : (
    <View>
      <Text>Loading...</Text>
    </View>
  );
};

export default MyAssetScreen;

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
    padding: 20,
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
  },
});
