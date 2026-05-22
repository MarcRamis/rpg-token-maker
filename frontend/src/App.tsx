import { useState } from 'react';
import './App.css';

type Position = {
  x: number;
  y: number;
};

function App() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [scale, setScale] = useState(100);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  function loadImage(file: File) {
    if (!file.type.startsWith('image/')) return;

    const url = URL.createObjectURL(file);
    setImageUrl(url);
    setScale(100);
    setPosition({ x: 0, y: 0 });
  }

  function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) loadImage(file);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();

    const file = event.dataTransfer.files?.[0];
    if (file) loadImage(file);
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.buttons !== 1) return;

    const rect = event.currentTarget.getBoundingClientRect();

    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const newX = event.clientX - centerX;
    const newY = event.clientY - centerY;

    const limit = 200;

    setPosition({
      x: Math.max(-limit, Math.min(limit, newX)),
      y: Math.max(-limit, Math.min(limit, newY)),
    });
  }

  return (
    <main className="app">
      <aside className="panel">
        <h1>RPG Token Maker</h1>

        <label className="uploadButton">
          Subir imagen
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </label>

        <label className="control">
          Tamaño: {scale}%
          <input
            type="range"
            min="50"
            max="200"
            value={scale}
            onChange={(event) => setScale(Number(event.target.value))}
          />
        </label>
      </aside>

      <section className="workspace">
        <div
          className="tokenPreview"
          onDrop={handleDrop}
          onDragOver={(event) => event.preventDefault()}
          onPointerMove={handlePointerMove}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Personaje"
              className="characterImage"
              draggable={false}
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale / 100})`,
              }}
            />
          ) : (
            <p>Arrastra una imagen aquí</p>
          )}
        </div>
      </section>
    </main>
  );
}

export default App;