
import React, { useRef } from 'react';
import { Background } from '../types';
import UploadIcon from './icons/UploadIcon';

interface BackgroundInputProps {
  background: Background;
  onImageUpload: (image: string | null) => void;
  onUseBackgroundChange: (use: boolean) => void;
}

const BackgroundInput: React.FC<BackgroundInputProps> = ({ background, onImageUpload, onUseBackgroundChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
     if(event.target) event.target.value = '';
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageUpload(null);
     if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
     <div className="space-y-3">
        <div 
            onClick={() => fileInputRef.current?.click()}
            className="relative aspect-video w-full bg-gray-800 border-2 border-dashed border-dark-border rounded-lg flex items-center justify-center text-center p-4 cursor-pointer hover:border-brand-purple transition-colors duration-200 group"
        >
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
            {background.image ? (
            <>
                <img src={background.image} alt="Background" className="w-full h-full object-cover rounded-md" />
                <div 
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-black bg-opacity-50 text-white rounded-full p-1.5 text-xs leading-none cursor-pointer hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                    title="Remove background"
                >
                    &#x2715;
                </div>
            </>
            ) : (
            <div className="flex flex-col items-center text-dark-subtext">
                <UploadIcon className="w-10 h-10 mb-2" />
                <span className="text-md font-semibold">Upload Background</span>
            </div>
            )}
        </div>
        <div className="flex items-center">
            <input
            type="checkbox"
            id="use-background"
            checked={background.use}
            onChange={(e) => onUseBackgroundChange(e.target.checked)}
            className="w-4 h-4 text-brand-purple bg-gray-700 border-gray-600 rounded focus:ring-brand-purple"
            />
            <label htmlFor="use-background" className="ml-2 text-sm font-medium text-dark-text cursor-pointer">
            Use this background
            </label>
      </div>
     </div>
  );
};

export default BackgroundInput;
