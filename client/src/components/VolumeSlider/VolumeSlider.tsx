import './VolumeSliderStyle.css'
import { useEffect, useState } from 'react';

interface VolumeSliderProps {
    volume: number;
    onChange?: (volume: number) => void;
}

function VolumeSlider({ volume }: VolumeSliderProps) {
    
    const [currentVolume, setCurrentVolume] = useState(volume);

    // TODO: Implement volume control -> MusicBoardScript.tsx
    useEffect(() => {
        setCurrentVolume(volume);
    }, [volume]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
        const newVolume = parseInt(e.target.value);
        setCurrentVolume(newVolume);
    }
    
    return (
        <>
            <div id="sliders_container">
                <div className="volume">
                    <p>Volume (<span>{currentVolume}</span>):</p>
                    <input 
                        id="rg_volume"
                        className="slider" 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={currentVolume} 
                        onChange={handleChange} 
                    />
                </div>
            </div>
        </>
    )
}

export default VolumeSlider;