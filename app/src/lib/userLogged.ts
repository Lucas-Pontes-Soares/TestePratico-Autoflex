import { jwtDecode } from "jwt-decode";

interface MyTokenPayload {
  user_id: string;
  email: string;
  exp: number;
}

export function getLoggedUserId() {
  const token = localStorage.getItem("autoflex:auth");
  if (!token) return null;

  try {
    const decoded = jwtDecode<MyTokenPayload>(token);
    return decoded.user_id;
  } catch (error) {
    return null;
  }
}