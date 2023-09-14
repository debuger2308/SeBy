"use client"
import { SubmitHandler, useForm } from 'react-hook-form';
import './newadvert.css'
import { useEffect, useRef, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

type FormValues = {
    title: string
    subtitle: string
    price: string
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
        reset
    } = useForm<FormValues>({ mode: "onBlur" })

    const [file, setFile] = useState<FileList | null>()

    const [imgUrl, setImgUrl] = useState('')

    const [dataPath, setDataPath] = useState('')

    const [isLoadData, setIsLoadData] = useState(false)

    const [userType, setUserType] = useState('')



    const inputRef = useRef<HTMLInputElement>(null)

    async function uploadFile(file: FileList) {
        if (file !== null) {
            const { data, error } = await supabase
                .storage
                .from('images')
                .upload('public/' + uuidv4() + '.jpg', file?.[0])
            if (error) {
                alert(error)
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
        if (error) alert(error);
        else setImgUrl(data?.signedUrl || '')
    }

    async function deleteImage() {
        const { data, error } = await supabase
            .storage
            .from('images')
            .remove([dataPath])
        if (error) alert(error)
        else {
            setImgUrl('')
        }
    }

    useEffect(() => {
        if (file !== null && file !== undefined) uploadFile(file)
    }, [file])



    const onSubmit: SubmitHandler<FormValues> = async (formData) => {
        setIsLoadData(true)

        const {
            data: { session },
        } = await supabase.auth.getSession()

        const { data, error } = await supabase
            .from('adverts')
            .insert([
                {
                    title: formData.title,
                    price: formData.price,
                    tel: formData.tel,
                    subtitle: formData.subtitle,
                    imgPath: dataPath,
                    user_type: session?.user.id
                }
            ])
            .select()
        if (error) {
            setIsLoadData(false)
            alert(error)
        }
        else router.push(`/${data[0].id}`)
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
                                className='newadvert__dropzone-btn'>Натисніть кнопку
                            </button>


                        </div>
                        :
                        <div className="newadvert__img-box">
                            <Image
                                className='newadvert__img'
                                src={imgUrl}
                                width={250}
                                height={250}
                                alt='зображення для оголошення' />
                            <button
                                onClick={deleteImage}
                                className='newadver__img-delete'>
                                <svg
                                    className='newadver__img-delete-icon'
                                    version="1.1"
                                    id="Layer_1"
                                    xmlns="http://www.w3.org/2000/svg"
                                    xmlnsXlink="http://www.w3.org/1999/xlink"
                                    x="0px"
                                    y="0px"
                                    width="109.484px"
                                    height="122.88px"
                                    viewBox="0 0 109.484 122.88"
                                    enableBackground="new 0 0 109.484 122.88"
                                    xmlSpace="preserve"
                                >
                                    <g>
                                        <path
                                            fillRule="evenodd"
                                            clipRule="evenodd"
                                            d="M2.347,9.633h38.297V3.76c0-2.068,1.689-3.76,3.76-3.76h21.144 c2.07,0,3.76,1.691,3.76,3.76v5.874h37.83c1.293,0,2.347,1.057,2.347,2.349v11.514H0V11.982C0,10.69,1.055,9.633,2.347,9.633 L2.347,9.633z M8.69,29.605h92.921c1.937,0,3.696,1.599,3.521,3.524l-7.864,86.229c-0.174,1.926-1.59,3.521-3.523,3.521h-77.3 c-1.934,0-3.352-1.592-3.524-3.521L5.166,33.129C4.994,31.197,6.751,29.605,8.69,29.605L8.69,29.605z M69.077,42.998h9.866v65.314 h-9.866V42.998L69.077,42.998z M30.072,42.998h9.867v65.314h-9.867V42.998L30.072,42.998z M49.572,42.998h9.869v65.314h-9.869 V42.998L49.572,42.998z"
                                        />
                                    </g>
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
                        <button
                            disabled={!isValid || isLoadData === true}
                            className='newadvert__form-submit'
                        >
                            <span className={isLoadData ? "loader loader--active newadvert__loader" : "loader newadvert__loader"}></span>
                            Створити
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}

export default NewAdvert;