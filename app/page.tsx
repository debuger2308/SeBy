"use client"

import Categories from "@/components/Categories/Categories";
import RangeInput from "@/components/RangeInput/RangeInput";
import { use, useEffect, useState } from "react";
import "./Home.css"
import SearchInput from "@/components/SearchInput/SearchInput";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import AdvertCard from "@/components/AdvertCard/AdvertCard";
import PaginationControl from "@/components/PaginationControl/PaginationControl";

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



export default function Home() {
    const supabase = createClientComponentClient()

    const [adverts, setAdverts] = useState<Adverts[]>([])
    const [activeCategory, setActiveCategory] = useState('')

    const [minPrice, setMinPrice] = useState(0)
    const [maxPrice, setMaxPrice] = useState(1)

    const [actualMinPrice, setActualMinPrice] = useState(0)
    const [actualMaxPrice, setActualMaxPrice] = useState(1)

    const [searchTerm, setSearchTerm] = useState('')

    const [filteredAdverts, setFilteredAdverts] = useState<Adverts[]>([])
    const [resultAdvertList, setResultAdvertList] = useState<Adverts[]>([])

    const [paginPoint, setPaginPoinit] = useState(1)

    const [isUploadingData, setIsUploadingData] = useState(true)

    const quntDisplayCards = 12


    function filterByCategory(adverts: Adverts[]) {
        if (activeCategory === '' || activeCategory === 'Всі категорії') return adverts
        else return adverts.filter(adv => adv.category === activeCategory)
    }

    function filterByRangeCost(adverts: Adverts[]) {
        return adverts.filter(adv => +adv.price >= actualMinPrice && +adv.price <= actualMaxPrice)
    }

    function filterBySearchTerm(advert: Adverts[]) {
        if (searchTerm === '') return advert
        return advert.filter(({ title }) => title.toLowerCase().includes(searchTerm.toLowerCase()))
    }


    useEffect(() => {
        setIsUploadingData(true)
        const getAdverts = async () => {
            let { data: adverts, error }: { data: Adverts[] | null, error: any } = await supabase
                .from('adverts')
                .select('*')
            if (adverts) {
                setFilteredAdverts(adverts)
                setAdverts(adverts.reverse() || []) 
            }
            setIsUploadingData(false)
        }
        getAdverts()
        
    }, [])


    useEffect(() => {
        if (filteredAdverts.length === 1) {
            setMinPrice(+filteredAdverts.reduce((acc, curr) => +acc.price < +curr.price ? acc : curr).price)
            setMaxPrice(+filteredAdverts.reduce((acc, curr) => +acc.price > +curr.price ? acc : curr).price + 1)
        }
        else if (filteredAdverts.length !== 0) {
            setMinPrice(+filteredAdverts.reduce((acc, curr) => +acc.price < +curr.price ? acc : curr).price)
            setMaxPrice(+filteredAdverts.reduce((acc, curr) => +acc.price > +curr.price ? acc : curr).price)
        }
        setResultAdvertList(filteredAdverts)
    }, [filteredAdverts])

    useEffect(() => {
        setFilteredAdverts(filterByCategory(filterBySearchTerm(adverts)));

    }, [activeCategory, searchTerm])

    useEffect(() => {
        const Debounce = setTimeout(() => {
            setResultAdvertList(filterByRangeCost(filteredAdverts))
        }, 300)

        return () => clearInterval(Debounce)
    }, [actualMinPrice, actualMaxPrice])


    return (
        <main>
            <div className="container">
                <div className="main__mainpage">
                    <div className="mainpage__header">
                        <Categories setActiveBtn={setActiveCategory} />
                        <RangeInput
                            max={maxPrice}
                            min={minPrice}
                            setActualMaxPrice={setActualMaxPrice}
                            setActualMinPrice={setActualMinPrice}
                        />

                        <SearchInput setSearchTerm={setSearchTerm} />
                    </div>

                    {resultAdvertList.length === 0 && !isUploadingData
                        ? <h1 className="zero-cards-title">Оголошень не знайдено</h1>


                        : <div className="mainpage__catalog">
                            {resultAdvertList.length !== 0 &&
                                resultAdvertList.slice((paginPoint - 1) * quntDisplayCards, paginPoint * quntDisplayCards).map((item) => {
                                    return <AdvertCard advert={item} key={item.id} />
                                })
                            }

                        </div>
                    }

                    <PaginationControl
                        pointQuantity={Math.ceil(resultAdvertList.length / quntDisplayCards)}
                        paginPoint={paginPoint}
                        setPaginPoinit={setPaginPoinit}
                    />

                </div>
            </div>
        </main>
    )
}
