import {
  Circle,
  Group,
  Image as KonvaImage,
  Layer,
  Line,
  Stage,
} from "react-konva";
import type Konva from "konva";
import type { DrawnMask } from "../types/token";
import { getImageProps } from "../utils/imageUtils";

type Props = {
  stageRef: React.RefObject<Konva.Stage | null>;

  editorSize: number;
  tokenSize: number;
  tokenCenter: number;

  maskSize: number;
  isDrawingMask: boolean;

  characterImage: HTMLImageElement | null;
  tokenImage: HTMLImageElement | null;
  characterProps: ReturnType<typeof getImageProps>;
  tokenProps: ReturnType<typeof getImageProps>;

  drawnMasks: DrawnMask[];
  currentMaskPoints: number[];

  onDrop: (event: React.DragEvent<HTMLDivElement>) => void;
  onStageMouseDown: (event: Konva.KonvaEventObject<MouseEvent>) => void;
  onStageMouseMove: () => void;
  onStageMouseUp: () => void;
  onCharacterDragMove: (event: Konva.KonvaEventObject<DragEvent>) => void;
};

export function TokenEditor({
  stageRef,
  editorSize,
  tokenCenter,
  maskSize,
  isDrawingMask,
  characterImage,
  tokenImage,
  characterProps,
  tokenProps,
  drawnMasks,
  currentMaskPoints,
  onDrop,
  onStageMouseDown,
  onStageMouseMove,
  onStageMouseUp,
  onCharacterDragMove,
}: Props) {
  return (
    <section className="workspace">
      <div
        className="tokenPreview"
        onDrop={onDrop}
        onDragOver={(event) => event.preventDefault()}
      >
        <Stage
          ref={stageRef}
          width={editorSize}
          height={editorSize}
          onMouseDown={onStageMouseDown}
          onMouseMove={onStageMouseMove}
          onMouseUp={onStageMouseUp}
        >
          <Layer>
            <Group
              clipFunc={(ctx) => {
                ctx.beginPath();
                ctx.arc(tokenCenter, tokenCenter, maskSize / 2, 0, Math.PI * 2);
                ctx.closePath();
              }}
            >
              {characterImage && characterProps && (
                <KonvaImage
                  image={characterImage}
                  {...characterProps}
                  draggable={!isDrawingMask}
                  onDragMove={onCharacterDragMove}
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
              x={tokenCenter}
              y={tokenCenter}
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
  );
}
