"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Sparkles } from "lucide-react"

export default function WelcomeModal() {
    const [isOpen, setIsOpen] = useState(false)

    useEffect(() => {
        setIsOpen(true)
    }, [])

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="text-2xl flex items-center justify-center">
                        CMSC 134 WriteUps Platform
                    </DialogTitle>
                    <DialogDescription className="text-center">
                        Explore a decentralized archive of CMSC 134 write-ups securely stored on the Ethereum blockchain.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <h3 className="font-semibold mb-4 text-center">Key Features:</h3>
                    <ul className="space-y-2">
                        {[
                            "Ethereum blockchain-secured storage",
                            "Tamper-proof academic resources",
                            "Decentralized and censorship-resistant access",
                            "Smart contract-based verification",
                            "Web3 integration for seamless interaction",
                        ].map((feature, index) => (
                            <li key={index} className="flex items-center">
                                <Sparkles className="mr-2 h-4 w-4 text-yellow-500" />
                                {feature}
                            </li>
                        ))}
                    </ul>
                    <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                        Each write-up includes detailed documentation stored immutably on the blockchain, ensuring transparency and authenticity.
                    </p>
                </div>
                <DialogFooter>
                    <Button onClick={() => setIsOpen(false)} className="w-full">Explore Writeups</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
