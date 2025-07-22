import { Dot } from 'lucide-react'
import React from 'react'

const FileExplorer = () => {
  return (
    <>
        {/* Top Explorer */}
        <div className="flex justify-between items-center p-4 border-b border-gray-700">
            <h1>Explorer</h1>
            <Dot/>
           </div>
    </>
  )
}

export default FileExplorer