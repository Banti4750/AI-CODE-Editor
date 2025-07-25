import {
  ChevronRight,
  ChevronDown,
  Folder,
  FolderOpen,
  File,
  FileText,
  Image,
  Code,
  Settings,
  Package,
  GitBranch,
  Database,
  Plus,
  RefreshCw,
  FolderPlus,
  FilePlus,
  Delete
} from 'lucide-react'
import React, { useState, useEffect } from 'react'

const FileExplorer = () => {
  const [expandedFolders, setExpandedFolders] = useState(new Set(['src']))
  const [selectedItem, setSelectedItem] = useState(null)
  const [fileStructure, setFileStructure] = useState([
    {
      name: 'src',
      type: 'folder',
      children: [
        { name: 'App.js', type: 'file' },
        { name: 'index.js', type: 'file' },
        { name: 'styles.css', type: 'file' },
        {
          name: 'components',
          type: 'folder',
          children: [
            { name: 'Header.jsx', type: 'file' },
            { name: 'Footer.jsx', type: 'file' }
          ]
        }
      ]
    },
    { name: 'package.json', type: 'file' },
    { name: 'README.md', type: 'file' },
    { name: '.gitignore', type: 'file' }
  ])

  const [showCreateMenu, setShowCreateMenu] = useState(false)
  const [createMenuPosition, setCreateMenuPosition] = useState({ x: 0, y: 0 })
  const [isCreating, setIsCreating] = useState(false)
  const [creatingType, setCreatingType] = useState('file')
  const [creatingParent, setCreatingParent] = useState(null)
  const [newItemName, setNewItemName] = useState('')

  const getFileIcon = (fileName) => {
    const iconProps = { size: 16 }
    const extension = fileName.split('.').pop()?.toLowerCase()

    switch (extension) {
      case 'jsx':
      case 'tsx':
        return <Code {...iconProps} className="text-blue-400" />
      case 'js':
      case 'ts':
        return <Code {...iconProps} className="text-yellow-400" />
      case 'css':
      case 'scss':
      case 'sass':
        return <Code {...iconProps} className="text-blue-500" />
      case 'html':
        return <Code {...iconProps} className="text-orange-400" />
      case 'json':
        return <Database {...iconProps} className="text-yellow-300" />
      case 'md':
        return <FileText {...iconProps} className="text-white" />
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'svg':
      case 'ico':
        return <Image {...iconProps} className="text-purple-400" />
      default:
        if (fileName.startsWith('.git')) {
          return <GitBranch {...iconProps} className="text-orange-500" />
        }
        if (fileName.includes('config') || fileName.startsWith('.')) {
          return <Settings {...iconProps} className="text-gray-400" />
        }
        return <File {...iconProps} className="text-gray-400" />
    }
  }

  // Mock function for when electronAPI is not available
  const mockElectronAPI = {
    getFileStructure: async () => {
      return [
        {
          name: 'src',
          type: 'folder',
          children: [
            { name: 'App.js', type: 'file' },
            { name: 'index.js', type: 'file' },
            { name: 'styles.css', type: 'file' },
            {
              name: 'components',
              type: 'folder',
              children: [
                { name: 'Header.jsx', type: 'file' },
                { name: 'Footer.jsx', type: 'file' }
              ]
            }
          ]
        },
        { name: 'package.json', type: 'file' },
        { name: 'README.md', type: 'file' },
        { name: '.gitignore', type: 'file' }
      ]
    },
    createFilesystemItem: async ({ name, type, parentPath }) => {
      // Mock success response
      return { success: true }
    }
  }

  useEffect(() => {
    const loadFileStructure = async () => {
      try {
        const electronAPI = window.electronAPI || mockElectronAPI
        const structure = await electronAPI.getFileStructure()
        setFileStructure(structure)
      } catch (error) {
        console.error('Error loading file structure:', error)
        // Fallback to default structure
      }
    }

    loadFileStructure()
  }, [])

  const toggleFolder = (folderPath) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath)
    } else {
      newExpanded.add(folderPath)
    }
    setExpandedFolders(newExpanded)
  }

  const findItemByPath = (items, targetPath, currentPath = '') => {
    for (let item of items) {
      const itemPath = currentPath ? `${currentPath}/${item.name}` : item.name
      if (itemPath === targetPath) {
        return item
      }
      if (item.type === 'folder' && item.children) {
        const found = findItemByPath(item.children, targetPath, itemPath)
        if (found) return found
      }
    }
    return null
  }

  const addItemToStructure = (items, parentPath, newItem) => {
    if (!parentPath) {
      return [...items, newItem].sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'folder' ? -1 : 1
        }
        return a.name.localeCompare(b.name)
      })
    }

    return items.map(item => {
      const currentPath = item.name
      if (currentPath === parentPath && item.type === 'folder') {
        const updatedChildren = [...(item.children || []), newItem].sort((a, b) => {
          if (a.type !== b.type) {
            return a.type === 'folder' ? -1 : 1
          }
          return a.name.localeCompare(b.name)
        })
        return { ...item, children: updatedChildren }
      }
      if (item.type === 'folder' && item.children) {
        return {
          ...item,
          children: addItemToStructure(item.children, parentPath.replace(`${currentPath}/`, ''), newItem)
        }
      }
      return item
    })
  }

  const handleCreateNew = (type, parentPath = null) => {
    setCreatingType(type)
    setCreatingParent(parentPath)
    setIsCreating(true)
    setNewItemName('')
    setShowCreateMenu(false)
  }

  const handleCreateSubmit = async () => {
    if (!newItemName.trim()) return

    try {
      const electronAPI = window.electronAPI || mockElectronAPI
      const result = await electronAPI.createFilesystemItem({
        name: newItemName.trim(),
        type: creatingType,
        parentPath: creatingParent || ''
      })

      if (result.success) {
        const newItem = {
          name: newItemName.trim(),
          type: creatingType,
          ...(creatingType === 'folder' && { children: [] })
        }

        setFileStructure(prev => addItemToStructure(prev, creatingParent, newItem))

        if (creatingParent && creatingType === 'folder') {
          setExpandedFolders(prev => new Set([...prev, creatingParent]))
        }
      } else {
        console.error('Failed to create item:', result.error)
      }
    } catch (error) {
      console.error('Error creating item:', error)
    } finally {
      setIsCreating(false)
      setNewItemName('')
      setCreatingParent(null)
    }
  }

  const handleCreateCancel = () => {
    setIsCreating(false)
    setNewItemName('')
    setCreatingParent(null)
  }

  const handleRefresh = async () => {
    try {
      const electronAPI = window.electronAPI || mockElectronAPI
      const structure = await electronAPI.getFileStructure()
      setFileStructure(structure)
      setSelectedItem(null)
      setExpandedFolders(new Set(['src']))
    } catch (error) {
      console.error('Error refreshing:', error)
    }
  }

  const handleContextMenu = (e, itemPath = null) => {
    e.preventDefault()
    setCreateMenuPosition({ x: e.clientX, y: e.clientY })
    setCreatingParent(itemPath)
    setShowCreateMenu(true)
  }

  const renderCreateInput = (parentPath, depth) => {
    if (!isCreating || creatingParent !== parentPath) return null

    const paddingLeft = depth * 12 + 8 + 20

    return (
      <div
        className="flex items-center py-1 px-2 text-sm"
        style={{ paddingLeft: `${paddingLeft}px` }}
      >
        <div className="mr-2">
          {creatingType === 'folder' ? (
            <Folder size={16} className="text-blue-400" />
          ) : (
            <File size={16} className="text-gray-400" />
          )}
        </div>
        <input
          type="text"
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleCreateSubmit()
            if (e.key === 'Escape') handleCreateCancel()
          }}
          onBlur={handleCreateCancel}
          className="bg-gray-700 text-white text-sm px-1 py-0.5 outline-none border border-blue-500 rounded flex-1"
          placeholder={`New ${creatingType} name...`}
          autoFocus
        />
      </div>
    )
  }

  const renderFileTree = (items, depth = 0, parentPath = '') => {
    const currentItems = [...items]

    return (
      <>
        {currentItems.map((item, index) => {
          const itemPath = parentPath ? `${parentPath}/${item.name}` : item.name
          const isExpanded = expandedFolders.has(itemPath)
          const isSelected = selectedItem === itemPath
          const paddingLeft = depth * 12 + 8

          return (
            <div key={`${itemPath}-${index}`}>
              <div
                className={`flex items-center py-1 px-2 hover:bg-gray-700 cursor-pointer text-sm ${
                  isSelected ? 'bg-gray-600' : ''
                }`}
                style={{ paddingLeft: `${paddingLeft}px` }}
                onClick={() => {
                  if (item.type === 'folder') {
                    toggleFolder(itemPath)
                  } else {
                    setSelectedItem(itemPath)
                  }
                }}
                onContextMenu={(e) => handleContextMenu(e, item.type === 'folder' ? itemPath : parentPath)}
              >
                {item.type === 'folder' ? (
                  <>
                    {isExpanded ? (
                      <ChevronDown size={16} className="mr-1 text-gray-400" />
                    ) : (
                      <ChevronRight size={16} className="mr-1 text-gray-400" />
                    )}
                    {isExpanded ? (
                      <FolderOpen size={16} className="mr-2 text-blue-400" />
                    ) : (
                      <Folder size={16} className="mr-2 text-blue-400" />
                    )}
                  </>
                ) : (
                  <>
                    <div className="w-4 mr-1"></div>
                    <div className="mr-2">
                      {getFileIcon(item.name)}
                    </div>
                  </>
                )}
                <span className="text-gray-200 truncate">{item.name}</span>
              </div>

              {item.type === 'folder' && isExpanded && (
                <div>
                  {renderCreateInput(itemPath, depth + 1)}
                  {item.children && renderFileTree(item.children, depth + 1, itemPath)}
                </div>
              )}
            </div>
          )
        })}
        {depth === 0 && renderCreateInput(null, 0)}
      </>
    )
  }

  return (
    <div className="bg-gray-900 text-white border-gray-700 relative h-96">
      {/* Header */}
      <div className="flex justify-between items-center p-3 border-b border-gray-700">
        <h1 className="text-sm font-medium text-gray-200">EXPLORER</h1>
        <div className="flex items-center space-x-1">
          <button
            className="p-1 hover:bg-gray-700 rounded"
            onClick={() => handleCreateNew('file')}
            title="New File"
          >
            <FilePlus size={16} className="text-gray-400" />
          </button>
          <button
            className="p-1 hover:bg-gray-700 rounded"
            onClick={() => handleCreateNew('folder')}
            title="New Folder"
          >
            <FolderPlus size={16} className="text-gray-400" />
          </button>
          <button
            className="p-1 hover:bg-gray-700 rounded"
            onClick={handleRefresh}
            title="Refresh Explorer"
          >
            <RefreshCw size={16} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Project name */}
      <div className="p-3 border-b border-gray-700">
        <div
          className="flex items-center"
          onContextMenu={(e) => handleContextMenu(e, null)}
        >
          <ChevronDown size={16} className="mr-1 text-gray-400" />
          <span className="text-sm font-medium text-gray-200">MY-PROJECT</span>
        </div>
      </div>

      {/* File tree */}
      <div
        className="overflow-y-auto flex-1"
        style={{ height: 'calc(100% - 80px)' }}
        onContextMenu={(e) => handleContextMenu(e, null)}
      >
        {renderFileTree(fileStructure)}
      </div>

      {/* Context Menu */}
      {showCreateMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowCreateMenu(false)}
          />
          <div
            className="fixed z-50 bg-gray-800 border border-gray-600 rounded shadow-lg py-1 min-w-48"
            style={{
              left: createMenuPosition.x,
              top: createMenuPosition.y
            }}
          >
            <button
              className="w-full text-left px-3 py-1 hover:bg-gray-700 text-sm flex items-center"
              onClick={() => handleCreateNew('file', creatingParent)}
            >
              <FilePlus size={16} className="mr-2 text-gray-400" />
              New File
            </button>
            <button
              className="w-full text-left px-3 py-1 hover:bg-gray-700 text-sm flex items-center"
              onClick={() => handleCreateNew('folder', creatingParent)}
            >
              <FolderPlus size={16} className="mr-2 text-gray-400" />
              New Folder
            </button>
             <button
              className="w-full text-left px-3 py-1 hover:bg-gray-700 text-sm flex items-center"
              onClick={() => handleCreateNew('folder', creatingParent)}
            >
              <Delete size={16} className="mr-2 text-gray-400" />
              Delete
            </button>
            <div className="border-t border-gray-600 my-1"></div>
            <button
              className="w-full text-left px-3 py-1 hover:bg-gray-700 text-sm flex items-center"
              onClick={handleRefresh}
            >
              <RefreshCw size={16} className="mr-2 text-gray-400" />
              Refresh
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default FileExplorer