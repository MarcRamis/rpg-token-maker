import { useEffect, useRef, useState } from "react";
import {
  Circle,
  Group,
  Image as KonvaImage,
  Layer,
  Line,
  Stage,
} from "react-konva";
import Konva from "konva";
import "./App.css";

type Position = {
  x: number;
  y: number;
};

type DrawnMask = {
  id: string;
  points: number[];
};

const TOKEN_SIZE = 360;
const EDITOR_SIZE = 520;
const TOKEN_OFFSET = (EDITOR_SIZE - TOKEN_SIZE) / 2;
const TOKEN_CENTER = TOKEN_OFFSET + TOKEN_SIZE / 2;

function useLoadedImage(src: string | null) {
  const [image, setImage] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    if (!src) {
      queueMicrotask(() => {
        if (!cancelled) setImage(null);
      });

      return () => {
        cancelled = true;
      };
    }

    const img = new window.Image();

    img.onload = () => {
      if (!cancelled) setImage(img);
    };

    img.src = src;

    return () => {
      cancelled = true;
    };
  }, [src]);

  return image;
}

function getImageProps(
  image: HTMLImageElement | null,
  scale: number,
  position: Position,
) {
  if (!image) return null;

  const ratio = Math.min(TOKEN_SIZE / image.width, TOKEN_SIZE / image.height);
  const width = image.width * ratio;
  const height = image.height * ratio;

  return {
    x: TOKEN_CENTER + position.x,
    y: TOKEN_CENTER + position.y,
    width,
    height,
    offsetX: width / 2,
    offsetY: height / 2,
    scaleX: scale / 100,
    scaleY: scale / 100,
  };
}

function App() {
  const [characterImageUrl, setCharacterImageUrl] = useState<string | null>(
    null,
  );
  const [tokenImageUrl, setTokenImageUrl] = useState<string | null>(null);
  const [scale, setScale] = useState(100);
  const [tokenScale, setTokenScale] = useState(100);
  const [maskSize, setMaskSize] = useState(300);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [exportSize, setExportSize] = useState(512);

  const [drawnMasks, setDrawnMasks] = useState<DrawnMask[]>([]);
  const [currentMaskPoints, setCurrentMaskPoints] = useState<number[]>([]);
  const [isDrawingMask, setIsDrawingMask] = useState(false);

  const stageRef = useRef<Konva.Stage | null>(null);

  const characterImage = useLoadedImage(characterImageUrl);
  const tokenImage = useLoadedImage(tokenImageUrl);

  const characterProps = getImageProps(characterImage, scale, position);
  const tokenProps = getImageProps(tokenImage, tokenScale, { x: 0, y: 0 });

  function loadCharacterImage(file: File) {
    if (!file.type.startsWith("image/")) return;

    setCharacterImageUrl(URL.createObjectURL(file));
    setScale(100);
    setPosition({ x: 0, y: 0 });
    setDrawnMasks([]);
    setCurrentMaskPoints([]);
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

  function handleStageMouseDown(event: Konva.KonvaEventObject<MouseEvent>) {
    if (!event.evt.shiftKey) return;

    const stage = stageRef.current;
    const pointer = stage?.getPointerPosition();
    if (!pointer) return;

    setIsDrawingMask(true);
    setCurrentMaskPoints([pointer.x, pointer.y]);
  }

  function handleStageMouseMove() {
    if (!isDrawingMask) return;

    const stage = stageRef.current;
    const pointer = stage?.getPointerPosition();
    if (!pointer) return;

    setCurrentMaskPoints((previous) => [...previous, pointer.x, pointer.y]);
  }

  function handleStageMouseUp() {
    if (!isDrawingMask) return;

    if (currentMaskPoints.length > 6) {
      setDrawnMasks((previous) => [
        ...previous,
        {
          id: crypto.randomUUID(),
          points: currentMaskPoints,
        },
      ]);
    }

    setIsDrawingMask(false);
    setCurrentMaskPoints([]);
  }

  function downloadToken() {
    const stage = stageRef.current;
    if (!stage) return;

    stage.find(".helper").forEach((node) => {
      node.visible(false);
    });

    const dataUrl = stage.toDataURL({
      x: TOKEN_OFFSET,
      y: TOKEN_OFFSET,
      width: TOKEN_SIZE,
      height: TOKEN_SIZE,
      pixelRatio: exportSize / TOKEN_SIZE,
    });

    stage.find(".helper").forEach((node) => {
      node.visible(true);
    });

    const link = document.createElement("a");
    link.download = `rpg-token-${exportSize}px.png`;
    link.href = dataUrl;
    link.click();
  }

  return (
    <main className="app">
      <aside className="panel">
        <h1>Tokn</h1>

        <label className="uploadButton">
          Upload character
          <input
            type="file"
            accept="image/*"
            onChange={handleCharacterImageUpload}
          />
        </label>

        <label className="uploadButton">
          Upload token
          <input
            type="file"
            accept="image/*"
            onChange={handleTokenImageUpload}
          />
        </label>

        <label className="control">
          Character size: {scale}%
          <input
            type="range"
            min="50"
            max="200"
            value={scale}
            onChange={(event) => setScale(Number(event.target.value))}
          />
        </label>

        <label className="control">
          Base mask size: {maskSize}px
          <input
            type="range"
            min="100"
            max="360"
            value={maskSize}
            onChange={(event) => setMaskSize(Number(event.target.value))}
          />
        </label>

        <label className="control">
          Token size: {tokenScale}%
          <input
            type="range"
            min="50"
            max="200"
            value={tokenScale}
            onChange={(event) => setTokenScale(Number(event.target.value))}
          />
        </label>

        <button className="downloadButton" onClick={() => setDrawnMasks([])}>
          Remove dynamic mask
        </button>

        <label className="control">
          Download resolution
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
          Download as PNG
        </button>
      </aside>

      <section className="workspace">
        <div
          className="tokenPreview"
          onDrop={handleDrop}
          onDragOver={(event) => event.preventDefault()}
        >
          <Stage
            ref={stageRef}
            width={EDITOR_SIZE}
            height={EDITOR_SIZE}
            onMouseDown={handleStageMouseDown}
            onMouseMove={handleStageMouseMove}
            onMouseUp={handleStageMouseUp}
          >
            <Layer>
              <Group
                clipFunc={(ctx) => {
                  ctx.beginPath();

                  ctx.arc(
                    TOKEN_CENTER,
                    TOKEN_CENTER,
                    maskSize / 2,
                    0,
                    Math.PI * 2,
                  );

                  ctx.closePath();
                }}
              >
                {characterImage && characterProps && (
                  <KonvaImage
                    image={characterImage}
                    {...characterProps}
                    draggable={!isDrawingMask}
                    onDragMove={(event) => {
                      setPosition({
                        x: event.target.x() - TOKEN_CENTER,
                        y: event.target.y() - TOKEN_CENTER,
                      });
                    }}
                  />
                )}
              </Group>

              {tokenImage && tokenProps && (
                <KonvaImage
                  image={tokenImage}
                  {...tokenProps}
                  listening={false}
                />
              )}

              <Group
                clipFunc={(ctx) => {
                  ctx.beginPath();

                  [
                    ...drawnMasks.map((mask) => mask.points),
                    currentMaskPoints,
                  ].forEach((points) => {
                    if (points.length < 4) return;

                    ctx.moveTo(points[0], points[1]);

                    for (let i = 2; i < points.length; i += 2) {
                      ctx.lineTo(points[i], points[i + 1]);
                    }

                    ctx.closePath();
                  });
                }}
              >
                {characterImage && characterProps && (
                  <KonvaImage
                    image={characterImage}
                    {...characterProps}
                    listening={false}
                  />
                )}
              </Group>

              <Circle
                name="helper"
                x={TOKEN_CENTER}
                y={TOKEN_CENTER}
                radius={maskSize / 2}
                stroke="#ffffff66"
                dash={[6, 6]}
                listening={false}
              />

              {drawnMasks.map((mask) => (
                <Line
                  name="helper"
                  key={mask.id}
                  points={mask.points}
                  closed
                  stroke="white"
                  dash={[6, 6]}
                  listening={false}
                />
              ))}

              {currentMaskPoints.length > 0 && (
                <Line
                  name="helper"
                  points={currentMaskPoints}
                  closed
                  stroke="white"
                  dash={[6, 6]}
                  listening={false}
                />
              )}
            </Layer>
          </Stage>
          <div className="tokenPreviewBorder" />
        </div>
      </section>
    </main>
  );
}

export default App;
