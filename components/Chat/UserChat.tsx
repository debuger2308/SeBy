"use client"
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react"
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

const reverseChatId = (chatID: string) => {
    return chatID.split('@').reverse().join('@')
}

const UserChat = ({ session, chats, additionalChat }: { session: Session | null, chats: Chats[], additionalChat: Chats[] }) => {

    const supabase = createClientComponentClient()

    const {
        register,
        handleSubmit,
        reset
    } = useForm<Message>({ mode: "onBlur" })


    const [userChats, setUserChats] = useState(chats)

    const [additionalChats, setAdditionalChats] = useState(additionalChat)

    const [activeChat, setActiveChat] = useState(localStorage.getItem('SeBy/ActiveChat'))



    const infoActiveChat = userChats.find((chat) => {
        if (chat.ChatID === activeChat) return chat
    })

    const infoAdditionalChats = additionalChats.find((chat) => {
        if (reverseChatId(chat.ChatID) === activeChat) return chat
    })

    const [sendMsg, setSentMsg] = useState(infoActiveChat?.messages || [])
    const [recievedMsg, setRecievedMsg] = useState(infoAdditionalChats?.messages || [])

    const messages = [...sendMsg, ...recievedMsg].sort((a, b) => a.date - b.date)



    useEffect(() => {
        setSentMsg(infoActiveChat?.messages || [])
        setRecievedMsg(infoAdditionalChats?.messages || [])


        const channel = supabase
            .channel('chats')
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'chats',
                filter: `From=eq.${session?.user.id}`,
            },
                (payload: payload) => {
                    setUserChats([payload.new, ...userChats.filter((chat) => chat.id !== payload.new.id)])
                }
            )
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'chats',
                filter: `From=eq.${session?.user.id}`,
            },
                (payload: payload) => {
                    setUserChats([payload.new, ...userChats.filter((chat) => chat.id !== payload.new.id)])
                }
            )
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'chats',
                filter: `To=eq.${session?.user.id}`,
            },
                (payload: payload) => {
                    setAdditionalChats([payload.new, ...additionalChats.filter((chat) => chat.id !== payload.new.id)])
                }
            )
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'chats',
                filter: `To=eq.${session?.user.id}`,
            },
                (payload: payload) => {
                    setAdditionalChats([payload.new, ...additionalChats.filter((chat) => chat.id !== payload.new.id)])
                }
            )
            .subscribe()


        Promise.all(userChats.map(async (chat) => {
            if (!chat.Advert) {
                const { data, error }: { data: Adverts[] | null, error: any } = await supabase
                    .from('adverts')
                    .select()
                    .eq('id', chat.AdvertID)

                const advertInfo = data?.[0]
                const dataUrl = await supabase
                    .storage
                    .from("images")
                    .createSignedUrl(data?.[0]?.imgPath || '', 120)

                if (advertInfo) advertInfo.imgPath = dataUrl.data?.signedUrl || ''
                return { ...chat, Advert: advertInfo }
            }
            else return chat

        })).then((response) => {
            if (JSON.stringify(response) !== JSON.stringify(userChats)) setUserChats(response)
        })

        return () => {
            supabase.removeChannel(channel)
        }

    }, [userChats, additionalChats])


    const onSubmit: SubmitHandler<Message> = async (formData) => {
        reset()
        const { data, error } = await supabase
            .from('chats')
            .update({
                messages: [
                    ...sendMsg,
                    {
                        from: infoActiveChat?.From,
                        message: formData.message,
                        date: new Date().getTime()
                    }
                ]
            })
            .eq('ChatID', infoActiveChat?.ChatID)
            .select()
    }



    return (
        <div className="main__chat">
            <div className="chat">
                <div className="chat__aside">
                    {userChats.map((chat, id) => {
                        return (
                            <button
                                onClick={() => {
                                    localStorage.setItem('SeBy/ActiveChat', chat.ChatID)
                                    setActiveChat(chat.ChatID)
                                }}
                                key={id}
                                className={activeChat === chat.ChatID
                                    ? "chat__aside-btn chat__aside-btn--active"
                                    : "chat__aside-btn"
                                }>
                                {chat.Advert?.imgPath === '' &&
                                    <Image
                                        className="chat__aside-img"
                                        src='/images/noImage.png'
                                        width={60}
                                        height={60}
                                        alt="нема фото"
                                    />
                                }
                                {chat.Advert?.imgPath
                                    &&
                                    <Image
                                        className="chat__aside-img"
                                        src={chat.Advert?.imgPath || ''}
                                        width={60}
                                        height={60}
                                        alt=""
                                    />
                                }
                                <h3 className="chat__aside-title">{chat.Advert?.title}</h3>
                                <p className="chat__aside-subtitle">{chat?.messages?.[-1]?.message}ываыва</p>
                            </button>)
                    })}
                </div>

                <div className="chat__main">
                    <div className="chat__main-header">
                        <h3 className="chat__main-title">{infoActiveChat?.Advert?.title}</h3>
                        <Link href={`/${infoActiveChat?.Advert?.id}`}>
                            {infoActiveChat?.Advert?.imgPath === '' &&
                                <Image
                                    className="chat__main-img"
                                    src='/images/noImage.png'
                                    width={80}
                                    height={80}
                                    alt="нема фото"
                                />
                            }
                            {infoActiveChat?.Advert?.imgPath
                                &&
                                <Image

                                    className="chat__main-img"
                                    src={infoActiveChat.Advert?.imgPath || ''}
                                    width={80}
                                    height={80}
                                    alt=""
                                />
                            }
                        </Link>
                    </div>




                    <div className="chat__main-messages">
                        {messages.map((item) => {
                            return (
                                <div className={item.from === session?.user.id
                                    ? "chat__main-msg chat__main-msg--left"
                                    : "chat__main-msg chat__main-msg--right"
                                }>
                                    {item.message}
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
                        <button className="chat__form-btn">
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
        </div>
    );
}

export default UserChat;