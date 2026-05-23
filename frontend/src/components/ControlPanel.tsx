import { TokenInventory } from "./TokenInventory";

type Props = {
  scale: number;
  setScale: (value: number) => void;
  maskSize: number;
  setMaskSize: (value: number) => void;
  tokenScale: number;
  setTokenScale: (value: number) => void;
  exportSize: number;
  setExportSize: (value: number) => void;
  isTokenInventoryOpen: boolean;
  setIsTokenInventoryOpen: (value: boolean) => void;
  setTokenImageUrl: (value: string | null) => void;
  handleCharacterImageUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  handleTokenImageUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
  onClearDynamicMask: () => void;
  onDownloadToken: () => void;
};

export function ControlPanel({
  scale,
  setScale,
  maskSize,
  setMaskSize,
  tokenScale,
  setTokenScale,
  exportSize,
  setExportSize,
  isTokenInventoryOpen,
  setIsTokenInventoryOpen,
  setTokenImageUrl,
  handleCharacterImageUpload,
  handleTokenImageUpload,
  onClearDynamicMask,
  onDownloadToken,
}: Props) {
  return (
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

      <TokenInventory
        isOpen={isTokenInventoryOpen}
        setIsOpen={setIsTokenInventoryOpen}
        setTokenImageUrl={setTokenImageUrl}
        handleTokenImageUpload={handleTokenImageUpload}
      />

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

      <button className="downloadButton" onClick={onClearDynamicMask}>
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

      <button className="downloadButton" onClick={onDownloadToken}>
        Download as PNG
      </button>
    </aside>
  );
}