'use client'
import Link from "next/link";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const ChatLink = ({ advertUserId, sessionUserId, advertId }: { advertUserId: string, sessionUserId: string, advertId: number }) => {

    const supabase = createClientComponentClient()

    return (
        <Link
            href="/chat"
            className="advert__info-chat advert__grid-cells"
            onClick={async () => {
                localStorage.setItem('SeBy/ActiveChat', sessionUserId + advertId + advertUserId)
                const { data, error } = await supabase
                    .from('chats')
                    .insert([
                        {
                            From: advertUserId,
                            To: sessionUserId,
                            AdvertID: advertId,
                            ChatID: advertUserId + '@' + advertId + "@" + sessionUserId,
                        },
                        {
                            From: sessionUserId,
                            To: advertUserId,
                            AdvertID: advertId,
                            ChatID: sessionUserId + '@' + advertId + '@' + advertUserId,
                        },
                    ])
                    .select()
                if (error) console.log(error);
            }}
        >
            Написати
        </Link>
    );
}

export default ChatLink;