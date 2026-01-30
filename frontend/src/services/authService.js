import api from "./api";

export const login = async (email, password) => {
  const res = await api.post("/login", { email, password });

  localStorage.setItem("token", res.data.access_token);
  localStorage.setItem("user", JSON.stringify(res.data.user));

  return res.data;
};

export const register = async (name, email, password, password_confirmation) => {
  const res = await api.post("/register", {
    name,
    email,
    password,
    password_confirmation,
  });

  localStorage.setItem("token", res.data.access_token);
  localStorage.setItem("user", JSON.stringify(res.data.user));

  return res.data;
};

export const logout = async () => {
  try {
    await api.post("/logout");
  } catch (e) {
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};
