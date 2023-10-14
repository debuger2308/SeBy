"use client"
import { useEffect, useState } from "react"
import "./AdvertCard.css"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Image from "next/image"
import Link from "next/link"

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

const AdvertCard = ({ advert }: { advert: Adverts }) => {
    const supabase = createClientComponentClient()

    const [dataUrl, setDataUrl] = useState('')


    useEffect(() => {
        const getDataUrl = async () => {
            const dataUrl = await supabase
                .storage
                .from("images")
                .createSignedUrl(advert?.imgPath || '', 120)
            setDataUrl(dataUrl.data?.signedUrl || 'null')
        }
        getDataUrl()
    }, [])

    return (
        <div className="catalog-card">


                <Link href={'/' + advert.id} className="catalog-card__link">
                    {dataUrl === "null" && dataUrl.length !== 0 
                        ? <Image
                            className="catalog-card__img"
                            width={250}
                            height={250}
                            src="/images/noImage.png"
                            alt="нема фото"
                            style={{ objectFit: "cover" }}
                        />
                        : <Image
                            className="catalog-card__img"
                            width={250}
                            height={250}
                            src={dataUrl || '/'}
                            alt="фото картки"
                            style={{ objectFit: "cover" }}
                        />
                    }
                </Link>



                <h2 className="catalog-card__title">{advert.title}</h2>
                <strong className="catalog-card__price">{advert.price}₴</strong>
                <p className="catalog-card__city">{advert.city}</p>
 

        </div>
    );
}

export default AdvertCard;