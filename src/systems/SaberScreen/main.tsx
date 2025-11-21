import { useState, useEffect, useRef } from "react";
import { CircularProgress } from "@mui/material";

import video_example1 from "../../assets/test/Burger(vertical).mp4";
import video_example2 from "../../assets/test/sleep(vertical).mp4";
import image_example1 from "../../assets/test/moda(vertical_img).jpg";

// Definición de la lista de reproducción
const playlist = [
  { type: "video", src: video_example1, duration: 15000 }, // Duración del video: 15 segundos (15000ms)
  { type: "image", src: image_example1, duration: 10000 }, // Duración de la imagen: 10 segundos (10000ms)
  { type: "video", src: video_example2, duration: 15000 },
];

const Main: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Estados existentes para la rotación
  const [currentAssetIndex, setCurrentAssetIndex] = useState(0);

  // NUEVOS ESTADOS para el control del progreso
  const [progress, setProgress] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());

  const currentAsset = playlist[currentAssetIndex];
  const totalDuration = currentAsset.duration; // Duración total del asset actual

  const attemptPlay = (element: HTMLVideoElement) => {
    element.play().catch((error) => {
      console.error(
        "Error al intentar reproducir video automáticamente:",
        error
      );
    });
  };

  // 1. useEffect para manejar la rotación de Assets (Lógica existente)
  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null;
    const videoElement = videoRef.current;
    
    // Al cambiar de asset, reseteamos el tiempo de inicio
    setStartTime(Date.now()); 
    setProgress(0); // Reiniciamos el progreso visual

    if (currentAsset.type === "video" && videoElement) {
      // Lógica para Videos
      videoElement.load();
      attemptPlay(videoElement);

      const handleVideoEnd = () => {
        setCurrentAssetIndex((prevIndex) => (prevIndex + 1) % playlist.length);
      };

      videoElement.addEventListener("ended", handleVideoEnd);

      return () => {
        videoElement.removeEventListener("ended", handleVideoEnd);
      };
    } else if (currentAsset.type === "image") {
      // Lógica para Imágenes (basada en Timeout)
      if (videoElement) {
        videoElement.pause();
        videoElement.currentTime = 0;
      }

      timeout = setTimeout(() => {
        setCurrentAssetIndex((prevIndex) => (prevIndex + 1) % playlist.length);
      }, totalDuration);

      return () => {
        if (timeout) clearTimeout(timeout);
      };
    }
  }, [currentAssetIndex, totalDuration]);

  // 2. ⭐ NUEVO useEffect para actualizar el progreso (Polling) ⭐
  useEffect(() => {
    const interval = setInterval(() => {
      let currentProgress = 0;
      const elapsed = Date.now() - startTime;

      if (currentAsset.type === "video" && videoRef.current) {
        // Para videos, usamos la propiedad currentTime del elemento
        const videoElement = videoRef.current;
        const videoDuration = videoElement.duration * 1000; // Duración en milisegundos

        if (videoDuration > 0) {
          currentProgress = (videoElement.currentTime * 1000 / videoDuration) * 100;
        }
      } else {
        // Para imágenes (y si el video aún no tiene metadatos cargados), usamos el elapsed time
        currentProgress = (elapsed / totalDuration) * 100;
      }
      
      // El progreso nunca debe superar el 100%
      setProgress(Math.min(currentProgress, 100));

      // Si es una imagen, el cambio de asset ocurrirá por el timeout, no por este intervalo
    }, 100); // Se actualiza 10 veces por segundo (cada 100ms)

    // Función de limpieza para detener el intervalo
    return () => clearInterval(interval);
  }, [currentAssetIndex, startTime, totalDuration]);

  return (
    <div 
        style={{ 
            width: "100vw", 
            height: "100vh", 
            overflow: "hidden", 
            backgroundColor: "#000",
            position: "relative", // Importante para posicionar el progreso
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}
    >
      {/* ⭐ COMPONENTE DE PROGRESO - Posicionado en la esquina o centro ⭐ */}
      <CircularProgress 
        variant="determinate" 
        value={progress} 
        size={60} 
        thickness={5}
        style={{
          color: '#f59580ff',
          position: 'absolute',
          top: 20, // Distancia desde el borde superior
          right: 20, // Distancia desde el borde derecho
          zIndex: 10, // Asegura que esté por encima del video/imagen
          border: "#FF5733"
        }}
      />
      
      {/* Renderizado condicional del Asset */}
      {currentAsset.type === "video" ? (
        <video
          ref={videoRef}
          src={currentAsset.src}
          muted
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            margin: "0",
          }}
        />
      ) : (
        <img
          src={currentAsset.src}
          alt="Publicidad vertical"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      )}
    </div>
  );
};

export default Main;