"use client"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import "./account.css"

import { useRouter } from 'next/navigation'



const Account = () => {
    const router = useRouter()
    const supabase = createClientComponentClient()
    const handleSignOut = async () => {
        await supabase.auth.signOut()
        router.refresh()
    }
    return ( 
        <main>
            <div className="container">
                <div className="main__account">
                    <h1 className="account__title">Ваш Аккавунт</h1>
                    <button
                    onClick={handleSignOut}
                    >signOut</button>
                </div>
            </div>
        </main>
     );
}
 
export default Account;