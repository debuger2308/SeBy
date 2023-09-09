"use client"
import Link from "next/link";
import "./signup.css"
import { SubmitHandler, useForm } from "react-hook-form";
import { useRef, useState } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from "next/navigation";


type FormValues = {
    email: string,
    password: string,
    cpassword: string
}

const SighUp = () => {
    const [isLoadData, setIsLoadData] = useState(false)
    const [accessMsg, setAccessMsg] = useState(false)
    const [isUserExist, setIsUserExist] = useState(false)
    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isValid
        },
        watch,
    } = useForm<FormValues>({ mode: "onBlur" })

    const supabase = createClientComponentClient()

    const onSubmit: SubmitHandler<FormValues> = async (formData) => {
        setIsLoadData(true)

        const { data, error } = await supabase.auth.signUp({
            email: formData.email,
            password: formData.password,
            options: {
                emailRedirectTo: `${location.origin}/auth/callback`,
            },
        })
        if (data.user && data.user.identities && data.user.identities.length === 0) {
            setIsUserExist(true)
        }
        else if (error) {
            alert(error);
        }
        else {
            setAccessMsg(true)
        }
        setIsLoadData(false)
    }

    const password = useRef({})
    password.current = watch("password", "")

    function inputChangeHadler() {
        setAccessMsg(false)
        setIsUserExist(false)
    }

    return (
        <main>
            <div className="container">
                <div className="main__signup">
                    <h1 className="signup__title">Реестрация</h1>
                    <form
                        onSubmit={handleSubmit(onSubmit)}
                        className="signup__form">

                        <input
                            autoComplete="off"
                            type="text"
                            className="auth-input signup__input"
                            placeholder="Пошта"
                            {...register('email', {
                                required: "Обовязкове поле",
                                pattern: {
                                    value: /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/,
                                    message: "Неправельний формат пошти"
                                },
                                onChange: () => {
                                    inputChangeHadler()
                                }
                            })}
                        />
                        <strong className="signup__error-msg">{errors?.email?.message?.toString()}</strong>
                        <input
                            type="password"
                            className="auth-input signup__input"
                            placeholder="Пароль"
                            {...register('password', {
                                required: "Обов`язкове поле",
                                pattern: {
                                    value: /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,16}/,
                                    message: "Пароль мае бути вид 6 то 16 сымволив, мати велику литеру, та з латинских буков"
                                },
                                onChange: () => {
                                    inputChangeHadler()
                                }
                            })}
                        />
                        <strong className="signup__error-msg">{errors?.password?.message?.toString()}</strong>
                        <input
                            type="password"
                            className="auth-input signup__input"
                            placeholder="Повторить пароль"
                            {...register('cpassword', {
                                required: "Обов`язкове поле",
                                validate: value => value === password.current || "Пароли не спивпадають",
                                onChange: () => {
                                    inputChangeHadler()
                                }
                            })}
                        />
                        <strong className="signup__error-msg">{errors?.cpassword?.message?.toString()}</strong>

                        <button disabled={!isValid || isLoadData === true} className="signup__sibmit-btn">
                            <span className={isLoadData ? "loader loader--active signup__loader" : "loader signup__loader"}></span>
                            Реестрация
                        </button>

                        <div className={accessMsg ? "signup__access signup__access--active" : "signup__access"}>
                            <svg
                                version="1.1"
                                className="signup__access-svg"
                                id="Layer_1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                x="0px"
                                y="0px"
                                width="122.881px"
                                height="122.88px"
                                viewBox="0 0 122.881 122.88"
                                enableBackground="new 0 0 122.881 122.88"
                                xmlSpace="preserve"
                            >
                                <g>
                                    <path
                                        fillRule="evenodd"
                                        clipRule="evenodd"
                                        d="M61.44,0c33.933,0,61.441,27.507,61.441,61.439 c0,33.933-27.508,61.44-61.441,61.44C27.508,122.88,0,95.372,0,61.439C0,27.507,27.508,0,61.44,0L61.44,0z M34.106,67.678 l-0.015-0.014c-0.785-0.718-1.207-1.685-1.256-2.669c-0.049-0.982,0.275-1.985,0.984-2.777c0.01-0.011,0.019-0.021,0.029-0.031 c0.717-0.784,1.684-1.207,2.668-1.256c0.989-0.049,1.998,0.28,2.792,0.998l12.956,11.748l31.089-32.559v0 c0.74-0.776,1.723-1.18,2.719-1.204c0.992-0.025,1.994,0.329,2.771,1.067v0.001c0.777,0.739,1.18,1.724,1.205,2.718 c0.025,0.993-0.33,1.997-1.068,2.773L55.279,81.769c-0.023,0.024-0.048,0.047-0.073,0.067c-0.715,0.715-1.649,1.095-2.598,1.13 c-0.974,0.037-1.963-0.293-2.744-1L34.118,67.688L34.106,67.678L34.106,67.678L34.106,67.678z"
                                    />
                                </g>
                            </svg>
                            <p className="signup__access-msg">Для завершення реестрации пидтвердить почту</p>
                        </div>

                        <div className={isUserExist  ? "signup__user-exist signup__user-exist--active" : "signup__user-exist"}>
                            <svg
                                className="signup__user-exist-icon"
                                version="1.1"
                                id="Layer_1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                x="0px"
                                y="0px"
                                width="122.88px"
                                height="122.879px"
                                viewBox="0 0 122.88 122.879"
                                enableBackground="new 0 0 122.88 122.879"
                                xmlSpace="preserve"
                            >
                                <g>
                                    <path

                                        d="M61.44,0c16.96,0,32.328,6.882,43.453,17.986c11.104,11.125,17.986,26.494,17.986,43.453 c0,16.961-6.883,32.328-17.986,43.453C93.769,115.998,78.4,122.879,61.44,122.879c-16.96,0-32.329-6.881-43.454-17.986 C6.882,93.768,0,78.4,0,61.439C0,44.48,6.882,29.111,17.986,17.986C29.112,6.882,44.48,0,61.44,0L61.44,0z M73.452,39.152 c2.75-2.792,7.221-2.805,9.986-0.026c2.764,2.776,2.775,7.292,0.027,10.083L71.4,61.445l12.077,12.25 c2.728,2.77,2.689,7.256-0.081,10.021c-2.772,2.766-7.229,2.758-9.954-0.012L61.445,71.541L49.428,83.729 c-2.75,2.793-7.22,2.805-9.985,0.025c-2.763-2.775-2.776-7.291-0.026-10.082L51.48,61.435l-12.078-12.25 c-2.726-2.769-2.689-7.256,0.082-10.022c2.772-2.765,7.229-2.758,9.954,0.013L61.435,51.34L73.452,39.152L73.452,39.152z M96.899,25.98C87.826,16.907,75.29,11.296,61.44,11.296c-13.851,0-26.387,5.611-35.46,14.685 c-9.073,9.073-14.684,21.609-14.684,35.459s5.611,26.387,14.684,35.459c9.073,9.074,21.609,14.686,35.46,14.686 c13.85,0,26.386-5.611,35.459-14.686c9.073-9.072,14.684-21.609,14.684-35.459S105.973,35.054,96.899,25.98L96.899,25.98z"
                                    />
                                </g>
                            </svg>
                            <p className="signup__access-msg">Користувач вже зареестрован</p>
                        </div>
                    </form>
                    <Link className="signup__link-login" href="/auth/login">
                        Е аккавунт?
                        <svg
                            className="signup__link-arrow"
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
                </div>
            </div>
        </main>
    );
}

export default SighUp;