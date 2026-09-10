import React from 'react';
import { 
  X, 
  Bookmark, 
  Trash2, 
  BookOpen, 
  FileText, 
  Calculator,
  ExternalLink
} from 'lucide-react';
import { BookmarkItem } from '../types';

interface BookmarksModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookmarks: BookmarkItem[];
  onRemoveBookmark: (id: string) => void;
  onClearAll: () => void;
  onNavigateToItem: (item: BookmarkItem) => void;
}

export const BookmarksModal: React.FC<BookmarksModalProps> = ({
  isOpen,
  onClose,
  bookmarks,
  onRemoveBookmark,
  onClearAll,
  onNavigateToItem,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-stone-900 text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bookmark className="w-5 h-5 text-amber-400 fill-amber-400" />
            <h2 className="text-base font-bold">
              My Revision Folder (सेव किए गए टॉपिक्स)
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Bookmarks */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1">
          {bookmarks.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Bookmark className="w-10 h-10 text-stone-300 mx-auto" />
              <p className="text-sm font-semibold text-stone-700">
                रिविज़न फ़ोल्डर अभी खाली है
              </p>
              <p className="text-xs text-stone-500 max-w-xs mx-auto">
                PYQs, नोट्स या फॉर्मूला पर बुकमार्क आइकन पर क्लिक करके उन्हें परीक्षा केंद्र जाने से पहले तुरंत दोहराने के लिए सेव करें।
              </p>
            </div>
          ) : (
            bookmarks.map((b) => (
              <div
                key={b.id}
                className="p-3 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100/80 transition-all flex items-start justify-between gap-3"
              >
                <div
                  onClick={() => {
                    onNavigateToItem(b);
                    onClose();
                  }}
                  className="space-y-1 cursor-pointer flex-1"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      {b.type === 'pyq' ? 'PYQ Question' : 'Notes / Formula'}
                    </span>
                    <span className="text-xs font-semibold text-stone-500">
                      {b.subjectName}
                    </span>
                  </div>
                  <h4 className="text-xs sm:text-sm font-bold text-stone-900 line-clamp-2">
                    {b.title}
                  </h4>
                  <p className="text-[11px] text-stone-500">{b.subtitle}</p>
                </div>

                <button
                  onClick={() => onRemoveBookmark(b.id)}
                  className="text-stone-400 hover:text-rose-600 p-1 transition-colors shrink-0"
                  title="Remove from saved"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {bookmarks.length > 0 && (
          <div className="bg-stone-50 px-5 py-3 border-t border-stone-200 flex items-center justify-between text-xs">
            <span className="text-stone-500 font-medium">
              {bookmarks.length} {bookmarks.length === 1 ? 'item' : 'items'} saved
            </span>
            <button
              onClick={onClearAll}
              className="text-rose-600 hover:text-rose-800 font-semibold"
            >
              Clear All
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
