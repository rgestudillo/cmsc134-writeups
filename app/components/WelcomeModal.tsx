'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function WelcomeModal() {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        setIsOpen(true)
    }, [])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Welcome to Kashi Tiris April Dexter Loui</DialogTitle>
                    <DialogDescription>
                        Discover our innovative approach to content management and blockchain integration
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <h3 className="font-semibold mb-2">Our Unique Features:</h3>
                    <ul className="list-disc pl-5 space-y-2">
                        <li>Blog content securely stored on the Ethereum blockchain</li>
                        <li>Decentralized access ensuring censorship resistance</li>
                        <li>Smart contract integration for automated content management</li>
                        <li>Immutable version history preserved on the blockchain</li>
                        <li>Seamless integration of Web3 technologies with traditional documentation</li>
                    </ul>
                    <p className="mt-4">
                        Experience the future of content creation and collaboration, where blockchain
                        technology meets innovative documentation practices. Explore our writeups to
                        see how we&apos;re revolutionizing the way information is stored, accessed, and verified.
                    </p>
                </div>
                <DialogFooter>
                    <Button onClick={() => setIsOpen(false)} className="w-full">Explore Writeups</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

