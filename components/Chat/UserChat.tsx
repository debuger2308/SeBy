"use client"
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react"
import "./UserChat.css"
import { createClientComponentClient, type Session } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image'
import Link from "next/link"

type Messages = {
    from: string
    message: string
    date: number
}
type Adverts = {
    id: number
    title: string
    price: string
    tel: string
    subtitle: string
    imgPath: string
    city: string
    category: string
    user: string
}

type Chats = {
    id: number,
    From: string,
    To: string,
    AdvertID: string,
    ChatID: string,
    messages: Messages[],
    Advert?: Adverts
}
type payload = {
    new: Chats
}
type Message = {
    message: string
}
type AdvertInfo = {
    Advert: Adverts | null;
    ChatID: string;
}
type ChatsMessages = {
    message: Messages[]
    ChatID: string
}


function getMessages(chats: Chats[], additionalChat: Chats[]) {

    const messages: ChatsMessages[] = []

    chats.forEach((item) => {

        messages.push({
            message: additionalChat.find((elem) => elem.ChatID === item.ChatID.split("@").reverse().join("@"))
                ?.messages.concat(item.messages)
                .sort((a, b) => a.date - b.date)
                || [],
            ChatID: item.ChatID
        })
    })
    return messages

}

const UserChat = ({ session, chats, additionalChat }: { session: Session | null, chats: Chats[], additionalChat: Chats[] }) => {

    const scrollChatRef = useRef<HTMLDivElement>(null)

    const supabase = createClientComponentClient()

    const {
        register,
        handleSubmit,
        reset
    } = useForm<Message>({ mode: "onBlur" })

    const [chatsInfo, setChatsInfo] = useState<AdvertInfo[]>([])

    const [isLoadingChats, setIsLoadingChats] = useState(true)

    const [isActiveChatMenu, setIsActiveChatMenu] = useState(true)

    const [activeChat, setActiveChat] = useState<AdvertInfo>()

    const [messages, setMessages] = useState<ChatsMessages[]>([])

    useEffect(() => {
        setMessages(getMessages(chats, additionalChat))

        Promise.all(chats.map(async (chat) => {
            const { data, error }: { data: Adverts[] | null, error: any } = await supabase
                .from('adverts')
                .select()
                .eq('id', chat.AdvertID)

            if (data) {
                const advertInfo = data?.[0]
                const dataUrl = await supabase
                    .storage
                    .from("images")
                    .createSignedUrl(data?.[0]?.imgPath || '', 120)

                if (advertInfo) advertInfo.imgPath = dataUrl.data?.signedUrl || ''
                return { Advert: advertInfo, ChatID: chat.ChatID }
            }
            else return { Advert: null, ChatID: chat.ChatID }

        })).then((response) => {
            setChatsInfo(response.reverse())
            setIsLoadingChats(false)
        })
    }, [])

    useEffect(() => {
        scrollChatRef.current?.scrollIntoView({ behavior: "instant" });
    }, [activeChat])




    useEffect(() => {

        setActiveChat(chatsInfo?.find((chat => chat.ChatID === localStorage.getItem('SeBy/ActiveChat'))))

    }, [chatsInfo])



    useEffect(() => {

        const channel = supabase
            .channel('chats')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'chats',
                filter: `From=eq.${session?.user.id}`,
            },
                (payload: payload) => {

                    const newMessages = messages.find((item => item.ChatID === payload.new.ChatID))
                        ?.message.filter(item => item.from !== session?.user.id).concat(payload.new.messages)
                        .sort((a, b) => a.date - b.date) || []

                    setMessages([...messages.filter((item) => item.ChatID !== payload.new.ChatID),
                    { message: newMessages, ChatID: payload.new.ChatID }
                    ])
                }
            )
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'chats',
                filter: `From=eq.${session?.user.id}`,
            },
                async (payload: payload) => {
                    const { data, error }: { data: Adverts[] | null, error: any } = await supabase
                        .from('adverts')
                        .select()
                        .eq('id', payload.new.AdvertID)

                    if (data) {
                        const advertInfo = data?.[0]
                        const dataUrl = await supabase
                            .storage
                            .from("images")
                            .createSignedUrl(data?.[0]?.imgPath || '', 120)

                        if (advertInfo) advertInfo.imgPath = dataUrl.data?.signedUrl || ''
                        setChatsInfo([...chatsInfo, { Advert: advertInfo, ChatID: payload.new.ChatID }])
                    }
                }
            )
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'chats',
                filter: `To=eq.${session?.user.id}`,
            },
                (payload: payload) => {

                    const newMessages = messages.find((item => item.ChatID === payload.new.ChatID.split("@").reverse().join("@")))
                        ?.message.filter(item => item.from === session?.user.id).concat(payload.new.messages)
                        .sort((a, b) => a.date - b.date) || []

                    setMessages([...messages.filter((item) => item.ChatID !== payload.new.ChatID.split("@").reverse().join("@")),
                    { message: newMessages, ChatID: payload.new.ChatID.split("@").reverse().join("@") }
                    ])


                }
            )
            .subscribe()

        scrollChatRef.current?.scrollIntoView({ behavior: 'instant' });

        setChatsInfo([...chatsInfo.sort((a, b) => {
            const lastMessageA = messages.find(item => item.ChatID === a.ChatID)?.message.slice(-1)[0].date || 0
            const lastMessageB = messages.find(item => item.ChatID === b.ChatID)?.message.slice(-1)[0].date || 0
            return lastMessageB - lastMessageA
        })])

        return () => {
            supabase.removeChannel(channel)
        }

    }, [messages])


    const onSubmit: SubmitHandler<Message> = async (formData) => {
        reset()
        const { data, error } = await supabase
            .from('chats')
            .update({
                messages: [
                    ...messages?.find(msgInfo => msgInfo.ChatID === activeChat?.ChatID)
                        ?.message.filter((message) => message.from === session?.user.id) || [],
                    {
                        from: session?.user.id,
                        message: formData.message,
                        date: new Date().getTime()
                    }
                ]
            })
            .eq('ChatID', activeChat?.ChatID)
            .select()
    }

    return (
        <div className="main__chat">
            {chatsInfo.length === 0 && !isLoadingChats ?
                <>
                    <h1 className="chat__empty-message">У вас немає активних чатів</h1>
                    <Link href="/" className="chat__empty-link">
                        На головну
                        <svg
                            className="chat__empty-icon"
                            xmlns="http://www.w3.org/2000/svg"
                            shapeRendering="geometricPrecision"
                            textRendering="geometricPrecision"
                            imageRendering="optimizeQuality"
                            fillRule="evenodd"
                            clipRule="evenodd"
                            viewBox="0 0 512 243.58"
                        >
                            <path
                                fillRule="nonzero"
                                d="M373.57 0 512 120.75 371.53 243.58l-20.92-23.91 94.93-83L0 137.09v-31.75l445.55-.41-92.89-81.02z"
                            />
                        </svg>
                    </Link>
                </>

                : <div className="chat">
                    <div className={isActiveChatMenu ? "chat__aside" : "chat__aside chat__aside--disabled"}>
                        {chatsInfo?.map((info, id) => {

                            const lastMessage = messages.find(item => item.ChatID === info.ChatID)?.message.slice(-1)[0]

                            return (
                                <button
                                    onClick={() => {
                                        localStorage.setItem('SeBy/ActiveChat', info.ChatID)
                                        setActiveChat(chatsInfo?.find((chat => chat.ChatID === info.ChatID)))
                                        setIsActiveChatMenu(false)
                                    }}
                                    key={id}
                                    className={activeChat?.ChatID === info.ChatID
                                        ? "chat__aside-btn chat__aside-btn--active"
                                        : "chat__aside-btn"
                                    }>
                                    {info.Advert?.imgPath === '' &&
                                        <Image
                                            className="chat__aside-img"
                                            src='/images/noImage.png'
                                            width={60}
                                            height={60}
                                            alt="нема фото"
                                        />
                                    }
                                    {info.Advert?.imgPath && info.Advert?.imgPath !== ''
                                        &&
                                        <Image
                                            className="chat__aside-img"
                                            src={info.Advert?.imgPath}
                                            width={60}
                                            height={60}
                                            alt=""
                                        />
                                    }
                                    <h3 className="chat__aside-title">{info.Advert?.title}</h3>
                                    <p className="chat__aside-subtitle">{lastMessage?.message}</p>
                                </button>)
                        })}

                    </div>

                    <div className={isActiveChatMenu ? "chat__main chat__main--disabled" : "chat__main"}>
                        <div className="chat__main-header">
                            <button
                                onClick={() => {
                                    setIsActiveChatMenu(true)
                                }}
                                className="chat__header-back-btn">
                                <svg
                                    className="chat__header-back-icon"
                                    version="1.1"
                                    id="Layer_1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    x="0px"
                                    y="0px"
                                    width="94.051px"
                                    height="122.879px"
                                    viewBox="0 0 94.051 122.879"
                                    enableBackground="new 0 0 94.051 122.879"
                                    xmlSpace="preserve"
                                >
                                    <g>
                                        <path d="M92.125,110.623c2.619,2.692,2.561,6.995-0.135,9.618c-2.689,2.618-6.994,2.558-9.611-0.137L29.865,65.95l4.875-4.737 l-4.895,4.747c-2.623-2.705-2.56-7.024,0.146-9.644c0.081-0.076,0.159-0.148,0.239-0.22L82.377,2.774 c2.619-2.694,6.924-2.755,9.613-0.137c2.695,2.623,2.754,6.925,0.135,9.618L44.229,61.232L92.125,110.623L92.125,110.623 L92.125,110.623z M12.651,6.325C12.651,2.832,9.819,0,6.325,0C2.833,0,0,2.832,0,6.325v110.229c0,3.493,2.833,6.325,6.325,6.325 c3.494,0,6.326-2.832,6.326-6.325V6.325L12.651,6.325z" />
                                    </g>
                                </svg>

                            </button>
                            <h3 className="chat__main-title">{activeChat?.Advert?.title}</h3>
                            <Link href={`/${activeChat?.Advert?.id}`}>
                                {activeChat?.Advert?.imgPath === '' &&
                                    <Image
                                        className="chat__main-img"
                                        src='/images/noImage.png'
                                        width={80}
                                        height={80}
                                        alt="нема фото"
                                    />
                                }
                                {activeChat?.Advert?.imgPath && activeChat?.Advert?.imgPath !== ''
                                    &&
                                    <Image

                                        className="chat__main-img"
                                        src={activeChat.Advert?.imgPath}
                                        width={80}
                                        height={80}
                                        alt=""
                                    />
                                }
                            </Link>
                        </div>




                        <div className="chat__main-messages">
                            {
                                messages?.find(msgInfo => msgInfo.ChatID === activeChat?.ChatID)?.message.map((item, id) => {
                                    const messageDate = new Date(item.date)
                                    const DateDay = messageDate.getDate() < 10 ? "0" + messageDate.getDate() : messageDate.getDate()
                                    const DateMonth = messageDate.getMonth() + 1 < 10 ? "0" + messageDate.getMonth() + 1: messageDate.getMonth() + 1
                                    const DateYear = messageDate.getFullYear()
                                    const DateHours = messageDate.getHours() < 10 ? "0" + messageDate.getHours() : messageDate.getHours()
                                    console.log(DateHours);
                                    const DateMin = messageDate.getMinutes() < 10 ? "0" + messageDate.getMinutes() : messageDate.getMinutes()
                                    return (
                                        <div ref={scrollChatRef} key={id} className={item.from === session?.user.id
                                            ? "chat__main-msg chat__main-msg--left"
                                            : "chat__main-msg chat__main-msg--right"
                                        }>


                                            <p className="chat__message">
                                                {item.message}
                                            </p>

                                            <p className="chat__message-time">
                                                {`${DateDay}/${DateMonth}/${DateYear} ${DateHours}:${DateMin}`}
                                            </p>
                                        </div>
                                    )
                                })}

                        </div>




                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="chat__form">
                            <input
                                {...register('message')}
                                type="text"
                                className="chat__form-input"
                                required
                            />
                            <button className="chat__form-btn" disabled={activeChat === undefined}>
                                <svg
                                    className="chat__form-btn-icon"
                                    version="1.1"
                                    id="Layer_1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    x="0px"
                                    y="0px"
                                    viewBox="0 0 122.88 71.9"
                                    xmlSpace="preserve"
                                >
                                    <g>
                                        <path d="M29.56,0h88.02c1.57,0,2.95,0.64,3.9,1.67c0.96,1.03,1.5,2.46,1.38,4.03l-4.42,60.49c-0.09,1.18-0.53,2.28-1.22,3.2 c-0.14,0.3-0.33,0.57-0.59,0.8c-0.17,0.15-0.36,0.28-0.56,0.37c-1.05,0.83-2.36,1.33-3.74,1.33l-88.02,0 c-1.57,0-2.95-0.64-3.91-1.67c-0.96-1.03-1.49-2.46-1.38-4.03l1.25-10.18h4.37l-1.08,7.78l0,0l33.11-30.93L27.67,7.72l-0.29,3.93 H23l0.43-5.95c0.11-1.57,0.86-3,1.97-4.03C26.51,0.64,27.99,0,29.56,0L29.56,0L29.56,0z M2.19,49.78C0.98,49.78,0,48.8,0,47.59 c0-1.21,0.98-2.19,2.19-2.19h28.89c1.21,0,2.19,0.98,2.19,2.19c0,1.21-0.98,2.19-2.19,2.19H2.19L2.19,49.78z M13.02,36.22 c-1.21,0-2.19-0.98-2.19-2.19c0-1.21,0.98-2.19,2.19-2.19h25.06c1.21,0,2.19,0.98,2.19,2.19c0,1.21-0.98,2.19-2.19,2.19H13.02 L13.02,36.22z M2.19,22.66C0.98,22.66,0,21.68,0,20.47c0-1.21,0.98-2.19,2.19-2.19h28.89c1.21,0,2.19,0.98,2.19,2.19 c0,1.21-0.98,2.19-2.19,2.19H2.19L2.19,22.66z M59.87,35.64L25.74,67.52h85.53L83.2,35.64l-10.64,8.54l0,0 c-0.83,0.67-2.01,0.71-2.8,0.03L59.87,35.64L59.87,35.64L59.87,35.64z M86.74,32.81l27.5,31.23l4.13-56.6L86.74,32.81L86.74,32.81 L86.74,32.81z M30.71,4.37l40.73,35.31l44.03-35.31H30.71L30.71,4.37L30.71,4.37z" />
                                    </g>
                                </svg>

                            </button>
                        </form>
                    </div>
                </div>
            }
        </div>
    );
}

export default UserChat;