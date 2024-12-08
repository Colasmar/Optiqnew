const API_BASE_URL =
  window.location.hostname.includes("localhost")
    ? "http://localhost:3000"
    : window.location.origin + "/api";

export default API_BASE_URL;
