"use client"
import Link from "next/link";
import "./login.css"
import { SubmitHandler, useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

type FormValues = {
    email: string
    password: string
}

const Login = () => {
    const supabase = createClientComponentClient()
    const [isLoadData, setIsLoadData] = useState(false)
    const router = useRouter()
    const [logInMessage, setLogInMessage] = useState('')

    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isValid
        }
    } = useForm<FormValues>({ mode: "onBlur" })

    const onSubmit: SubmitHandler<FormValues> = async (formData) => {
        setIsLoadData(true)
        const { data, error } = await supabase.auth.signInWithPassword({
            email: formData.email,
            password: formData.password,
        })
        if (error) {
            if (error.message = 'Invalid login credentials') setLogInMessage('Користувача не знайдено')

        }
        else {
            router.refresh()
        }
        setIsLoadData(false)
    }

    return (
        <main>
            <div className="container">
                <div className="main__login">
                    <h1 className="login__title">Вхід</h1>
                    <form onSubmit={handleSubmit(onSubmit)} className="login__form">
                        <input
                            autoComplete="off"
                            type="text"
                            placeholder="Пошта"
                            className="auth-input login__input"
                            required
                            {...register('email', {
                                required: "Обов`язкове поле",
                            })}
                        />
                        <strong className="login__error-msg">{errors?.email?.message?.toString()}</strong>
                        <input
                            autoComplete="off"
                            type="password"
                            placeholder="Пароль"
                            className="auth-input login__input"
                            {...register('password', {
                                required: "Обов`язкове поле",
                            })}
                        />
                        <strong className="login__error-msg">{errors?.password?.message?.toString()}</strong>
                        <button type="submit" disabled={!isValid} className="login__sibmit-btn">
                            <span className={isLoadData ? "loader loader--active login__loader" : "loader login__loader"}></span>
                            Увійти
                        </button>
                        <strong className="login__error-msg">{logInMessage}</strong>
                    </form>

                    <Link className="login__link-signup" href="/auth/signup">
                        Немає аккаунта?
                        <svg
                            className="login__link-arrow"
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

export default Login;