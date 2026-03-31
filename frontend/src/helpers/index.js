export function getAuthHeader() {
  const accessToken = localStorage.getItem("access_token");
  console.log("Auth Header:", accessToken);

  if (accessToken) {
    return { Authorization: `Bearer ${accessToken}` };
  } else {
    return {};
  }
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("auth");
}


export const isAuthenticated = () => {
  return localStorage.getItem("auth") === "true";
};

export const getAuthUser = () => {
  const user = localStorage.getItem("user");
  if (!user) return null;
  return JSON.parse(user);
};

export const formatPrice = (price) =>
  new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    maximumFractionDigits: 0,
  }).format(price);

export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-NP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

export const toTitleCase = (str) => {
  return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
};