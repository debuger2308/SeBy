
import UserChat from "@/components/Chat/UserChat";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

type Messages = {
    from: string
    message: string
    date: number
}

type Chats = {
    id: number,
    From: string,
    To: string,
    AdvertID: string,
    ChatID: string,
    messages: Messages[]
}



const Chat = async () => {

    const supabase = createServerComponentClient({ cookies })
    const {
        data: { session },
    } = await supabase.auth.getSession()

    let { data: chats }: { data: Chats[] | null } = await supabase
        .from('chats')
        .select()
        .eq('From', session?.user.id)

    let { data: additionalChat }: { data: Chats[] | null } = await supabase
        .from('chats')
        .select()
        .eq('To', session?.user.id)



    return (
        <main>
            <UserChat session={session} chats={chats || []} additionalChat={additionalChat || []} />
        </main>
    );
}

export default Chat;