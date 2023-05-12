import { useAddress } from '@thirdweb-dev/react-native';
import { useState, useEffect } from 'react';

const useStart = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const address = useAddress();

  useEffect(() => {
    setIsLoggedIn(address !== undefined);
  }, [address]);

  return { isLoggedIn };
};

export default useStart;
