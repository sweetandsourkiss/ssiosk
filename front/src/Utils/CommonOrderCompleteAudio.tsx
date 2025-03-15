import React, { useRef } from "react";

const CommonOrderCompleteAudio: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const stopAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return (
    <div>
      <audio ref={audioRef} src="../output.mp3"></audio>
      <button onClick={playAudio}>Play</button>
      <button onClick={pauseAudio}>Pause</button>
      <button onClick={stopAudio}>Stop</button>
    </div>
  );
};

export default CommonOrderCompleteAudio;
