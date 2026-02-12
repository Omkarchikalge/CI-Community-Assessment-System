export function saveAuth(token, role) {
  localStorage.setItem("token", token);
  localStorage.setItem("role", role);
}

export function getRole() {
  return localStorage.getItem("role");
}

export function logout() {
  localStorage.clear();
  window.location.href = "/";
}
