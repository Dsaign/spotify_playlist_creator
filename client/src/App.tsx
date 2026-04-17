const SERVER_HOST = import.meta.env.VITE_SERVER_HOST;
import VolumeSlider from './components/VolumeSlider/VolumeSlider.tsx';
import MusicBoard from './components/MusicBoard/MusicBoard.tsx';
import { useContext, useState, useEffect } from 'react';
import { PlayerContext, PlayerContextProvider } from './context/PlayerContext.tsx';
import { UserMenu, UserMenuProps } from './components/UserMenu/UserMenu.tsx';

export default function App() {
  const [data, setData] = useState<UserMenuProps['data']>(undefined);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(`${SERVER_HOST}/api/user/get`);
        if (!response.ok) {
          throw new Error(`Erro na requisição: ${response.status}`);
        }
        const userData = await response.json();
        console.log('User Data:', userData); // Debug
        setData(userData);
      } catch (error) {
        console.error('Erro ao buscar os dados do usuário:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <PlayerContextProvider>
      <header className="absolute inset-x-0 top-0 z-50 bg-gray-900/90 backdrop-blur">
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <img
                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
                alt=""
                className="h-8 w-auto"
              />
            </a>
          </div>
          <div className="lg:flex lg:gap-x-12 lg:flex-auto">
            <a href="#" className="text-sm/6 font-semibold text-white">
              Product
            </a>
            <a href="#" className="text-sm/6 font-semibold text-white">
              Features
            </a>
            <a href="#" className="text-sm/6 font-semibold text-white">
              Marketplace
            </a>
            <a href="#" className="text-sm/6 font-semibold text-white">
              Company
            </a>
          </div>
        </nav>
      </header>
      <VolumeSlider />

      <Toggler />
      <MusicBoard />

      <UserMenu data={data} />

      <a href="#" id="logout-link">
        Logout
      </a>
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
