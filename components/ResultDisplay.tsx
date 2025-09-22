
import React from 'react';
import { ImageResult } from '../types';
import ViewIcon from './icons/ViewIcon';
import DownloadIcon from './icons/DownloadIcon';
import SpinnerIcon from './icons/SpinnerIcon';

interface ResultDisplayProps {
  images: ImageResult[];
  isLoading: boolean;
  error: string | null;
  onPreview: (src: string) => void;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ images, isLoading, error, onPreview }) => {

  const handleDownload = (src: string, name: string) => {
    const link = document.createElement('a');
    link.href = src;
    link.download = name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center text-dark-subtext">
          <SpinnerIcon className="w-16 h-16 animate-spin text-brand-purple" />
          <h2 className="text-2xl font-semibold mt-6 text-white">Generating your masterpiece...</h2>
          <p className="mt-2 max-w-md">The AI is working its magic. This can take a moment, especially for high-resolution images. Please be patient!</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-full text-center text-red-400">
          <div className="bg-red-900/20 border border-red-500/50 p-6 rounded-lg">
             <h2 className="text-xl font-semibold text-red-300">An Error Occurred</h2>
             <p className="mt-2">{error}</p>
          </div>
        </div>
      );
    }

    if (images.length === 0) {
      return (
        <div className="flex items-center justify-center h-full text-center text-dark-subtext">
            <div>
                 <h2 className="text-3xl font-bold text-white">Your Results Will Appear Here</h2>
                 <p className="mt-2 text-lg">Fill out the details on the left and click "Generate Image" to begin.</p>
            </div>
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {images.map((image) => (
          <div key={image.id} className="relative group aspect-video overflow-hidden rounded-xl shadow-lg">
            <img src={image.src} alt={`Generated result ${image.id}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center gap-4">
              <button onClick={() => onPreview(image.src)} className="p-3 bg-white/20 rounded-full text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110">
                <ViewIcon className="w-6 h-6" />
              </button>
              <button onClick={() => handleDownload(image.src, `generated-image-${image.id}.jpg`)} className="p-3 bg-white/20 rounded-full text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity transform hover:scale-110">
                <DownloadIcon className="w-6 h-6" />
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-dark-panel p-6 rounded-2xl w-full min-h-[80vh] lg:min-h-full flex flex-col">
       {renderContent()}
    </div>
  );
};

export default ResultDisplay;
