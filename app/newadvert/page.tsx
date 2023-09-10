"use client"
import { SubmitHandler, useForm } from 'react-hook-form';
import './newadvert.css'
import { useEffect, useRef, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

type FormValues = {
    dataPath: string
    title: string
    subtitle: string,
    price: string,
    tel: string
}


const NewAdvert = () => {
    const router = useRouter()

    const supabase = createClientComponentClient()
    const {
        register,
        handleSubmit,
        formState: {
            errors,
            isValid
        },
        watch
    } = useForm<FormValues>({ mode: "onBlur" })

    const [file, setFile] = useState<FileList | null>()

    const [imgUrl, setImgUrl] = useState('')

    const [dataPath, setDataPath] = useState('')

    const inputRef = useRef<HTMLInputElement>(null)

    async function uploadFile(file: FileList) {
        if (file !== null) {
            const { data, error } = await supabase
                .storage
                .from('images')
                .upload('public/' + uuidv4() + '.jpg', file?.[0])
            if (error) {
                console.log(error);
            } else {
                setDataPath(data.path)
                createImageURL(data.path)
            }
        }
    }

    async function createImageURL(path: string) {
        const { data, error } = await supabase
            .storage
            .from('images')
            .createSignedUrl(path, 600)
        setImgUrl(data?.signedUrl || '')
    }


    useEffect(() => {
        if (file !== null && file !== undefined) uploadFile(file)
    }, [file])

    const onSubmit: SubmitHandler<FormValues> = async (formData) => {
        const { data, error } = await supabase
            .from('adverts')
            .insert([
                {
                    title: formData.title,
                    price: formData.price,
                    tel: formData.tel,
                    subtitle: formData.subtitle,
                    imgPath: dataPath
                }
            ])
        if (error) alert(error)
        
    }


    return (
        <main>
            <div className="container">
                <div className="main__newadvert">
                    <h1 className='newadvert__title'>Створити оголошення</h1>

                    {imgUrl.length === 0 ?
                        <div
                            onDragOver={(e) => {
                                e.preventDefault()
                            }}
                            onDrop={(e) => {
                                e.preventDefault()
                                setFile(e.dataTransfer.files)
                            }}
                            className="newadvert__dropzone">

                            <h3 className='newadvert__dropzone-title'>Перетягніть зображення</h3>
                            <h3 className='newadvert__dropzone-title'>або</h3>
                            <input
                                id="image_uploads"
                                className='newadvert__file-input'
                                onChange={async (e) => {
                                    setFile(e.currentTarget.files)
                                }}
                                type="file"
                                accept="image/*"
                                ref={inputRef}
                                hidden
                            />
                            <button
                                onClick={() => inputRef.current?.click()}
                                className='newadvert__dropzone-btn'>Натисніть кнопку</button>


                        </div>
                        :
                        <div className="newadvert__img-box">
                            <Image
                                className='newadvert__img'
                                src={imgUrl}
                                width={250}
                                height={250}
                                alt='зображення для оголошення' />
                            <button className='newadver__img-delete'>
                                <svg
                                    className='newadver__img-delete-icon'
                                    id="Layer_1"
                                    data-name="Layer 1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 105.16 122.88"
                                >
                                    <defs>
                                        <style dangerouslySetInnerHTML={{ __html: ".cls-1{fill-rule:evenodd;}" }} />
                                    </defs>
                                    <title>delete</title>
                                    <path
                                        className="cls-1"
                                        d="M11.17,37.16H94.65a8.4,8.4,0,0,1,2,.16,5.93,5.93,0,0,1,2.88,1.56,5.43,5.43,0,0,1,1.64,3.34,7.65,7.65,0,0,1-.06,1.44L94,117.31v0l0,.13,0,.28v0a7.06,7.06,0,0,1-.2.9v0l0,.06v0a5.89,5.89,0,0,1-5.47,4.07H17.32a6.17,6.17,0,0,1-1.25-.19,6.17,6.17,0,0,1-1.16-.48h0a6.18,6.18,0,0,1-3.08-4.88l-7-73.49a7.69,7.69,0,0,1-.06-1.66,5.37,5.37,0,0,1,1.63-3.29,6,6,0,0,1,3-1.58,8.94,8.94,0,0,1,1.79-.13ZM5.65,8.8H37.12V6h0a2.44,2.44,0,0,1,0-.27,6,6,0,0,1,1.76-4h0A6,6,0,0,1,43.09,0H62.46l.3,0a6,6,0,0,1,5.7,6V6h0V8.8h32l.39,0a4.7,4.7,0,0,1,4.31,4.43c0,.18,0,.32,0,.5v9.86a2.59,2.59,0,0,1-2.59,2.59H2.59A2.59,2.59,0,0,1,0,23.62V13.53H0a1.56,1.56,0,0,1,0-.31v0A4.72,4.72,0,0,1,3.88,8.88,10.4,10.4,0,0,1,5.65,8.8Zm42.1,52.7a4.77,4.77,0,0,1,9.49,0v37a4.77,4.77,0,0,1-9.49,0v-37Zm23.73-.2a4.58,4.58,0,0,1,5-4.06,4.47,4.47,0,0,1,4.51,4.46l-2,37a4.57,4.57,0,0,1-5,4.06,4.47,4.47,0,0,1-4.51-4.46l2-37ZM25,61.7a4.46,4.46,0,0,1,4.5-4.46,4.58,4.58,0,0,1,5,4.06l2,37a4.47,4.47,0,0,1-4.51,4.46,4.57,4.57,0,0,1-5-4.06l-2-37Z"
                                    />
                                </svg>
                            </button>
                        </div>

                    }
                    <form
                        className='newadvert__form'
                        onSubmit={handleSubmit(onSubmit)}
                        action="">

                        <input
                            className='newadvert__form-input'
                            placeholder='Назва'
                            {...register('title', {
                                required: "Обов`язкове поле",
                            })}
                            type="text"
                        />
                        <input
                            className='newadvert__form-input'
                            placeholder='Опис'
                            {...register('subtitle')}
                            type="text"
                        />
                        <input
                            className='newadvert__form-input'
                            placeholder='Цiна'
                            {...register('price', {
                                required: "Обов`язкове поле"
                            })}
                            type="number"
                        />
                        <input
                            className='newadvert__form-input'
                            placeholder='Телефон'
                            {...register('tel', {
                                required: "Обов`язкове поле"
                            })}
                            type="tel"
                        />
                        <button className='newadvert__form-submit'>Створити</button>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default NewAdvert;