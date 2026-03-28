import { BookMarked, LayoutGrid, Smartphone } from "lucide-react";

interface Props {
  onMore: () => void;
  onBook: () => void;
  onAppMenu: () => void;
}

export function BottomToolbar({ onMore, onBook, onAppMenu }: Props) {
  return (
    <div
      className="w-full rounded-2xl p-1.5 flex items-center justify-around"
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <button
        type="button"
        onClick={onMore}
        className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all hover:bg-white/10 active:scale-90"
        data-ocid="nav.more_button"
      >
        <LayoutGrid size={20} style={{ color: "rgba(255,255,255,0.7)" }} />
        <span className="text-white/50 text-[9px] uppercase tracking-widest">
          More
        </span>
      </button>

      <div
        style={{ width: 1, height: 28, background: "rgba(255,255,255,0.08)" }}
      />

      <button
        type="button"
        onClick={onBook}
        className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all hover:bg-white/10 active:scale-90"
        data-ocid="nav.book_button"
      >
        <BookMarked size={20} style={{ color: "#00E5CC" }} />
        <span
          style={{ color: "#00E5CC" }}
          className="text-[9px] uppercase tracking-widest font-bold"
        >
          Book
        </span>
      </button>

      <div
        style={{ width: 1, height: 28, background: "rgba(255,255,255,0.08)" }}
      />

      <button
        type="button"
        onClick={onAppMenu}
        className="flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all hover:bg-white/10 active:scale-90"
        data-ocid="nav.app_menu_button"
      >
        <Smartphone size={20} style={{ color: "rgba(255,255,255,0.7)" }} />
        <span className="text-white/50 text-[9px] uppercase tracking-widest">
          App Menu
        </span>
      </button>
    </div>
  );
}
