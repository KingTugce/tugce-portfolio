export function FocusOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-40 bg-gradient-to-br from-purple-900 to-blue-950 flex items-center justify-center text-slate-100 text-sm"
    >
      Focus Layer — coming next
    </div>
  );
}
