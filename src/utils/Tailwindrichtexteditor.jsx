import { useState, useRef, useEffect } from 'react';
import { Bold, Italic, Link2, List, ListOrdered } from 'lucide-react';

// ============================================
// Tailwind Rich Text Editor (Fixed Version)
// - No styled-jsx
// - Proper toolbar active state sync
// - Stable with React Hook Form
// ============================================

const TailwindRichTextEditor = ({ value, onChange, placeholder }) => {
  const editorRef = useRef(null);

  const [showLinkInput, setShowLinkInput] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const [formatState, setFormatState] = useState({
    bold: false,
    italic: false,
    ul: false,
    ol: false,
  });

  // Sync editor HTML from form value (important for edit mode)
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.innerHTML) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  // Update toolbar active states
  const updateFormatState = () => {
    setFormatState({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      ul: document.queryCommandState('insertUnorderedList'),
      ol: document.queryCommandState('insertOrderedList'),
    });
  };

  // Listen to cursor / selection changes
  useEffect(() => {
    document.addEventListener('selectionchange', updateFormatState);
    return () => {
      document.removeEventListener('selectionchange', updateFormatState);
    };
  }, []);

  const handleInput = () => {
    const html = editorRef.current.innerHTML;
    onChange(html);
    updateFormatState();
  };

  const formatText = (command, value = null) => {
    editorRef.current.focus();
    document.execCommand(command, false, value);
    updateFormatState();
  };

  const insertLink = () => {
    if (!linkUrl) return;
    formatText('createLink', linkUrl);
    setLinkUrl('');
    setShowLinkInput(false);
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1 items-center">
        <ToolbarButton
          active={formatState.bold}
          onClick={() => formatText('bold')}
          title="Bold (Ctrl+B)"
        >
          <Bold size={18} />
        </ToolbarButton>

        <ToolbarButton
          active={formatState.italic}
          onClick={() => formatText('italic')}
          title="Italic (Ctrl+I)"
        >
          <Italic size={18} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          active={showLinkInput}
          onClick={() => setShowLinkInput((s) => !s)}
          title="Insert Link"
        >
          <Link2 size={18} />
        </ToolbarButton>

        <Divider />

        <ToolbarButton
          active={formatState.ul}
          onClick={() => formatText('insertUnorderedList')}
          title="Bullet List"
        >
          <List size={18} />
        </ToolbarButton>

        <ToolbarButton
          active={formatState.ol}
          onClick={() => formatText('insertOrderedList')}
          title="Numbered List"
        >
          <ListOrdered size={18} />
        </ToolbarButton>

        {/* Link Input */}
        {showLinkInput && (
          <div className="flex items-center gap-2 ml-2 pl-2 border-l border-gray-300">
            <input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://example.com"
              className="px-3 py-1.5 border border-gray-300 rounded-md text-sm w-64 focus:ring-2 focus:ring-blue-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  insertLink();
                }
              }}
            />
            <button
              type="button"
              onClick={insertLink}
              className="px-3 py-1.5 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => {
                setShowLinkInput(false);
                setLinkUrl('');
              }}
              className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md text-sm hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onPaste={handlePaste}
        className="prose prose-sm max-w-none min-h-[200px] p-4 focus:outline-none
                   prose-p:my-2 prose-p:leading-relaxed
                   prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
                   prose-strong:font-semibold prose-strong:text-gray-900
                   prose-ul:my-2 prose-ol:my-2
                   prose-li:my-1"
        data-placeholder={placeholder}
        suppressContentEditableWarning
      />

      {/* Placeholder styling */}
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: #9ca3af;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

/* ---------------------------------- */
/* Reusable Toolbar Components */
/* ---------------------------------- */

const ToolbarButton = ({ active, onClick, title, children }) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-2 rounded transition-colors ${
      active
        ? 'bg-blue-100 text-blue-700'
        : 'text-gray-700 hover:bg-gray-200'
    }`}
  >
    {children}
  </button>
);

const Divider = () => (
  <div className="w-px h-6 bg-gray-300 mx-1" />
);

export default TailwindRichTextEditor;
