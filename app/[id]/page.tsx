
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from 'next/image';
import "./Advert.css"
import Link from "next/link";

type Props = {
    params: {
        id: string
    }
}
type Adverts = {
    id: number
    title: string
    price: string
    tel: string
    subtitle: string
    imgPath: string
    user_type: string
}


const Advert = async ({ params: { id } }: Props) => {
    const supabase = createServerComponentClient({ cookies })

    const { data, error }: { data: Adverts[] | null, error: any } = await supabase
        .from('adverts')
        .select()
        .eq('id', id)
    const advertInfo = data?.[0]


    const dataUrl = await supabase
        .storage
        .from("images")
        .createSignedUrl(data?.[0]?.imgPath || '', 120)


    return (
        <main className="advert">
            <div className="container">
                <div className="main__advert">
                    {data?.length === 0 || error ?
                        <div className="advert__error-container">
                            <h1 className="advert__error-title">404 Сторiнка не знайдена</h1>
                            <Link href="/" className="advert__error-link">
                                На головну
                                <svg
                                    className="advert__error-link-arrow"
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
                        :
                        <div className="advert__info-container">
                            {dataUrl.data ?
                                <Image alt="фото" className="advert__img" src={dataUrl.data?.signedUrl || ''} height={300} width={300} />
                                :
                                <Image alt="нема фото" className="advert__img" src='/images/noImage.png' height={300} width={300} />
                            }
                            <div className="advert__info">
                                <h1 className="advert__info-title">{advertInfo?.title}</h1>
                                <p className="advert__info-desc">Опис: {advertInfo?.subtitle}</p>
                                <strong className="advert__info-price">Цiна: {advertInfo?.price}₴</strong>
                                <p className="advert__info-phone">

                                    {advertInfo?.tel}
                                </p>
                                {advertInfo?.user_type &&
                                    <Link href={'/chat'} className="advert__chat-link">
                                        написати
                                    </Link>
                                }
                            </div>
                        </div>
                    }

                </div>
            </div>

        </main>
    );
}

export default Advert;