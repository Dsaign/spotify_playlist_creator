const SERVER_HOST = import.meta.env.VITE_SERVER_HOST;
import VolumeSlider from './components/VolumeSlider/VolumeSlider.tsx';
import MusicBoard from './components/MusicBoard/MusicBoard.tsx';
import { useContext, useState } from 'react';
import { PlayerContext, PlayerContextProvider } from './context/PlayerContext.tsx';

export default function App() {
  // const [data, setData] = useState<any>(null);

  // useEffect(() => {
  //   const fetchUserData = async () => {
  //     try {
  //       const response = await fetch(`${SERVER_HOST}/api/user/get`);
  //       if (!response.ok) {
  //         throw new Error(`Erro na requisição: ${response.status}`);
  //       }
  //       const userData = await response.json();
  //       console.log("User Data:", userData); // Debug
  //       setData(userData);
  //     } catch (error) {
  //       console.error("Erro ao buscar os dados do usuário:", error);
  //     }
  //   };

  //   fetchUserData();
  // }, []);

  return (
    <PlayerContextProvider>
      <VolumeSlider />
      <Toggler />
      <MusicBoard />

      {/* <section id="profile">
        <h1>Minha conta:</h1>
        <h2>Logado como <span id="displayNames">{data?.display_name || "Carregando..."}</span></h2>
        {data?.user_profile_image ? (
          <img id="avatar" src={data.user_profile_image} alt="Profile Avatar" />
        ) : (
          <p>Carregando imagem...</p>
        )}
        <ul>
          <li>User ID: <span id="id">{data?.user_id || "Carregando..."}</span></li>
          <li>E-mail: <span id="email">{data?.user_email || "Carregando..."}</span></li>
          <li>Spotify URI: <a id="uri" href={data?.user_uri}>{data?.user_uri || "Carregando..."}</a></li>
          <li>Link: <a id="url" href={data?.user_spotify_link}>{data?.user_spotify_link || "Carregando..."}</a></li>
        </ul>
      </section>
      <a href="#" id="logout-link">Logout</a> */}
    </PlayerContextProvider>
  );
}

//
//
//
//

function Toggler() {
  const { togglePlaying } = useContext(PlayerContext);
  return <button onClick={togglePlaying}>Toggle music playing</button>;
}
