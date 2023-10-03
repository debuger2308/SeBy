
import type { Metadata } from 'next'
import { Nunito } from 'next/font/google'
import { Providers } from './providers'
import Header from '@/components/Header/Header'
import "./reset.css"
import "./global.css"
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'

const nunito = Nunito({ subsets: ['latin'] })

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
    title: 'SeBy',
    description: 'Сервіс оголошень України. Купівля/Продаж.',
}


export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = createServerComponentClient({ cookies })
    const {
        data: { session },
    } = await supabase.auth.getSession()
    return (
        <html lang='en'>
            <body style={nunito.style}>
                <Providers>
                    <Header session={session} />
                    {children}
                </Providers>
            </body>
        </html>
    )
}
