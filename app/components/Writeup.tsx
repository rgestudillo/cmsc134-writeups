"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface WriteupProps {
  id: number
}

export default function Writeup({ id }: WriteupProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000"
  const [showWeb3, setShowWeb3] = useState(false)
  const [showDocs, setShowDocs] = useState(false)

  return (
    <Card className="mb-6 shadow-md dark:bg-gray-800">
      <CardHeader className="bg-gray-100 dark:bg-gray-700">
        <CardTitle className="text-2xl">Writeup {id}</CardTitle>
      </CardHeader>
      <CardContent className="mt-4 space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Web 3 Link</h3>
          <Button onClick={() => setShowWeb3(!showWeb3)} variant="outline">
            {showWeb3 ? "Hide API Call" : "Show API Call"}
          </Button>
          {showWeb3 && (
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md overflow-x-auto text-sm mt-2">
              <code>
                curl -X GET &quot;{apiUrl}/api/links?id={id}&type=web3&quot;
              </code>
            </pre>
          )}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Documentation Link</h3>
          <Button onClick={() => setShowDocs(!showDocs)} variant="outline">
            {showDocs ? "Hide API Call" : "Show API Call"}
          </Button>
          {showDocs && (
            <pre className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md overflow-x-auto text-sm mt-2">
              <code>
                curl -X GET &quot;{apiUrl}/api/links?id={id}&type=documentation&quot;
              </code>
            </pre>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

