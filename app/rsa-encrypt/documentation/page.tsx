"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function DocumentationPage() {
    const [markdownContent, setMarkdownContent] = useState<string>("")

    // Function to process markdown and convert to HTML
    const processMarkdown = (text: string) => {
        // Convert headers
        text = text.replace(/^# (.*$)/gm, '<h1 class="text-3xl font-bold mt-6 mb-4">$1</h1>')
        text = text.replace(/^## (.*$)/gm, '<h2 class="text-2xl font-semibold mt-5 mb-3">$1</h2>')
        text = text.replace(/^### (.*$)/gm, '<h3 class="text-xl font-medium mt-4 mb-2">$1</h3>')

        // Convert lists
        text = text.replace(/^\d+\. (.*)$/gm, '<li class="ml-5 list-decimal mb-1">$1</li>')
        text = text.replace(/^- (.*)$/gm, '<li class="ml-5 list-disc mb-1">$1</li>')

        // Process lists
        text = text.replace(/<\/li>\n<li class="ml-5 list-disc/g, '</li><li class="ml-5 list-disc')
        text = text.replace(/<\/li>\n<li class="ml-5 list-decimal/g, '</li><li class="ml-5 list-decimal')

        // Wrap lists with ul/ol
        const wrapListItems = (content: string, listType: string, tagName: string) => {
            const regex = new RegExp(`<li class="ml-5 list-${listType}[\\s\\S]*?</li>`, 'g')
            return content.replace(regex, (match) => {
                return `<${tagName} class="my-3">${match}</${tagName}>`
            })
        }

        text = wrapListItems(text, 'disc', 'ul')
        text = wrapListItems(text, 'decimal', 'ol')

        // Fix nested lists
        text = text.replace(/<\/ul>\n<ul class="my-3">/g, '')
        text = text.replace(/<\/ol>\n<ol class="my-3">/g, '')

        // Convert bold and italic
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        text = text.replace(/\*(.*?)\*/g, '<em>$1</em>')

        // Convert paragraphs (must be after lists)
        text = text.replace(/^(?!<[h|u|o|p]).*$/gm, (match) => {
            if (match.trim() === '') return ''
            return '<p class="my-2">' + match + '</p>'
        })

        // Handle empty lines
        text = text.replace(/\n\n/g, '\n')

        return text
    }

    useEffect(() => {
        // Fetch markdown from docs.md
        fetch('/rsa-encrypt/docs.md')
            .then(response => response.text())
            .then(text => {
                setMarkdownContent(processMarkdown(text))
            })
            .catch(error => {
                console.error('Error fetching markdown:', error)
                setMarkdownContent('<p class="text-red-500">Failed to load documentation</p>')
            })
    }, [])

    return (
        <div className="container mx-auto py-8 space-y-6">
            <Link href="/rsa-encrypt">
                <Button variant="outline" className="mb-6">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to RSA Encryption Tool
                </Button>
            </Link>

            <Card>
                <CardContent className="pt-6">
                    <div
                        className="prose prose-slate dark:prose-invert max-w-none documentation-content"
                        dangerouslySetInnerHTML={{ __html: markdownContent }}
                    />
                </CardContent>
            </Card>

            <style jsx global>{`
                .documentation-content h1 {
                    font-size: 2.25rem;
                    font-weight: 700;
                    margin-top: 1.5rem;
                    margin-bottom: 1rem;
                    color: var(--foreground);
                }
                
                .documentation-content h2 {
                    font-size: 1.75rem;
                    font-weight: 600;
                    margin-top: 1.25rem;
                    margin-bottom: 0.75rem;
                    color: var(--foreground);
                }
                
                .documentation-content h3 {
                    font-size: 1.35rem;
                    font-weight: 500;
                    margin-top: 1rem;
                    margin-bottom: 0.5rem;
                    color: var(--foreground);
                }
                
                .documentation-content p {
                    margin-bottom: 0.75rem;
                    line-height: 1.6;
                }
                
                .documentation-content ul, .documentation-content ol {
                    margin-left: 1.5rem;
                    margin-bottom: 1rem;
                }
                
                .documentation-content li {
                    margin-bottom: 0.25rem;
                }
                
                .documentation-content code {
                    background-color: rgba(0, 0, 0, 0.05);
                    padding: 0.1rem 0.3rem;
                    border-radius: 0.25rem;
                    font-family: monospace;
                }
                
                .dark .documentation-content code {
                    background-color: rgba(255, 255, 255, 0.1);
                }
                
                .documentation-content strong {
                    font-weight: 700;
                }
                
                .documentation-content em {
                    font-style: italic;
                }
            `}</style>
        </div>
    )
} 