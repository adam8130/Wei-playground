import { Play, Pause, Maximize, Infinity, Volume2, Youtube } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const playlist = [
  { name: "路上野花", file: "路上野花.mp4" },
  { name: "To be continued", file: "To be continued.mp4" },
  { name: "Marcin coverd by Wei", file: "Marcin coverd by Wei.mov" },
  { name: "一路向北.mp4", file: "一路向北.mp4" },
  { name: "夠愛.mp4", file: "夠愛.mp4" },
  { name: "結界師 -Take over destiny.mov", file: "結界師 -Take over destiny.mov" },
  { name: "Pure evil.mp4", file: "Pure evil.mp4" },
  { name: "WEI 國二冠軍影片 Solo.mp4", file: "WEI 國二冠軍影片 Solo.mp4" },
  { name: "WEI 國二冠軍影片.mp4", file: "WEI 國二冠軍影片.mp4" },
  { name: "No name.mp4", file: "No name.mp4" },
  { name: "Wei Drift", file: "Wei Drift.mp4" },
];

function App() {
  const videoRef = useRef(null);
  const searchMenuRef = useRef(null);

  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isSearchMenuOpen, setIsSearchMenuOpen] = useState(false);
  const [config, setConfig] = useState({
    play: false,
    loop: false,
    maximize: false,
    currentPlaying: '路上野花',
  });

  const handlePlayClick = () => {
    if (videoRef.current) {
      if (config.play) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setConfig((prev) => ({ ...prev, play: !prev.play, pause: false }));
    }
  };

  const handleMaxmizeClick = () => {
    // do fullscreen
    if (videoRef.current) {
      if (config.maximize) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
      setConfig((prev) => ({ ...prev, maximize: !prev.maximize }));
    }
  };

  const handleInfinityClick = () => {
    if (videoRef.current) {
      videoRef.current.loop = !videoRef.current.loop;
      setConfig((prev) => ({ ...prev, loop: !prev.loop }));
    }
  };

  const handleChangeSong = (item) => {
    if (videoRef.current) {
      videoRef.current.src = require(`./assets/${item.file}`);
      videoRef.current.play();
      setConfig({ play: true, loop: false, currentPlaying: item.name, maximize: false });
    }

    setIsSearchMenuOpen(false);
    setIsVideoLoading(true)
  };

  const handleProgressChange = (e) => {
    const video = videoRef.current;
    if (!video) return;

    const percent = parseFloat(e.target.value);
    video.currentTime = (percent / 100) * video.duration;
    setProgress(percent);
  };

  const handleVolumeChange = (e) => {
    const video = videoRef.current;
    if (!video) return;

    const vol = parseFloat(e.target.value);
    video.volume = vol;
    setVolume(vol);
  };

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      video.setAttribute('webkit-playsinline', 'true');
      video.setAttribute('playsinline', 'true');
    }

    const handleFullscreenChange = () => {
      const isFullScreen = document.fullscreenElement === video;
      setConfig((prev) => ({ ...prev, maximize: isFullScreen }));
    };

    const handleTimeUpdate = () => {
      const percent = (video.currentTime / video.duration) * 100;
      setProgress(isNaN(percent) ? 0 : percent);
    };

    const handleLoaded = () => {
      setIsVideoLoading(false)
    }

  
  
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("canplay", handleLoaded);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("canplay", handleLoaded);
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (
        searchMenuRef.current &&
        !searchMenuRef.current.contains(e.target)
      ) {
        setIsSearchMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-screen h-[100svh] flex flex-col gap-y-[20px] justify-center items-center bg-[#1A1C2B] p-8">
      <h1 className="text-[#B9BFF5] font-[800] text-[26px]">
        Select a song u like 😘
      </h1>

      <div className="w-full flex flex-col items-center relative">
        <input
          className="w-[80%] max-w-[400px] h-[35px] rounded-md bg-[#1A1C2B] border border-[#B9BFF5] text-[#B9BFF5] px-2 outline-none"
          placeholder="search a song or just click on it !"
          onClick={() => setIsSearchMenuOpen(true)}
        />
        {isSearchMenuOpen && (
          <div ref={searchMenuRef} className="w-[80%] max-w-[400px] absolute top-[35px] flex flex-col gap-2 bg-[#252738] p-4 rounded-md z-[100]">
            {playlist.map((item, index) => (
              <div
                key={index}
                className="text-[#B9BFF5] text-[16px] cursor-pointer hover:text-[#FF36C9] transition-colors duration-300"
                onClick={() => handleChangeSong(item)}
              >
                {item.name}
              </div>
            ))}
          </div>
        )}
      </div>

      <span className="text-[20px] text-[#B9BFF5]">{config.currentPlaying}</span>

      <div className="flex flex-col items-center gap-4 relative">
        {isVideoLoading && (
          <div className="absolute w-[140%] h-[45svh] flex justify-center items-center bg-[#252738] p-3">
            <span className="text-[18px] text-white animate-pulse">Loading...</span>
          </div>
        )}
        <video
          ref={videoRef}
          autoPlay
          className="max-h-[52svh]"

          src={require("./assets/路上野花.mp4")}
        />
        <div className="w-full flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <div className="w-[70%] flex gap-x-2">
            <Youtube className="text-[#B9BFF5]" />
            <input
              type="range"
              min={0}
              max={100}
              value={progress}
              onChange={handleProgressChange}
              className="w-full accent-pink-500"
            />
          </div>
          <div className="flex gap-x-2">
            <Volume2 className="text-[#B9BFF5]" />
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={volume}
              onChange={handleVolumeChange}
              className="w-40 accent-[#B9BFF5]"
            />
          </div>
        </div>
        <div className="flex items-center gap-x-8">
          <div
            className="p-3 rounded-full bg-[#252738]"
            onClick={handlePlayClick}
          >
            {config.play ? (
              <Pause
                className={`[transition:all_.3s] ${
                  config.pause ? "text-[#FF36C9]" : "text-[#B9BFF5]"
                }`}
              />
            ) : (
              <Play
                className={`[transition:all_.3s] ${
                  config.play ? "text-[#FF36C9]" : "text-[#B9BFF5]"
                }`}
              />
            )}
          </div>
          <div
            className="p-3 rounded-full bg-[#252738]"
            onClick={handleMaxmizeClick}
          >
            <Maximize
              className={`[transition:all_.3s] ${
                config.pause ? "text-[#FF36C9]" : "text-[#B9BFF5]"
              }`}
            />
          </div>
          <div
            className="p-3 rounded-full bg-[#252738]"
            onClick={handleInfinityClick}
          >
            <Infinity
              className={`[transition:all_.3s] ${
                config.loop ? "text-[#FF36C9]" : "text-[#B9BFF5]"
              }`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
