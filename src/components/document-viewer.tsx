'use client'

import { Icons } from '@/components/ui/icons'
import { useState } from 'react'

export function DocumentViewer({ url }: { url: string }) {
  const [loading, setLoading] = useState(true)

  return (
    <div className="border rounded-lg h-[500px] relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Icons.spinner className="h-8 w-8 animate-spin" />
        </div>
      )}
      <iframe
        src={url}
        className="w-full h-full"
        onLoad={() => setLoading(false)}
      />
    </div>
  )
}
