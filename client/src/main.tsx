import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './lib/index.css'
import App from './App.tsx'
import process from 'process'

const SERVER_HOST = import.meta.env.VITE_SERVER_HOST;
const SPOTIFY_URL = import.meta.env.VITE_SPOTIFY_URL;
const SPOTIFY_API_URL = import.meta.env.VITE_SPOTIFY_API_URL;

createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )

interface UserProfile {
  display_name: string;
  id: string;
  email: string;
  uri: string;
  href: string;
  images: { url: string }[];
  external_urls: { spotify: string };
}

// checkAuth();

async function _fetchToken(params: URLSearchParams) {
  return fetch(`${SPOTIFY_URL}/api/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
  });
}

async function _fetchClientID() {
  const response = await fetch(`${SERVER_HOST}/api/get_client_id`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (!response.ok) {
    throw new Error(`Erro ao buscar CLIENT_ID: ${response.status}`);
  }

  const data = await response.json();
  return data;
}

export async function checkAuth() {
  const accessToken = localStorage.getItem("access_token");
  const tokenExpiration = localStorage.getItem("token_expiration");
  const params = new URLSearchParams(window.location.search);
  const code = params.get("code");

  const clientData = await _fetchClientID();
  const CLIENT_ID = clientData?.client_id;

  if (!CLIENT_ID) {
    throw new Error("CLIENT_ID não definido!");
  }

  if (code && !(accessToken && tokenExpiration)) {
    // Code válido, carregando perfil...
    const accessToken = await getAccessToken(CLIENT_ID, code);
    const profile = await fetchProfile(accessToken);
    populateUI(profile);
  } else if (accessToken && tokenExpiration && Date.now() < parseInt(tokenExpiration)) {
    // Token ainda válido, carregando perfil...
    const profile = await fetchProfile(accessToken);
    populateUI(profile);
  } else if (localStorage.getItem("refresh_token")) {
    // Token expirado, tentando renovar...
    const newToken = await refreshAccessToken(CLIENT_ID);
    if (newToken) {
      const profile = await fetchProfile(newToken);
      populateUI(profile);
    } else {
      // Falha ao renovar token, redirecionando para login...
      redirectToAuthCodeFlow(CLIENT_ID);
    }
  } else {
    // Sem token válido, redirecionando para login...
    redirectToAuthCodeFlow(CLIENT_ID);
  }
}

async function refreshAccessToken(CLIENT_ID: string): Promise<string | null> {
  const refreshToken = localStorage.getItem("refresh_token");

  if (!refreshToken) return null;

  const params = new URLSearchParams();
  params.append("client_id", CLIENT_ID);
  params.append("grant_type", "refresh_token");
  params.append("refresh_token", refreshToken);

  const result = await _fetchToken(params);

  const responseData = await result.json();

  if (!result.ok) {
    console.error("Erro ao renovar token:", responseData);
    return null;
  }

  console.log("Novo token recebido:", responseData);

  localStorage.setItem("access_token", responseData.access_token);
  localStorage.setItem(
    "token_expiration",
    (Date.now() + responseData.expires_in * 1000).toString()
  );

  return responseData.access_token;
}

export async function redirectToAuthCodeFlow(CLIENT_ID: string) {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  localStorage.setItem("verifier", verifier);

  const params = new URLSearchParams();
  params.append("client_id", CLIENT_ID);
  params.append("response_type", "code");
  params.append("redirect_uri", "http://localhost:5173/callback");
  params.append("scope", "user-read-private user-read-email");
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);

  document.location = `${SPOTIFY_URL}/authorize?${params.toString()}`;
}

function generateCodeVerifier(length: number) {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

export async function getAccessToken(CLIENT_ID: string, code: string): Promise<string> {
  const verifier = localStorage.getItem("verifier");
  if (verifier === null) {
    throw new Error("Sem verifier");
  }

  const params = new URLSearchParams();
  params.append("client_id", CLIENT_ID);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", "http://localhost:5173/callback");
  params.append("code_verifier", verifier);

  const result = await _fetchToken(params);

  const responseData = await result.json();
  const { access_token } = responseData;

  localStorage.setItem("access_token", responseData.access_token);
  localStorage.setItem("refresh_token", responseData.refresh_token);
  localStorage.setItem(
    "token_expiration",
    (Date.now() + responseData.expires_in * 1000).toString()
  );

  return access_token;
}

async function fetchProfile(token: string): Promise<UserProfile> {
  const result = await fetch(`${SPOTIFY_API_URL}/v1/me`, {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
  });
  return result.json();
}

function raise(err: string): never {
  throw err;
}

function populateUI(profile: UserProfile) {
  const displayNameEl = document.getElementById("displayName") ?? raise("Não tem el #displayName");
  const avatarEl = document.getElementById("avatar") ?? raise("Não tem el #avatar");

  displayNameEl.innerText = profile.display_name;
  if (profile.images[0]) {
    const profileImage = new Image(200, 200);
    profileImage.src = profile.images[0].url;
    avatarEl.appendChild(profileImage);
  }
  profilePopulate(profile);
}

function profilePopulate(profile: UserProfile) {
  document.getElementById("id")!.innerText = profile.id;
  document.getElementById("email")!.innerText = profile.email;
  document.getElementById("uri")!.innerText = profile.uri;
  document.getElementById("uri")!.setAttribute("href", profile.external_urls.spotify);
  document.getElementById("url")!.innerText = profile.href;
  document.getElementById("url")!.setAttribute("href", profile.href);
  document.getElementById("imgUrl")!.innerText = profile.images[0]?.url ?? "(no profile image)";
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("token_expiration");
  redirectToAuthCodeFlow(CLIENT_ID);
}

document.getElementById("logout-link")?.addEventListener("click", (event) => {
  event.preventDefault();
  logout();
});
