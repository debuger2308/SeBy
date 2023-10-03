"use client"
import { useTheme } from 'next-themes'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from "next/navigation"

import "./Header.css"
import { Dancing_Script } from 'next/font/google';

import type { Session } from '@supabase/auth-helpers-nextjs'

const DancingScript = Dancing_Script({ subsets: ['latin'], weight: '700' })

const Header = ({ session }: { session: Session | null }) => {
    const { theme, setTheme } = useTheme()
    const [mounted, setMounted] = useState(false)
    const pathname = usePathname()
    const [isBurgMenuActive, setIsBurgMenuActive] = useState(false)
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }
    window.addEventListener('resize', () => { setIsBurgMenuActive(false) })
    return (
        <header>
            <div className="container">
                <div className="header">
                    <Link href="/" style={DancingScript.style} className={pathname === "/" ? "header__logo header__logo--active" : "header__logo"}>
                        SeBy
                    </Link>

                    <aside className={isBurgMenuActive ? "header__aside header__aside--active" : "header__aside"}>

                        <Link
                            className={pathname === "/newadvert" ? "header__aside-link header__aside-link--active" : "header__aside-link"}
                            href="/newadvert">
                            
                            <svg
                                className='header__aside-svg'
                                id="Layer_1"
                                data-name="Layer 1"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 95.9 122.88"
                            >
                                <title>checklist</title>
                                <path d="M37.06,5v5a2.52,2.52,0,0,1-2.28,2.5,2.86,2.86,0,0,1-.89.14H24.6V23H71.29V12.68H62a2.81,2.81,0,0,1-.89-.14A2.52,2.52,0,0,1,58.84,10V5ZM18.4,49.25a2.25,2.25,0,1,1,3.74-2.51l1.23,1.82,4.87-5.92a2.25,2.25,0,0,1,3.48,2.86L25,53.7a2,2,0,0,1-.54.5,2.24,2.24,0,0,1-3.12-.61L18.4,49.25Zm0,23.28A2.25,2.25,0,1,1,22.14,70l1.23,1.82,4.87-5.93a2.25,2.25,0,0,1,3.48,2.86L25,77a1.88,1.88,0,0,1-.54.51,2.24,2.24,0,0,1-3.12-.62L18.4,72.53Zm0,24.2a2.25,2.25,0,1,1,3.74-2.51l1.23,1.83,4.87-5.93A2.25,2.25,0,0,1,31.72,93L25,101.18a2,2,0,0,1-.54.5,2.24,2.24,0,0,1-3.12-.61L18.4,96.73Zm5-68.57a3.85,3.85,0,0,1-2.68-1.11c-.09-.09-.14-.18-.23-.27a3.94,3.94,0,0,1-.89-2.41V19.28h-14a.49.49,0,0,0-.4.18.67.67,0,0,0-.18.4v97.4a.42.42,0,0,0,.18.4.56.56,0,0,0,.4.18H90.32a.56.56,0,0,0,.4-.18.44.44,0,0,0,.18-.4V19.86a.67.67,0,0,0-.18-.4.5.5,0,0,0-.4-.18h-14v5.09a3.89,3.89,0,0,1-.9,2.41c-.08.09-.13.18-.22.27a3.85,3.85,0,0,1-2.68,1.11ZM5.62,122.88A5.63,5.63,0,0,1,0,117.26V19.86a5.63,5.63,0,0,1,5.62-5.62h14V11.47A3.79,3.79,0,0,1,23.4,7.68h8.66V4.2a4.14,4.14,0,0,1,1.25-2.95A4.13,4.13,0,0,1,36.25,0h23.4a4.15,4.15,0,0,1,2.94,1.25,4.14,4.14,0,0,1,1.25,3V7.68H72.5a3.79,3.79,0,0,1,3.79,3.79v2.77h14a5.63,5.63,0,0,1,5.63,5.62v97.4a5.63,5.63,0,0,1-5.63,5.62ZM76.37,99.6a2.55,2.55,0,0,0,0-5.09H42.56a2.55,2.55,0,0,0,0,5.09H76.37Zm0-48.8a2.55,2.55,0,0,0,0-5.09H42.56a2.55,2.55,0,0,0,0,5.09Zm0,24.07a2.55,2.55,0,0,0,0-5.09H42.56a2.55,2.55,0,0,0,0,5.09Z" />
                            </svg>
                            Подати оголошення
                        </Link>

                        {session &&
                            <Link
                                href="/chat"
                                className={pathname === "/chat" ? "header__aside-link header__aside-link--active" : "header__aside-link"}>
                                <svg className='header__aside-svg'
                                    data-name="Livello 1"
                                    id="Livello_1"
                                    viewBox="0 0 128 128"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <title />
                                    <path d="M116.73,31.83a3,3,0,0,0-4.2-.61L64.14,67.34a1,1,0,0,1-1.2,0L15.5,31.06a3,3,0,1,0-3.64,4.77L49.16,64.36,12.27,92.16A3,3,0,1,0,15.88,97L54.11,68.14l5.18,4a7,7,0,0,0,8.43.06l5.44-4.06L111.84,97a3,3,0,1,0,3.59-4.81L78.17,64.35,116.12,36A3,3,0,0,0,116.73,31.83Z" />
                                    <path d="M113,19H15A15,15,0,0,0,0,34V94a15,15,0,0,0,15,15h98a15,15,0,0,0,15-15V34A15,15,0,0,0,113,19Zm9,75a9,9,0,0,1-9,9H15a9,9,0,0,1-9-9V34a9,9,0,0,1,9-9h98a9,9,0,0,1,9,9Z" />
                                </svg>
                                Повідомлення
                            </Link>
                        }
                        <Link href="/auth/login"
                            className={pathname === "/auth/login"
                                || pathname === "/auth/signup"
                                || pathname === "/account"
                                ? 'header__aside-link header__aside-link--active'
                                : "header__aside-link"}>
                            <svg className='header__aside-svg' viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                                <defs>
                                    <style dangerouslySetInnerHTML={{ __html: ".cls-1{fill:none;}" }} />
                                </defs>
                                <title />
                                <g data-name="Layer 2" id="Layer_2">
                                    <path d="M16,29A13,13,0,1,1,29,16,13,13,0,0,1,16,29ZM16,5A11,11,0,1,0,27,16,11,11,0,0,0,16,5Z" />
                                    <path d="M16,17a5,5,0,1,1,5-5A5,5,0,0,1,16,17Zm0-8a3,3,0,1,0,3,3A3,3,0,0,0,16,9Z" />
                                    <path d="M25.55,24a1,1,0,0,1-.74-.32A11.35,11.35,0,0,0,16.46,20h-.92a11.27,11.27,0,0,0-7.85,3.16,1,1,0,0,1-1.38-1.44A13.24,13.24,0,0,1,15.54,18h.92a13.39,13.39,0,0,1,9.82,4.32A1,1,0,0,1,25.55,24Z" />
                                </g>
                                <g id="frame">
                                    <rect className="cls-1" height={32} width={32} />
                                </g>
                            </svg>
                            Аккаунт
                        </Link>

                        <div className="header__color-theme">
                            <button
                                onClick={() => {
                                    setTheme("light")
                                }}
                                className='header__color-btn'>
                                <svg
                                    className={theme === "light" ? "header__color-svg header__color-svg--active" : "header__color-svg"}
                                    version="1.1"
                                    id="Layer_1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    x="0px"
                                    y="0px"
                                    viewBox="0 0 240 240"
                                    xmlSpace="preserve"
                                >
                                    <g>
                                        <path d="M58.57,25.81c-2.13-3.67-0.87-8.38,2.8-10.51c3.67-2.13,8.38-0.88,10.51,2.8l9.88,17.1c2.13,3.67,0.87,8.38-2.8,10.51 c-3.67,2.13-8.38,0.88-10.51-2.8L58.57,25.81L58.57,25.81z M120,51.17c19.01,0,36.21,7.7,48.67,20.16 C181.12,83.79,188.83,101,188.83,120c0,19.01-7.7,36.21-20.16,48.67c-12.46,12.46-29.66,20.16-48.67,20.16 c-19.01,0-36.21-7.7-48.67-20.16C58.88,156.21,51.17,139.01,51.17,120c0-19.01,7.7-36.21,20.16-48.67 C83.79,58.88,101,51.17,120,51.17L120,51.17z M158.27,81.73c-9.79-9.79-23.32-15.85-38.27-15.85c-14.95,0-28.48,6.06-38.27,15.85 c-9.79,9.79-15.85,23.32-15.85,38.27c0,14.95,6.06,28.48,15.85,38.27c9.79,9.79,23.32,15.85,38.27,15.85 c14.95,0,28.48-6.06,38.27-15.85c9.79-9.79,15.85-23.32,15.85-38.27C174.12,105.05,168.06,91.52,158.27,81.73L158.27,81.73z M113.88,7.71c0-4.26,3.45-7.71,7.71-7.71c4.26,0,7.71,3.45,7.71,7.71v19.75c0,4.26-3.45,7.71-7.71,7.71 c-4.26,0-7.71-3.45-7.71-7.71V7.71L113.88,7.71z M170.87,19.72c2.11-3.67,6.8-4.94,10.48-2.83c3.67,2.11,4.94,6.8,2.83,10.48 l-9.88,17.1c-2.11,3.67-6.8,4.94-10.48,2.83c-3.67-2.11-4.94-6.8-2.83-10.48L170.87,19.72L170.87,19.72z M214.19,58.57 c3.67-2.13,8.38-0.87,10.51,2.8c2.13,3.67,0.88,8.38-2.8,10.51l-17.1,9.88c-3.67,2.13-8.38,0.87-10.51-2.8 c-2.13-3.67-0.88-8.38,2.8-10.51L214.19,58.57L214.19,58.57z M232.29,113.88c4.26,0,7.71,3.45,7.71,7.71 c0,4.26-3.45,7.71-7.71,7.71h-19.75c-4.26,0-7.71-3.45-7.71-7.71c0-4.26,3.45-7.71,7.71-7.71H232.29L232.29,113.88z M220.28,170.87 c3.67,2.11,4.94,6.8,2.83,10.48c-2.11,3.67-6.8,4.94-10.48,2.83l-17.1-9.88c-3.67-2.11-4.94-6.8-2.83-10.48 c2.11-3.67,6.8-4.94,10.48-2.83L220.28,170.87L220.28,170.87z M181.43,214.19c2.13,3.67,0.87,8.38-2.8,10.51 c-3.67,2.13-8.38,0.88-10.51-2.8l-9.88-17.1c-2.13-3.67-0.87-8.38,2.8-10.51c3.67-2.13,8.38-0.88,10.51,2.8L181.43,214.19 L181.43,214.19z M126.12,232.29c0,4.26-3.45,7.71-7.71,7.71c-4.26,0-7.71-3.45-7.71-7.71v-19.75c0-4.26,3.45-7.71,7.71-7.71 c4.26,0,7.71,3.45,7.71,7.71V232.29L126.12,232.29z M69.13,220.28c-2.11,3.67-6.8,4.94-10.48,2.83c-3.67-2.11-4.94-6.8-2.83-10.48 l9.88-17.1c2.11-3.67,6.8-4.94,10.48-2.83c3.67,2.11,4.94,6.8,2.83,10.48L69.13,220.28L69.13,220.28z M25.81,181.43 c-3.67,2.13-8.38,0.87-10.51-2.8c-2.13-3.67-0.88-8.38,2.8-10.51l17.1-9.88c3.67-2.13,8.38-0.87,10.51,2.8 c2.13,3.67,0.88,8.38-2.8,10.51L25.81,181.43L25.81,181.43z M7.71,126.12c-4.26,0-7.71-3.45-7.71-7.71c0-4.26,3.45-7.71,7.71-7.71 h19.75c4.26,0,7.71,3.45,7.71,7.71c0,4.26-3.45,7.71-7.71,7.71H7.71L7.71,126.12z M19.72,69.13c-3.67-2.11-4.94-6.8-2.83-10.48 c2.11-3.67,6.8-4.94,10.48-2.83l17.1,9.88c3.67,2.11,4.94,6.8,2.83,10.48c-2.11,3.67-6.8,4.94-10.48,2.83L19.72,69.13L19.72,69.13z" />
                                    </g>
                                </svg>
                            </button>

                            <button
                                onClick={() => {
                                    setTheme("system")
                                }}
                                className='header__color-btn'>
                                <svg
                                    className={theme === "system" ? "header__color-svg header__color-svg--active" : "header__color-svg"}
                                    version="1.1"
                                    id="Layer_1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    x="0px"
                                    y="0px"
                                    viewBox="0 0 122.88 86.79"
                                    xmlSpace="preserve"
                                >
                                    <g>
                                        <path d="M2.08,0H120.8h2.08v2.08v69.2v2.08h-2.08H77.57v8.29h7.28v5.15H37.88v-5.15h7.28v-8.29H2.08H0v-2.08V2.08V0H2.08L2.08,0 L2.08,0L2.08,0z M118.73,4.15H4.15V69.2h114.57L118.73,4.15L118.73,4.15L118.73,4.15L118.73,4.15z" />
                                    </g>
                                </svg>
                            </button>

                            <button
                                onClick={() => {
                                    setTheme("dark")
                                }}
                                className='header__color-btn'>
                                <svg
                                    className={theme === "dark" ? "header__color-svg header__color-svg--active" : "header__color-svg"}
                                    version="1.1"
                                    id="Layer_1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    x="0px"
                                    y="0px"
                                    viewBox="0 0 122.88 122.89"
                                    xmlSpace="preserve"
                                >
                                    <g>
                                        <path d="M49.06,1.27c2.17-0.45,4.34-0.77,6.48-0.98c2.2-0.21,4.38-0.31,6.53-0.29c1.21,0.01,2.18,1,2.17,2.21 c-0.01,0.93-0.6,1.72-1.42,2.03c-9.15,3.6-16.47,10.31-20.96,18.62c-4.42,8.17-6.1,17.88-4.09,27.68l0.01,0.07 c2.29,11.06,8.83,20.15,17.58,25.91c8.74,5.76,19.67,8.18,30.73,5.92l0.07-0.01c7.96-1.65,14.89-5.49,20.3-10.78 c5.6-5.47,9.56-12.48,11.33-20.16c0.27-1.18,1.45-1.91,2.62-1.64c0.89,0.21,1.53,0.93,1.67,1.78c2.64,16.2-1.35,32.07-10.06,44.71 c-8.67,12.58-22.03,21.97-38.18,25.29c-16.62,3.42-33.05-0.22-46.18-8.86C14.52,104.1,4.69,90.45,1.27,73.83 C-2.07,57.6,1.32,41.55,9.53,28.58C17.78,15.57,30.88,5.64,46.91,1.75c0.31-0.08,0.67-0.16,1.06-0.25l0.01,0l0,0L49.06,1.27 L49.06,1.27z" />
                                    </g>
                                </svg>
                            </button>


                        </div>
                    </aside>
                    <button
                        onClick={() => {
                            isBurgMenuActive ? setIsBurgMenuActive(false) : setIsBurgMenuActive(true)
                        }}

                        className='header__burger-btn'>
                        <span className='header__burger-span'></span>
                    </button>
                </div>
            </div>
            <div
                style={isBurgMenuActive ? { display: "block" } : { display: "none" }}
                onClick={(e) => {
                    isBurgMenuActive && setIsBurgMenuActive(false)

                }}
                className="blur"></div>
        </header>
    );
}

export default Header;