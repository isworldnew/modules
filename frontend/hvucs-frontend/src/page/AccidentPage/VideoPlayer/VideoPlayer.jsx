import { useState, useEffect, useRef } from 'react';
import './VideoPlayer.css';

export default function VideoPlayer({ recordType, record }) {
    const [videoUrl, setVideoUrl] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isSeeking, setIsSeeking] = useState(false);
    const videoRef = useRef(null);
    const animationRef = useRef(null);
    
    // Преобразование Base64 в URL
    useEffect(() => {
        if (record && recordType) {
            try {
                const byteCharacters = atob(record);
                const byteNumbers = new Array(byteCharacters.length);
                
                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }
                
                const byteArray = new Uint8Array(byteNumbers);
                const blob = new Blob([byteArray], { type: recordType });
                const url = URL.createObjectURL(blob);
                setVideoUrl(url);
                
                return () => {
                    URL.revokeObjectURL(url);
                };
            } catch (error) {
                console.error('Error creating video URL:', error);
            }
        }
    }, [record, recordType]);
    
    // Автоматическое воспроизведение после загрузки метаданных
    useEffect(() => {
        if (videoRef.current && videoUrl) {
            const playPromise = videoRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                        startAnimation();
                    })
                    .catch(error => {
                        console.log('Autoplay prevented:', error);
                        setIsPlaying(false);
                    });
            }
        }
        
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [videoUrl]);
    
    // Плавное обновление времени через requestAnimationFrame
    const updateTime = () => {
        if (videoRef.current && !isSeeking) {
            setCurrentTime(videoRef.current.currentTime);
            animationRef.current = requestAnimationFrame(updateTime);
        }
    };
    
    const startAnimation = () => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
        }
        animationRef.current = requestAnimationFrame(updateTime);
    };
    
    const stopAnimation = () => {
        if (animationRef.current) {
            cancelAnimationFrame(animationRef.current);
            animationRef.current = null;
        }
    };
    
    // Обработчики видео
    const handlePlayPause = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
                stopAnimation();
            } else {
                videoRef.current.play();
                startAnimation();
            }
            setIsPlaying(!isPlaying);
        }
    };
    
    const handleLoadedMetadata = () => {
        if (videoRef.current) {
            setDuration(videoRef.current.duration);
        }
    };
    
    const handleSeekStart = () => {
        setIsSeeking(true);
        stopAnimation();
    };
    
    const handleSeek = (e) => {
        if (videoRef.current) {
            const newTime = parseFloat(e.target.value);
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);
        }
    };
    
    const handleSeekEnd = () => {
        setIsSeeking(false);
        if (isPlaying) {
            startAnimation();
        }
    };
    
    const handleVideoEnd = () => {
        if (videoRef.current) {
            videoRef.current.currentTime = 0;
            videoRef.current.play();
            setCurrentTime(0);
            setIsPlaying(true);
            startAnimation();
        }
    };
    
    // Форматирование времени (секунды -> MM:SS)
    const formatTime = (seconds) => {
        if (isNaN(seconds) || !isFinite(seconds)) return '00:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };
    
    // Вычисляем процент воспроизведения
    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
    
    if (!videoUrl) {
        return (
            <div className="video-player-placeholder">
                <p>Видео недоступно</p>
            </div>
        );
    }
    
    return (
        <div className="video-player-wrapper">
            <div className="video-player">
                <video
                    ref={videoRef}
                    className="video-element"
                    src={videoUrl}
                    onLoadedMetadata={handleLoadedMetadata}
                    onEnded={handleVideoEnd}
                    onPlay={() => {
                        setIsPlaying(true);
                        startAnimation();
                    }}
                    onPause={() => {
                        setIsPlaying(false);
                        stopAnimation();
                    }}
                />
                
                <div className="video-controls">
                    <button 
                        className="control-btn"
                        onClick={handlePlayPause}
                    >
                        {isPlaying ? '⏸' : '▶'}
                    </button>
                    
                    <div className="timeline-wrapper">
                        <input
                            type="range"
                            className="timeline"
                            min="0"
                            max={duration || 0}
                            step="0.01"
                            value={currentTime}
                            onMouseDown={handleSeekStart}
                            onTouchStart={handleSeekStart}
                            onChange={handleSeek}
                            onMouseUp={handleSeekEnd}
                            onTouchEnd={handleSeekEnd}
                            style={{
                                background: `linear-gradient(to right, var(--button-yellow) 0%, var(--button-yellow) ${progressPercent}%, var(--border-color) ${progressPercent}%, var(--border-color) 100%)`
                            }}
                        />
                    </div>
                    
                    <span className="timecode">
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </span>
                </div>
            </div>
        </div>
    );
}