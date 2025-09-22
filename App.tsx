
import React, { useState, useCallback } from 'react';
import { Character, Background, ImageResult } from './types';
import CharacterInput from './components/CharacterInput';
import BackgroundInput from './components/BackgroundInput';
import ResultDisplay from './components/ResultDisplay';
import Modal from './components/Modal';
import { generateMockImages } from './services/geminiService';

const App: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([
    { id: 1, name: 'Character 1', image: null, selected: true },
    { id: 2, name: 'Character 2', image: null, selected: false },
    { id: 3, name: 'Character 3', image: null, selected: false },
    { id: 4, name: 'Character 4', image: null, selected: false },
  ]);
  const [background, setBackground] = useState<Background>({ image: null, use: false });
  const [prompt, setPrompt] = useState<string>('');
  const [generatedImages, setGeneratedImages] = useState<ImageResult[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const handleCharacterImageUpload = useCallback((id: number, image: string | null) => {
    setCharacters(prev => prev.map(c => (c.id === id ? { ...c, image } : c)));
  }, []);

  const handleCharacterSelection = useCallback((id: number, selected: boolean) => {
    setCharacters(prev => prev.map(c => (c.id === id ? { ...c, selected } : c)));
  }, []);

  const handleBackgroundImageUpload = useCallback((image: string | null) => {
    setBackground(prev => ({ ...prev, image }));
  }, []);

  const handleUseBackgroundToggle = useCallback((use: boolean) => {
    setBackground(prev => ({ ...prev, use }));
  }, []);

  const handleGenerate = async () => {
    setIsLoading(true);
    setError(null);
    setGeneratedImages([]);
    try {
      // In a real app, you would pass character and background data to the service.
      const images = await generateMockImages(prompt);
      setGeneratedImages(images);
    } catch (err) {
      setError('Failed to generate images. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const isGenerateDisabled = isLoading || !prompt.trim() || !characters.some(c => c.selected && c.image);

  return (
    <div className="min-h-screen font-sans text-dark-text bg-dark-bg p-4 lg:p-8">
      <div className="max-w-screen-2xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Panel: Controls */}
        <div className="lg:col-span-1 bg-dark-panel p-6 rounded-2xl shadow-lg flex flex-col gap-8 h-fit">
          <header>
            <h1 className="text-3xl font-bold text-white">AI Image Scene Creator</h1>
            <p className="text-dark-subtext mt-2">Craft your scene by providing characters, a background, and a creative prompt.</p>
          </header>
          
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Reference Characters</h2>
            <div className="grid grid-cols-2 gap-4">
              {characters.map(char => (
                <CharacterInput
                  key={char.id}
                  character={char}
                  onImageUpload={handleCharacterImageUpload}
                  onSelectionChange={handleCharacterSelection}
                />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Reference Background</h2>
            <BackgroundInput 
              background={background}
              onImageUpload={handleBackgroundImageUpload}
              onUseBackgroundChange={handleUseBackgroundToggle}
            />
          </div>
          
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Prompt</h2>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the action and composition of the scene..."
              className="w-full h-32 p-3 bg-gray-800 border border-dark-border rounded-lg focus:ring-2 focus:ring-brand-purple focus:border-brand-purple transition duration-200 resize-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isGenerateDisabled}
            className="w-full py-3 px-6 bg-brand-purple text-white font-bold rounded-lg shadow-md hover:bg-purple-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105"
          >
            {isLoading ? 'Generating...' : 'Generate Image'}
          </button>
        </div>

        {/* Right Panel: Results */}
        <div className="lg:col-span-2">
           <ResultDisplay 
              images={generatedImages} 
              isLoading={isLoading} 
              error={error} 
              onPreview={setPreviewImage} 
            />
        </div>
      </div>
      {previewImage && <Modal imageUrl={previewImage} onClose={() => setPreviewImage(null)} />}
    </div>
  );
};

export default App;
