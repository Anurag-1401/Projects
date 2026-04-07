import { auth } from "../firebase/config.js";

export const storeToken = async () => {
  const user = auth.currentUser;

  if (!user) return null;

  const token = await user.getIdToken(true);

  sessionStorage.setItem("token", token);

  return token;
};