
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import Image from 'next/image';
import "./Advert.css"
import Link from "next/link";
import ChatLink from "@/components/ChatLink/ChatLink";

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
    city: string
    category: string
    user: string
}


const Advert = async ({ params: { id } }: Props) => {
    const supabase = createServerComponentClient({ cookies })

    const {
        data: { session },
    } = await supabase.auth.getSession()



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

                            <div className="advert__img-box">
                                {dataUrl.data ?
                                    <Image
                                        alt="фото"
                                        className="advert__img"
                                        src={dataUrl.data?.signedUrl || ''}
                                        style={{ objectFit: "cover" }}
                                        fill

                                    />
                                    :
                                    <Image
                                        alt="нема фото"
                                        className="advert__img"
                                        src='/images/noImage.png'
                                        style={{ objectFit: "cover" }}
                                        fill
                                    />
                                }
                            </div>

                            <div className="advert__info">
                                <h3 className="advert__info-title advert__grid-cells">{advertInfo?.title}</h3>
                                <p className="advert__info-subtitle advert__grid-cells">Опис: {advertInfo?.subtitle}</p>
                                <p className="advert__info-city advert__grid-cells">City</p>
                                <p className="advert__info-tel advert__grid-cells">{advertInfo?.tel}</p>
                                <strong className="advert__info-price advert__grid-cells">{advertInfo?.price}₴</strong>
                                {advertInfo?.user !== session?.user.id &&
                                    <ChatLink
                                        sessionUserId={session?.user.id || ''}
                                        advertUserId={advertInfo?.user || ''}
                                        advertId={advertInfo?.id || -1}
                                    />
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