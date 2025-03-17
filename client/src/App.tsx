import ErrorBoundary from './components/error_boundary';
import { getUserData } from './main'

import { useEffect, useState } from 'react';

function App() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const result = await getUserData();
      setData(result);
      console.log("DATA");
      console.log(result);
    }
    fetchData();
  }, []);

  return (
    <>
      <section id="profile">
        <ErrorBoundary>
          <h1>Minha conta:</h1>
          <h2>Logado como <span id="displayNames">{data?.display_name}</span></h2>
          <img id="avatar" src={data?.user_profile_image} alt="Profile Avatar" />
          <ul>
            <li>User ID: <span id="id">{data?.user_id}</span></li>
            <li>E-mail: <span id="email">{data?.user_email}</span></li>
            <li>Spotify URI: <a id="uri" href={data?.user_uri}>{data?.user_uri}</a></li>
            <li>Link: <a id="url" href={data?.user_spotify_link}>{data?.user_spotify_link}</a></li>
          </ul>
        </ErrorBoundary>
      </section>
      <a href="#" id="logout-link">Logout</a>
    </>
  )
}

export default App
