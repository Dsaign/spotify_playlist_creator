import { PlayerContext } from '../../context/PlayerContext';
import './VolumeSliderStyle.css';
import { useContext } from 'react';

function VolumeSlider() {
  const { volume, setVolume } = useContext(PlayerContext);

  // TODO: Implement volume control -> MusicBoardScript.tsx

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
  }

  return (
    <div id="sliders_container">
      <div className="w-32 flex-1">
        <p>
          Volume (<span>{volume}</span>):
        </p>
        <input
          id="rg_volume"
          className="slider"
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={handleChange}
        />
      </div>
    </div>
  );
}

export default VolumeSlider;
