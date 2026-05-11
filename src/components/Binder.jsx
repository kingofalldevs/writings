'use client';
import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronRight, 
  FileText, 
  Folder, 
  Search, 
  Trash2, 
  Plus, 
  FolderPlus,
  Book,
  Inbox,
  Info,
  Layers,
  Database,
  RotateCcw,
  Edit2,
  X
} from 'lucide-react';

const BinderItem = ({ item, level = 0, onSelect, selectedId, onToggle, expandedIds, onAddItem, onDeleteItem, onRenameItem }) => {
  const hasChildren = item.children && item.children.length > 0;
  const isSelected = selectedId === item.id;
  const isExpanded = expandedIds.includes(item.id);
  
  let Icon = item.type === 'folder' ? Folder : FileText;
  if (item.name === 'Ideabase') Icon = Database;
  if (item.name === 'Characters' || item.name === 'Chapters') Icon = Layers;
  
  return (
    <div className="flex flex-col">
      <div 
        onClick={() => onSelect(item)}
        className={`flex items-center py-2.5 px-4 rounded-2xl cursor-pointer transition-all duration-300 group ${isSelected ? 'bg-accent text-background shadow-lg shadow-accent/20' : 'hover:bg-accent/5 text-foreground/60 hover:text-foreground'}`}
        style={{ marginLeft: `${level * 1.25 + 0.5}rem`, marginRight: '0.75rem' }}
      >
        <div 
          onClick={(e) => {
            if (item.type === 'folder') {
              e.stopPropagation();
              onToggle(item.id);
            }
          }}
          className="w-5 h-5 flex items-center justify-center mr-1.5 opacity-30 group-hover:opacity-100 transition-opacity"
        >
          {item.type === 'folder' && (isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
        </div>
        
        <Icon size={16} className={`mr-3 ${isSelected ? 'text-background' : 'opacity-40 group-hover:opacity-100'}`} strokeWidth={1.5} />
        
        <span className={`text-[13px] truncate tracking-tight flex-1 ${isSelected ? 'font-bold' : 'font-medium'}`}>
          {item.name}
        </span>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all">
          {item.name !== 'Characters' && item.name !== 'Chapters' && item.name !== 'Ideabase' && (
            <button 
              onClick={(e) => { e.stopPropagation(); onRenameItem(item); }}
              className={`p-1.5 rounded-lg transition-all hover:scale-110 ${isSelected ? 'hover:bg-white/20 text-background' : 'hover:bg-accent/10 text-accent'}`}
              title="Rename"
            >
              <Edit2 size={12} />
            </button>
          )}
          <button 
            onClick={(e) => { e.stopPropagation(); onDeleteItem(item.id); }}
            className={`p-1.5 rounded-lg transition-all hover:scale-110 ${isSelected ? 'hover:bg-white/20 text-background' : 'hover:bg-red-500/10 text-red-500'}`}
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
          {item.type === 'folder' && (
            <>
              <button 
                onClick={(e) => { e.stopPropagation(); onAddItem(item.id, 'document', item.section); }}
                className={`p-1.5 rounded-lg transition-all hover:scale-110 ${isSelected ? 'hover:bg-white/20 text-background' : 'hover:bg-accent/10 text-accent'}`}
                title="New Document"
              >
                <Plus size={12} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onAddItem(item.id, 'folder', item.section); }}
                className={`p-1.5 rounded-lg transition-all hover:scale-110 ${isSelected ? 'hover:bg-white/20 text-background' : 'hover:bg-accent/10 text-accent'}`}
                title="New Folder"
              >
                <FolderPlus size={12} />
              </button>
            </>
          )}
        </div>
      </div>
      
      {isExpanded && hasChildren && (
        <div className="flex flex-col mt-1">
          {item.children.map(child => (
            <BinderItem 
              key={child.id} 
              item={child} 
              level={level + 1} 
              onSelect={onSelect} 
              selectedId={selectedId}
              onToggle={onToggle}
              expandedIds={expandedIds}
              onAddItem={onAddItem}
              onDeleteItem={onDeleteItem}
              onRenameItem={onRenameItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const Binder = ({ data, selectedId, onSelect, onAddItem, onDeleteItem, onRenameItem, onClose }) => {
  const [expandedIds, setExpandedIds] = useState(['ideabase']);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleExpand = (id) => {
    setExpandedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleItemSelect = (item) => {
    onSelect(item);
    if (item.type === 'folder') {
      toggleExpand(item.id);
    } else {
      // On mobile, close binder after selecting a document
      if (window.innerWidth < 768 && onClose) {
        onClose();
      }
    }
  };

  const sections = [
    { id: 'ideabase', name: 'Ideabase', icon: Database, items: data.ideabase || [] }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      <div 
        className="fixed inset-0 bg-background/40 backdrop-blur-sm z-[35] md:hidden transition-opacity duration-500"
        onClick={onClose}
      />
      
      <aside 
        className="fixed md:relative h-full flex flex-col transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] select-none border-r border-foreground/5 w-[280px] md:w-[320px] bg-background z-[40] md:z-20 shadow-2xl md:shadow-none"
      >
        {/* Mobile Header with Close Button */}
        <div className="flex md:hidden items-center justify-between px-6 pt-6 pb-2">
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] opacity-30">Ideabase</span>
          <button onClick={onClose} className="p-2 -mr-2 text-muted hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-6 pt-4 md:pt-10 pb-6">
        <div className="relative group">
          <Search size={14} className="absolute left-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity text-accent" />
          <input 
            type="text"
            placeholder="Search ideabase..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-accent/5 border-none rounded-2xl py-3 pl-11 pr-4 text-[13px] outline-none transition-all placeholder:opacity-30 focus:ring-1 focus:ring-accent/20 font-sans"
          />
        </div>
      </div>

      {/* Navigation Tree */}
      <div className="flex-1 overflow-y-auto px-2 space-y-12 pb-32 custom-scrollbar">
        {sections.map(section => (
          <div key={section.id} className="flex flex-col">
            <div 
              className="flex items-center justify-between px-6 py-2 mb-4 group cursor-pointer"
              onClick={() => toggleExpand(section.id)}
            >
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 rounded-2xl bg-accent/5 flex items-center justify-center group-hover:bg-accent/10 transition-all transform group-hover:rotate-3">
                  <section.icon size={18} className="text-accent opacity-60 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
                </div>
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] opacity-30 group-hover:opacity-60 transition-opacity">
                  {section.name}
                </span>
              </div>
              <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                {section.id === 'manuscript' && (
                  <button 
                    onClick={(e) => { e.stopPropagation(); if(confirm("Wipe all data and reset to Ideabase?")) onAddItem(null, 'reset', section.id); }}
                    className="p-2 hover:bg-red-500/10 rounded-xl text-red-500 transition-all hover:scale-110"
                    title="Reset to Ideabase"
                  >
                    <RotateCcw size={14} />
                  </button>
                )}
                <button 
                  onClick={(e) => { e.stopPropagation(); onAddItem(null, 'document', section.id); }}
                  className="p-2 hover:bg-accent/10 rounded-xl text-accent transition-all hover:scale-110"
                  title="New Document"
                >
                  <Plus size={14} />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); onAddItem(null, 'folder', section.id); }}
                  className="p-2 hover:bg-accent/10 rounded-xl text-accent transition-all hover:scale-110"
                  title="New Folder"
                >
                  <FolderPlus size={14} />
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              {section.items.map(item => (
                <BinderItem 
                  key={item.id}
                  item={item}
                  onSelect={handleItemSelect}
                  selectedId={selectedId}
                  onToggle={toggleExpand}
                  expandedIds={expandedIds}
                  onAddItem={onAddItem}
                  onDeleteItem={onDeleteItem}
                  onRenameItem={onRenameItem}
                />
              ))}
              
              {section.items.length === 0 && (
                <div className="px-6 py-8 text-center border-2 border-dashed border-accent/5 rounded-[2.5rem] mx-4 bg-accent/[0.01] flex flex-col items-center gap-2">
                  <Layers size={16} className="text-accent opacity-10" />
                  <p className="text-[10px] opacity-20 font-bold uppercase tracking-widest">Empty</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </aside>
    </>
  );
};

export default Binder;
