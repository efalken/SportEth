import { createContext } from "react";

const AuthContext = createContext({
  signer: null,
  provider: null,
  setSigner(newSigner) {},
  bettingContractReadOnly: null,
  oracleContractReadOnly: null,
  tokenContractReadOnly: null,
});

export default AuthContext;
