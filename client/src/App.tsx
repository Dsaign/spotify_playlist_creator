const SERVER_HOST = import.meta.env.VITE_SERVER_HOST;
import VolumeSlider from './components/VolumeSlider/VolumeSlider.tsx';
import MusicBoard from './components/MusicBoard/MusicBoard.tsx';
import { useContext, useState, useEffect } from 'react';
import { PlayerContext, PlayerContextProvider } from './context/PlayerContext.tsx';
import { UserMenu, UserMenuProps } from './components/UserMenu/UserMenu.tsx';
import Logo from './assets/img/logo';

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
      <header
        className="fixed inset-x-0 top-0 z-50 bg-gray-900/90 backdrop-blur"
        style={{ padding: '10px' }}
      >
        <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">timbre</span>
              <Logo className="text-gray-900 dark:text-white" />
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

      <main className="pt-24">
        <VolumeSlider />
        <Toggler />
        <MusicBoard />
        <UserMenu data={data} />
        <a href="#" id="logout-link">
          Logout
        </a>
      </main>
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
