import { useEffect } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
export default function AuthRequired({ children }) {
  const { signer } = useAuthContext();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (signer) return;

    navigate(`/?redirect=${location.pathname}`);
  }, [signer]);

  return children;
}
