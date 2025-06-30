"use client";

import React, { useState, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import Cropper from 'react-easy-crop';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface CropCompletedEvent {
  width: number;
  height: number;
  x: number;
  y: number;
}

interface ImageCropModalProps {
  image: string;
  onClose: () => void;
  onCropComplete: (croppedImageUrl: string) => void;
  loading?: boolean;
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({ 
  image, 
  onClose, 
  onCropComplete,
  loading = false
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropCompletedEvent | null>(null);

  const handleCropComplete = useCallback((croppedArea: CropArea, croppedAreaPixels: CropCompletedEvent) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new window.Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', (error: Event) => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (imageSrc: string, pixelCrop: CropCompletedEvent) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return null;
    }

    // Set canvas dimensions to match the cropped size
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    // Draw the cropped image
    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    // Get data URL from canvas
    return new Promise<string>((resolve) => {
      canvas.toBlob((blob) => {
        if (!blob) {
          resolve('');
          return;
        }
        const url = URL.createObjectURL(blob);
        resolve(url);
      }, 'image/jpeg');
    });
  };

  const handleSetNewProfileImage = async () => {
    if (!croppedAreaPixels) return;

    try {
      const croppedImageUrl = await getCroppedImg(image, croppedAreaPixels);
      if (croppedImageUrl) {
        onCropComplete(croppedImageUrl);
      }
    } catch (e) {
      console.error('Error cropping image:', e);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-component-background rounded-xl w-full max-w-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-text-primary">프로필 이미지 수정</h3>
          <button 
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary"
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <div className="relative h-80 w-full">
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={1}
            cropShape="round"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
          />
        </div>
        
        <div className="mt-4">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-text-secondary text-sm">Zoom</span>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-green-600"
            />
          </div>
          <button
            onClick={handleSetNewProfileImage}
            className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            disabled={loading}
          >
            {loading ? "처리중..." : "새 프로필 이미지 설정"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal; 