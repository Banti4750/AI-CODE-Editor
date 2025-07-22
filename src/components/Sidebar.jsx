import React, { useState } from 'react';
import FileExplorer from '../SideContent/FileExplorer';
import SearchContent from '../SideContent/SearchContent';

const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('explorer'); // 'explorer', 'search', 'source-control', 'debug', 'extensions'

  const renderContent = () => {
    switch (activeTab) {
      case 'explorer':
        return <div className="p-4 text-gray-300">
            <FileExplorer />
        </div>;
      case 'search':
        return <div className="p-4 text-gray-300">
            <SearchContent/>
        </div>;
      case 'source-control':
        return <div className="p-4 text-gray-300">Source Control Content</div>;
      case 'debug':
        return <div className="p-4 text-gray-300">Run and Debug Content</div>;
      case 'extensions':
        return <div className="p-4 text-gray-300">Extensions Content</div>;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full bg-gray-900 text-white">
      {/* Sidebar Tabs */}
      <div className="w-12 flex flex-col items-center py-4 space-y-4 border-r border-gray-700">
        <button
          className={`p-2 rounded ${activeTab === 'explorer' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
          onClick={() => setActiveTab('explorer')}
        >
          <span className="text-xl">📁</span> {/* Folder icon */}
        </button>
        <button
          className={`p-2 rounded ${activeTab === 'search' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
          onClick={() => setActiveTab('search')}
        >
          <span className="text-xl">🔍</span> {/* Search icon */}
        </button>
        <button
          className={`p-2 rounded ${activeTab === 'source-control' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
          onClick={() => setActiveTab('source-control')}
        >
          <span className="text-xl">🗄️</span> {/* Source Control icon */}
        </button>
        <button
          className={`p-2 rounded ${activeTab === 'debug' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
          onClick={() => setActiveTab('debug')}
        >
          <span className="text-xl">🐛</span> {/* Debug icon */}
        </button>
        <button
          className={`p-2 rounded ${activeTab === 'extensions' ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
          onClick={() => setActiveTab('extensions')}
        >
          <span className="text-xl">🧩</span> {/* Extensions icon */}
        </button>
      </div>

      {/* Sidebar Content */}
      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  );
};

export default Sidebar