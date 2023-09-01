import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAccount, useNetwork } from "wagmi";
import { defaultNetwork } from "../../config";

export default function AuthRequired({ children }) {
  const { address } = useAccount();
  const { chain } = useNetwork();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (chain && chain.id == defaultNetwork.id && address) return;

    navigate(`/?redirect=${location.pathname}`);
  }, [chain, address]);

  return children;
}
