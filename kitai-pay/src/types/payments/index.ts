interface TokenDetail {
  amount: string;
  token: Token;
}

export interface PaymentItem {
  address: string;
  tokenDetails: TokenDetail[];
}

export interface PaymentItemInput extends PaymentItem {
  isOpen: boolean;
}

export interface Token {
  name: string;
  symbol: string;
  address: string;
  image: string;
}

export interface ListFooterProps {
  addAddress: () => void;
  onSubmit: () => void;
}

export interface ListHeaderProps {
  title: string;
}

export interface PaymentItemProps {
  onChangeAddress: (text: string, index: number) => void;
  toggleDropdown: (index: number) => void;
  addToken: (index: number) => void;
  removeToken: (index: number, tokenIndex: number) => void;
  onChangeAmount: (text: string, index: number, tokenIndex: number) => void;
  openSheet: (index: number, tokenIndex: number, token: Token) => void;
  removeAddress: (index: number) => void;
  index: number;
  item: PaymentItemInput;
}

export interface PaymentInputProps {
  data: PaymentItemInput[];
  setData: React.Dispatch<React.SetStateAction<PaymentItemInput[]>>;
  title: string;
  onSubmit: () => void;
}
