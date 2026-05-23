import { BUILT_IN_TOKENS } from "../utils/tokenAssets";

type Props = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  setTokenImageUrl: (value: string | null) => void;
  handleTokenImageUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => void;
};

export function TokenInventory({
  isOpen,
  setIsOpen,
  setTokenImageUrl,
  handleTokenImageUpload,
}: Props) {
  return (
    <div className="tokenInventoryWrapper">
      <button
        type="button"
        className="inventoryButton"
        onClick={() => setIsOpen(!isOpen)}
      >
        Token inventory ▼
      </button>

      {isOpen && (
        <div className="tokenInventory">
          <button
            type="button"
            className="tokenCard textCard"
            onClick={() => {
              setTokenImageUrl(null);
            }}
          >
            NONE
          </button>

          <button
            type="button"
            className="tokenCard textCard"
            onClick={() => {
              document
                .getElementById("custom-token-upload")
                ?.click();

              setIsOpen(false);
            }}
          >
            UPLOAD
          </button>

          {BUILT_IN_TOKENS.map((token) => (
            <button
              type="button"
              key={token.src}
              className="tokenCard"
              onClick={() => {
                setTokenImageUrl(token.src);
              }}
            >
              <img src={token.src} alt={token.name} />
            </button>
          ))}
        </div>
      )}

      <input
        id="custom-token-upload"
        type="file"
        accept="image/*"
        hidden
        onChange={handleTokenImageUpload}
      />
    </div>
  );
}