'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Music, ChevronUp, X } from 'lucide-react';
import { motion } from 'framer-motion';

const AudioPlayer = ({ currentTrack, onToggleLibrary, isVisible, onClose }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [sessionTime, setSessionTime] = useState(0);
  const [playerReady, setPlayerReady] = useState(false);
  const playerRef = useRef(null);
  const intervalRef = useRef(null);

  // Load YouTube IFrame API once
  useEffect(() => {
    if (!window['YT']) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }

    window['onYouTubeIframeAPIReady'] = () => {
      playerRef.current = new window['YT'].Player('yt-player', {
        height: '1',
        width: '1',
        videoId: currentTrack.youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          loop: 1,
          playlist: currentTrack.youtubeId,
        },
        events: {
          onReady: () => {
            setPlayerReady(true);
            playerRef.current.setVolume(volume);
          },
        },
      });
    };

    if (window['YT'] && window['YT'].Player) {
      playerRef.current = new window['YT'].Player('yt-player', {
        height: '1',
        width: '1',
        videoId: currentTrack.youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          loop: 1,
          playlist: currentTrack.youtubeId,
        },
        events: {
          onReady: () => {
            setPlayerReady(true);
            playerRef.current.setVolume(volume);
          },
        },
      });
    }

    return () => {
      if (playerRef.current) {
        // eslint-disable-next-line no-empty
        try { playerRef.current.destroy(); } catch (err) {}
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Session timer
  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => setSessionTime(s => s + 1), 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying]);

  // Sync volume changes to player
  useEffect(() => {
    if (playerRef.current && playerReady) {
      playerRef.current.setVolume(volume);
    }
  }, [volume, playerReady]);

  // Sync track changes to player
  useEffect(() => {
    if (playerRef.current && playerReady && currentTrack.youtubeId) {
      playerRef.current.cueVideoById({
        videoId: currentTrack.youtubeId,
        startSeconds: 0,
        suggestedQuality: 'small'
      });
      if (isPlaying) {
        playerRef.current.playVideo();
      }
    }
  }, [currentTrack, playerReady]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const handlePlayPause = () => {
    if (!playerReady || !playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
    setIsPlaying(prev => !prev);
  };

  return (
    <>
      {/* Hidden YouTube Player */}
      <div className="fixed w-px h-px overflow-hidden opacity-0 pointer-events-none bottom-0 left-0">
        <div id="yt-player" />
      </div>

      {/* Visible Player Bar */}
      <div
        onClick={onClose}
        className={`fixed left-1/2 -translate-x-1/2 flex items-center px-6 gap-6 z-50 transition-all duration-500 cursor-pointer group w-[850px] max-w-[95vw] h-[76px] bg-[#0f141e] rounded-3xl border border-white/10 shadow-2xl ${
          isVisible ? 'bottom-8 opacity-100 pointer-events-auto' : '-bottom-[120px] opacity-0 pointer-events-none'
        }`}
        title="Click background to minimize"
      >
        {/* Track Info */}
        <div className="flex items-center gap-4 min-w-[220px]" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-center w-[46px] h-[46px] bg-accent text-[#0f141e] rounded-2xl transition-opacity duration-400">
            <Music size={22} strokeWidth={2.5} />
          </div>
          <div className="flex flex-col justify-center">
            <button
              onClick={(e) => { e.stopPropagation(); onToggleLibrary(); }}
              className="flex items-center gap-1 text-[15px] font-semibold tracking-wide hover:opacity-80 transition-opacity text-slate-100"
            >
              {currentTrack.name}
              <ChevronUp size={14} className="text-slate-400" />
            </button>
            <span className="text-[10px] tracking-[0.15em] uppercase font-bold text-accent mt-0.5">
              GAMMA — {currentTrack.frequency}
            </span>
          </div>
        </div>

        {/* Play / Progress */}
        <div className="flex-1 flex items-center gap-5" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={(e) => { e.stopPropagation(); handlePlayPause(); }}
            className={`rounded-full flex items-center justify-center w-[46px] h-[46px] bg-accent text-[#0f141e] shrink-0 transition-transform hover:scale-105 ${
              playerReady ? 'cursor-pointer opacity-100' : 'cursor-not-allowed opacity-50'
            }`}
          >
            {isPlaying
              ? <Pause size={22} fill="currentColor" />
              : <Play size={22} fill="currentColor" className="ml-0.5" />
            }
          </button>

          <div className="flex-1 h-1 rounded-full overflow-hidden bg-white/10">
            <div
              className={`h-full rounded-full bg-accent transition-all ${
                isPlaying ? 'w-full duration-[600s] ease-linear' : 'w-0 duration-300'
              }`}
            />
          </div>
        </div>

        {/* Volume + Timer */}
        <div className="flex items-center gap-6" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-3">
            <Volume2 size={16} className="text-slate-400" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={e => setVolume(Number(e.target.value))}
              className="w-20 accent-accent h-1 cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-3 border-l border-slate-700 pl-6 h-8">
            <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-slate-400">
              Session
            </span>
            <span className="font-mono text-[15px] font-medium text-slate-100">
              {formatTime(sessionTime)}
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default AudioPlayer;
