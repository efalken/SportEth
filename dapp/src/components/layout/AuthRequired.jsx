import { useEffect } from "react";
import { useAuthContext } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AuthRequired({ children }) {
  const { signer } = useAuthContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (signer) return;

    navigate("/");
  }, [signer]);

  return children;
}
