import { useState } from "react";
import "./App.css";

type Position = {
  x: number;
  y: number;
};

function App() {
  const [characterImageUrl, setCharacterImageUrl] = useState<string | null>(
    null,
  );
  const [tokenImageUrl, setTokenImageUrl] = useState<string | null>(null);
  const [scale, setScale] = useState(100);
  const [tokenScale, setTokenScale] = useState(100);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  function loadCharacterImage(file: File) {
    if (!file.type.startsWith("image/")) return;

    setCharacterImageUrl(URL.createObjectURL(file));
    setScale(100);
    setPosition({ x: 0, y: 0 });
  }

  function loadTokenImage(file: File) {
    if (!file.type.startsWith("image/")) return;

    setTokenImageUrl(URL.createObjectURL(file));
  }

  function handleCharacterImageUpload(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file = event.target.files?.[0];
    if (file) loadCharacterImage(file);
  }

  function handleTokenImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) loadTokenImage(file);
  }

  function handleDrop(event: React.DragEvent<HTMLDivElement>) {
    event.preventDefault();

    const files = Array.from(event.dataTransfer.files);

    files.forEach((file) => {
      if (!file.type.startsWith("image/")) return;

      if (!characterImageUrl) {
        loadCharacterImage(file);
        return;
      }

      if (!tokenImageUrl) {
        loadTokenImage(file);
      }
    });
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (event.buttons !== 1) return;

    const target = event.target as HTMLElement;

    if (!target.classList.contains("characterImage")) return;

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
          Subir personaje
          <input
            type="file"
            accept="image/*"
            onChange={handleCharacterImageUpload}
          />
        </label>

        <label className="uploadButton">
          Subir token
          <input
            type="file"
            accept="image/*"
            onChange={handleTokenImageUpload}
          />
        </label>

        <label className="control">
          Tamaño personaje: {scale}%
          <input
            type="range"
            min="50"
            max="200"
            value={scale}
            onChange={(event) => setScale(Number(event.target.value))}
          />
        </label>
        <label className="control">
          Tamaño token: {tokenScale}%
          <input
            type="range"
            min="50"
            max="200"
            value={tokenScale}
            onChange={(event) => setTokenScale(Number(event.target.value))}
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
          {characterImageUrl ? (
            <img
              src={characterImageUrl}
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

          {tokenImageUrl && (
            <img
              src={tokenImageUrl}
              alt="Token"
              className="tokenImage"
              draggable={false}
              style={{
                transform: `scale(${tokenScale / 100})`,
              }}
            />
          )}
        </div>
      </section>
    </main>
  );
}

export default App;
