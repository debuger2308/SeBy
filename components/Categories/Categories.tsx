"use client"
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import "./Categories.css"
import { createClientComponentClient, type Session } from '@supabase/auth-helpers-nextjs'

type Categories = {
    id: number,
    category: string
}

const Categories = ({ setActiveBtn }: { setActiveBtn: Dispatch<SetStateAction<string>> }) => {

    const supabase = createClientComponentClient()

    const [categories, setCategories] = useState<Categories[]>([])

    const [activeBtnValue, setActiveBtnValue] = useState('Всі категорії')

    const [isActiveCategoriesList, setIsActiveCategoriesList] = useState(false)

    useEffect(() => {
        setActiveBtn(activeBtnValue)
    }, [activeBtnValue])

    useEffect(() => {
        async function getCategories() {
            let { data: categories, error } = await supabase
                .from('categories')
                .select('*')
            if (categories) setCategories(categories)
        }

        getCategories()
    }, [])


    return (
        <>
            <div className="categories">
                <button
                    onClick={() => {
                        isActiveCategoriesList ? setIsActiveCategoriesList(false) : setIsActiveCategoriesList(true)
                    }}
                    className={isActiveCategoriesList ? "category-btn category-btn--active" : "category-btn"}>
                    {activeBtnValue}
                </button>
                <ul

                    style={isActiveCategoriesList ? { display: "block" } : { display: "none" }}
                    className="categories-list">

                    {activeBtnValue !== 'Всі категорії' &&
                        <li className="categories-list__item">
                            <button
                                onClick={(e) => {
                                    setIsActiveCategoriesList(false)
                                    setActiveBtnValue(e.currentTarget.innerHTML)
                                }}
                                className="categories-list__btn">
                                Всі категорії
                            </button>
                        </li>
                    }
                    {categories.map((item) => {
                        return (
                            <li key={item.id} className="categories-list__item">
                                <button
                                    onClick={(e) => {
                                        setIsActiveCategoriesList(false)
                                        setActiveBtnValue(e.currentTarget.innerHTML)
                                    }}
                                    className="categories-list__btn">
                                    {item.category}
                                </button>
                            </li>
                        )
                    })}

                </ul>

            </div>
        </>
    );
}

export default Categories;