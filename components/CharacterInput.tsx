
import React, { useRef, useCallback } from 'react';
import { Character } from '../types';
import UploadIcon from './icons/UploadIcon';

interface CharacterInputProps {
  character: Character;
  onImageUpload: (id: number, image: string | null) => void;
  onSelectionChange: (id: number, selected: boolean) => void;
}

const CharacterInput: React.FC<CharacterInputProps> = ({ character, onImageUpload, onSelectionChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(character.id, reader.result as string);
      };
      reader.readAsDataURL(file);
    }
    // Reset file input value to allow re-uploading the same file
    if(event.target) event.target.value = '';
  };

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    onImageUpload(character.id, null);
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="space-y-2">
      <div 
        onClick={triggerFileInput}
        className="relative aspect-square w-full bg-gray-800 border-2 border-dashed border-dark-border rounded-lg flex items-center justify-center text-center p-2 cursor-pointer hover:border-brand-purple transition-colors duration-200 group"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
        {character.image ? (
          <>
            <img src={character.image} alt={character.name} className="w-full h-full object-cover rounded-md" />
             <div 
              onClick={handleRemoveImage}
              className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-1 text-xs leading-none cursor-pointer hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
              title="Remove image"
            >
              &#x2715;
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center text-dark-subtext">
            <UploadIcon className="w-8 h-8 mb-1" />
            <span className="text-sm font-semibold">{character.name}</span>
            <span className="text-xs">Upload Image</span>
          </div>
        )}
      </div>
      <div className="flex items-center justify-center">
        <input
          type="checkbox"
          id={`char-${character.id}`}
          checked={character.selected}
          onChange={(e) => onSelectionChange(character.id, e.target.checked)}
          className="w-4 h-4 text-brand-purple bg-gray-700 border-gray-600 rounded focus:ring-brand-purple"
        />
        <label htmlFor={`char-${character.id}`} className="ml-2 text-sm font-medium text-dark-text cursor-pointer">
          Use Character
        </label>
      </div>
    </div>
  );
};

export default CharacterInput;
