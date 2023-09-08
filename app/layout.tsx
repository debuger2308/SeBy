
import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import { Providers } from './providers'
import Header from '@/components/Header/Header'
import "./reset.css"
import "./global.css"

const nunito = Nunito({ subsets: ['latin'] })


export const metadata: Metadata = {
    title: 'SeBy',
    description: 'Торговая площадка',
}


export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    
    return (
        <html lang='en'>
            <body style={nunito.style}>
                <Providers>
                    <Header />
                    {children}
                </Providers>
            </body>
        </html>
    )
}
