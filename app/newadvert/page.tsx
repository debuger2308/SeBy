"use client"
import { SubmitHandler, useForm } from 'react-hook-form';
import './newadvert.css'
import { useEffect, useRef, useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { useRouter } from 'next/navigation';

type FormValues = {
    category: string
    title: string
    subtitle: string
    price: string
    tel: string
    city: string
}

type Categories = {
    id: number
    category: string
}
const NewAdvert = () => {
    const router = useRouter()

    const supabase = createClientComponentClient()

    const {
        register,
        handleSubmit,
        formState: {
            isValid,
            errors
        },
        setValue
    } = useForm<FormValues>({ mode: "onBlur" })


    const [file, setFile] = useState<FileList | null>()

    const [imgUrl, setImgUrl] = useState('')

    const [dataPath, setDataPath] = useState('')

    const [isLoadData, setIsLoadData] = useState(false)

    const [categories, setCategories] = useState<Categories[]>()

    const [category, setCategory] = useState('Категорiя')

    const [isCategoriesActive, setIsCategoriesActive] = useState(false)



    const inputRef = useRef<HTMLInputElement>(null)

    async function uploadFile(file: FileList) {
        if (file !== null) {
            const { data, error } = await supabase
                .storage
                .from('images')
                .upload('public/' + uuidv4() + '.jpg', file?.[0])
            if (error) {
                console.log(error)
            } else {
                setDataPath(data.path)
                createImageURL(data.path)
            }
        }
    }

    async function getCategories() {
        const { data, error }: { data: Categories[] | null, error: any } = await supabase
            .from('categories')
            .select()
        if (!error) setCategories(data || [])
        else {
            setCategories([])
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




    useEffect(() => {
        getCategories()
        setValue("category", category, { shouldValidate: false })
    }, [])



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
                    user: session?.user.id,
                    category: formData.category,
                    city: formData.city
                }
            ])
            .select()
        if (error) {
            setIsLoadData(false)
            alert(error.code)
        }
        else router.push(`/${data[0].id}`)
    }

    return (
        <main>
            <div className="container">
                <div className="main__newadvert">
                    <div
                        style={isCategoriesActive ? { display: "block" } : { display: "none" }}
                        onClick={() => {
                            setIsCategoriesActive(false)
                        }}
                        className="category__dropmenu-closer"></div>


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

                        <div className={errors.category ? 'newadvert__form-select newadvert__input-wrapper--error' : "newadvert__form-select"}>
                            <svg
                                onClick={() => {
                                    setIsCategoriesActive(!isCategoriesActive)
                                }}
                                className={isCategoriesActive ? "newadvert__select-icon newadvert__select-icon--active" : "newadvert__select-icon"}
                                version="1.1"
                                id="Layer_1"
                                xmlns="http://www.w3.org/2000/svg"
                                xmlnsXlink="http://www.w3.org/1999/xlink"
                                x="0px"
                                y="0px"
                                width="122.883px"
                                height="122.882px"
                                viewBox="0 0 122.883 122.882"
                                enableBackground="new 0 0 122.883 122.882"
                                xmlSpace="preserve"
                            >
                                <g>
                                    <path d="M122.883,61.441c0,16.966-6.877,32.326-17.996,43.445c-11.119,11.118-26.479,17.995-43.446,17.995 c-16.966,0-32.326-6.877-43.445-17.995C6.877,93.768,0,78.407,0,61.441c0-16.967,6.877-32.327,17.996-43.445 C29.115,6.877,44.475,0,61.441,0c16.967,0,32.327,6.877,43.446,17.996C116.006,29.115,122.883,44.475,122.883,61.441 L122.883,61.441z M80.717,71.377c1.783,1.735,4.637,1.695,6.373-0.088c1.734-1.784,1.695-4.637-0.09-6.372L64.48,43.078 l-3.142,3.23l3.146-3.244c-1.791-1.737-4.653-1.693-6.39,0.098c-0.05,0.052-0.099,0.104-0.146,0.158L35.866,64.917 c-1.784,1.735-1.823,4.588-0.088,6.372c1.735,1.783,4.588,1.823,6.372,0.088l19.202-18.779L80.717,71.377L80.717,71.377z M98.496,98.496c9.484-9.482,15.35-22.584,15.35-37.055c0-14.472-5.865-27.573-15.35-37.056 C89.014,14.903,75.912,9.038,61.441,9.038c-14.471,0-27.572,5.865-37.055,15.348C14.903,33.869,9.038,46.97,9.038,61.441 c0,14.471,5.865,27.572,15.349,37.055c9.482,9.483,22.584,15.349,37.055,15.349C75.912,113.845,89.014,107.979,98.496,98.496 L98.496,98.496z" />
                                </g>
                            </svg>

                            <input
                                style={category !== 'Категорiя' ? { color: "#0083ff" } : { color: "var(--shadowcolor)" }}
                                className='newadvert__select-input'
                                type="button"
                                {...register('category', {
                                    validate: value => value !== 'Категорiя' || "Оберiть категорiю"
                                })}
                                onClick={() => {
                                    setIsCategoriesActive(!isCategoriesActive)
                                }}
                            />



                            <div
                                className="newadvert__select-options"
                                style={isCategoriesActive ? { display: "block" } : { display: "none" }}
                            >
                                {categories?.map((item) => {
                                    return <div
                                        onClick={() => {
                                            setValue("category", item.category, { shouldValidate: true })
                                            setCategory(item.category)
                                            setIsCategoriesActive(false)
                                        }}
                                        key={item.id}
                                        className="newadvert__select-option"
                                    >
                                        {item.category}
                                    </div>
                                })}
                            </div>
                        </div>


                        <div className={errors.title
                            ? "newadvert__input-wrapper newadvert__input-wrapper--error"
                            : "newadvert__input-wrapper"}>

                            <input
                                className='newadvert__form-input'
                                placeholder='Назва'
                                {...register('title', {
                                    maxLength: { value: 50, message: "максимум 50 симолiв" },
                                    required: true
                                })}
                                type="text"
                            />
                            <strong className="newadvert__error-message">
                                {errors.title?.message}
                            </strong>
                        </div>


                        <div className="newadvert__input-wrapper ">
                            <input
                                className='newadvert__form-input'
                                placeholder='Опис'
                                {...register('subtitle', {
                                    maxLength: { value: 350, message: "максимум 350 симолiв" },
                                    required: true
                                })}
                                type="text"
                            />
                            <strong className="newadvert__error-message">
                                {errors.subtitle?.message}
                            </strong>
                        </div>

                        <div className={errors.title
                            ? "newadvert__input-wrapper newadvert__input-wrapper--error"
                            : "newadvert__input-wrapper"}>

                            <input
                                className='newadvert__form-input'
                                placeholder='Цiна'
                                {...register('price', {
                                    maxLength: { value: 20, message: "максимум 20 симолiв" },
                                    required: true
                                })}
                                type="number"
                            />
                            <strong className="newadvert__error-message">
                                {errors.price?.message}
                            </strong>
                        </div>

                        <div className={errors.tel
                            ? "newadvert__input-wrapper newadvert__input-wrapper--error"
                            : "newadvert__input-wrapper"}>
                            <input
                                className='newadvert__form-input'
                                placeholder='Телефон'
                                {...register('tel', {
                                    maxLength: { value: 10, message: "Поле повинно мати 10 символiв" },
                                    minLength: { value: 10, message: "Поле повинно мати 10 символiв" },
                                    required: true
                                })}
                                type="tel"
                            />
                            <strong className="newadvert__error-message">
                                {errors.tel?.message}
                            </strong>
                        </div>
                        <div className={errors.city
                            ? "newadvert__input-wrapper newadvert__input-wrapper--error"
                            : "newadvert__input-wrapper"}>
                            <input
                                className='newadvert__form-input'
                                placeholder='Мiсто'
                                {...register('city', {
                                    maxLength: { value: 50, message: "максимум 50 симолiв" },
                                    required: true
                                })}
                                type="text"
                            />
                            <strong className="newadvert__error-message">
                                {errors.city?.message}
                            </strong>
                        </div>


                        <button

                            className={!isValid || isLoadData === true ? 'newadvert__form-submit newadvert__form-submit--disabled' : "newadvert__form-submit"}
                        >
                            <span className={isLoadData ? "loader loader--active newadvert__loader" : "loader newadvert__loader"}></span>
                            Створити
                        </button>
                    </form>
                </div>
            </div >
        </main >
    );
}

export default NewAdvert;