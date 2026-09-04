/** Le wordmark « Ultra Énergie », point final en couleur d'accent. */
export default function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className}>
      Ultra&nbsp;Énergie<span className="wm-point">.</span>
    </span>
  );
}
