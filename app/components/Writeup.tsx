"use client"

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface WriteupProps {
  id: number
  title: string
  web3Link?: string
  docsLink?: string
  web3ButtonTitle?: string
  docsButtonTitle?: string
  web3SectionTitle?: string
  docsSectionTitle?: string
}

export default function Writeup({
  title,
  web3Link,
  docsLink,
  web3ButtonTitle = "View",
  docsButtonTitle = "View",
  web3SectionTitle = "Web 3 Link",
  docsSectionTitle = "Documentation Link"
}: WriteupProps) {
  const isComingSoon = !web3Link && !docsLink

  return (
    <Card className="mb-6 shadow-md dark:bg-gray-800 overflow-hidden">
      <CardHeader className="bg-gray-100 dark:bg-gray-700">
        <CardTitle className="text-2xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="mt-4 space-y-4">
        {isComingSoon ? (
          <div className="text-center py-8">
            <h3 className="text-2xl font-semibold text-gray-500 dark:text-gray-400">Coming Soon</h3>
            <p className="mt-2 text-gray-400 dark:text-gray-500">We're working on something exciting. Stay tuned!</p>
          </div>
        ) : (
          <>
            {web3Link && (
              <div>
                <h3 className="text-lg font-semibold mb-2">{web3SectionTitle}</h3>
                <Button asChild variant="outline" className="w-full">
                  <a
                    href={web3Link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center"
                  >
                    {web3ButtonTitle}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            )}
            {docsLink && (
              <div>
                <h3 className="text-lg font-semibold mb-2">{docsSectionTitle}</h3>
                <Button asChild variant="outline" className="w-full">
                  <a
                    href={docsLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center"
                  >
                    {docsButtonTitle}
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

