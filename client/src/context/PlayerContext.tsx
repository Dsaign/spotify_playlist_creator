import { createContext, useState } from 'react';

interface PlayerContextInterface {
  isPlaying: boolean;
  togglePlaying: () => void;
  volume: number;
  setVolume: (volume: number) => void;
}

export const PlayerContext = createContext<PlayerContextInterface>({
  isPlaying: false,
  togglePlaying: () => {},
  volume: 20,
  setVolume: () => {},
});

export function PlayerContextProvider({ children }: React.PropsWithChildren) {
  const [isPlaying, setPlaying] = useState(false);
  const [volume, setVolume] = useState(20);

  function togglePlaying() {
    setPlaying((curr) => !curr);
  }

  return (
    <PlayerContext.Provider value={{ isPlaying, togglePlaying, volume, setVolume }}>
      {children}
    </PlayerContext.Provider>
  );
}
