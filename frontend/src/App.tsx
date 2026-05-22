import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import "./App.css";

type Position = {
  x: number;
  y: number;
};

const TOKEN_SIZE = 360;

function App() {
  const [characterImageUrl, setCharacterImageUrl] = useState<string | null>(null);
  const [tokenImageUrl, setTokenImageUrl] = useState<string | null>(null);
  const [scale, setScale] = useState(100);
  const [tokenScale, setTokenScale] = useState(100);
  const [maskSize, setMaskSize] = useState(300);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [exportSize, setExportSize] = useState(512);

  const tokenPreviewRef = useRef<HTMLDivElement | null>(null);

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

  function handleCharacterImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
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

  async function downloadToken() {
    if (!tokenPreviewRef.current) return;

    const dataUrl = await toPng(tokenPreviewRef.current, {
      width: TOKEN_SIZE,
      height: TOKEN_SIZE,
      canvasWidth: exportSize,
      canvasHeight: exportSize,
      pixelRatio: 1,
      backgroundColor: "transparent",
    });

    const link = document.createElement("a");
    link.download = `rpg-token-${exportSize}px.png`;
    link.href = dataUrl;
    link.click();
  }

  return (
    <main className="app">
      <aside className="panel">
        <h1>RPG Token Maker</h1>

        <label className="uploadButton">
          Subir personaje
          <input type="file" accept="image/*" onChange={handleCharacterImageUpload} />
        </label>

        <label className="uploadButton">
          Subir token
          <input type="file" accept="image/*" onChange={handleTokenImageUpload} />
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
          Tamaño máscara: {maskSize}px
          <input
            type="range"
            min="100"
            max="360"
            value={maskSize}
            onChange={(event) => setMaskSize(Number(event.target.value))}
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

        <label className="control">
          Resolución descarga
          <select
            value={exportSize}
            onChange={(event) => setExportSize(Number(event.target.value))}
          >
            <option value={256}>256 x 256</option>
            <option value={512}>512 x 512</option>
            <option value={1024}>1024 x 1024</option>
            <option value={2048}>2048 x 2048</option>
          </select>
        </label>

        <button className="downloadButton" onClick={downloadToken}>
          Descargar PNG
        </button>
      </aside>

      <section className="workspace">
        <div
          ref={tokenPreviewRef}
          className="tokenPreview"
          onDrop={handleDrop}
          onDragOver={(event) => event.preventDefault()}
          onPointerMove={handlePointerMove}
        >
          <div
            className="characterMask"
            style={{
              width: `${maskSize}px`,
              height: `${maskSize}px`,
            }}
          >
            {characterImageUrl ? (
              <img
                src={characterImageUrl}
                alt="Personaje"
                className="characterImage"
                draggable={false}
                style={{
                  transform: `scale(${scale / 100}) translate(${position.x}px, ${position.y}px)`,
                }}
              />
            ) : (
              <p>Arrastra una imagen aquí</p>
            )}
          </div>

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