"use client"
import { Dispatch, SetStateAction } from "react";
import "./PaginationControl.css"

const PaginationControl = ({ pointQuantity, paginPoint, setPaginPoinit }:
    { pointQuantity: number, paginPoint: number, setPaginPoinit: Dispatch<SetStateAction<number>> }
) => {

    const pagesCount = []
    for (let i = 1; i <= pointQuantity; i++) pagesCount.push(i)

    return (
        <div className="pagination-control">
            <div className="mainpage__pagination-btns">
                <button
                    className="pagination__btn"
                    onClick={() => {
                        if (paginPoint > 1) setPaginPoinit(point => point - 1)
                    }}>
                    <svg
                        className={paginPoint === 1 ? "pagination__btn-icon--prev pagination__btn-icon--disabled" : "pagination__btn-icon--prev"}
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        viewBox="0 0 66.91 122.88"
                        xmlSpace="preserve"
                    >
                        <g>
                            <path d="M1.95,111.2c-2.65,2.72-2.59,7.08,0.14,9.73c2.72,2.65,7.08,2.59,9.73-0.14L64.94,66l-4.93-4.79l4.95,4.8 c2.65-2.74,2.59-7.11-0.15-9.76c-0.08-0.08-0.16-0.15-0.24-0.22L11.81,2.09c-2.65-2.73-7-2.79-9.73-0.14 C-0.64,4.6-0.7,8.95,1.95,11.68l48.46,49.55L1.95,111.2L1.95,111.2L1.95,111.2z" />
                        </g>
                    </svg>
                </button>

                <div className="pagination__pages">
                    {pointQuantity <= 5 ?
                        pagesCount.map((count) => {
                            return (
                                <button
                                    key={count}
                                    className={paginPoint === count ? "pagination_pages-count pagination_pages-count--acitve" : "pagination_pages-count"}
                                    onClick={() => {
                                        setPaginPoinit(count)
                                    }}
                                >
                                    {count}
                                </button>
                            )
                        })
                        :
                        <>
                            <button
                                className={paginPoint === 1 ? "pagination_pages-count pagination_pages-count--acitve" : "pagination_pages-count"}
                                onClick={() => {
                                    setPaginPoinit(1)
                                }}
                            >
                                1
                            </button>

                            {paginPoint <= 3 &&
                                <>
                                    <button
                                        className={paginPoint === 2 ? "pagination_pages-count pagination_pages-count--acitve" : "pagination_pages-count"}
                                        onClick={() => {
                                            setPaginPoinit(2)
                                        }}
                                    >
                                        2
                                    </button>
                                    <button
                                        className={paginPoint === 3 ? "pagination_pages-count pagination_pages-count--acitve" : "pagination_pages-count"}
                                        onClick={() => {
                                            setPaginPoinit(3)
                                        }}
                                    >
                                        3
                                    </button>
                                    <button
                                        className={paginPoint === 4 ? "pagination_pages-count pagination_pages-count--acitve" : "pagination_pages-count"}
                                        onClick={() => {
                                            setPaginPoinit(4)
                                        }}
                                    >
                                        4
                                    </button>
                                    ...
                                </>

                            }
                            {paginPoint > 3 && paginPoint < pointQuantity - 3 &&

                                <>
                                    ...
                                    <button
                                        className="pagination_pages-count"
                                        onClick={() => {
                                            setPaginPoinit(paginPoint - 1)
                                        }}
                                    >
                                        {paginPoint - 1}
                                    </button>
                                    <button
                                        className="pagination_pages-count pagination_pages-count--acitve"
                                    >
                                        {paginPoint}
                                    </button>
                                    <button
                                        className="pagination_pages-count"
                                        onClick={() => {
                                            setPaginPoinit(paginPoint + 1)
                                        }}
                                    >
                                        {paginPoint + 1}
                                    </button>
                                    ...
                                </>
                            }
                            {paginPoint >= pointQuantity - 3 &&
                                <>
                                    ...
                                    <button
                                        className={paginPoint === pointQuantity - 3 ? "pagination_pages-count pagination_pages-count--acitve" : "pagination_pages-count"}
                                        onClick={() => {
                                            setPaginPoinit(pointQuantity - 3)
                                        }}
                                    >
                                        {pointQuantity - 3}
                                    </button>
                                    <button
                                        className={paginPoint === pointQuantity - 2 ? "pagination_pages-count pagination_pages-count--acitve" : "pagination_pages-count"}
                                        onClick={() => {
                                            setPaginPoinit(pointQuantity - 2)
                                        }}
                                    >
                                        {pointQuantity - 2}
                                    </button>
                                    <button
                                        className={paginPoint === pointQuantity - 1 ? "pagination_pages-count pagination_pages-count--acitve" : "pagination_pages-count"}
                                        onClick={() => {
                                            setPaginPoinit(pointQuantity - 1)
                                        }}
                                    >
                                        {pointQuantity - 1}
                                    </button>

                                </>

                            }

                            <button
                                className={paginPoint === pointQuantity ? "pagination_pages-count pagination_pages-count--acitve" : "pagination_pages-count"}
                                onClick={() => {
                                    setPaginPoinit(pointQuantity)
                                }}
                            >
                                {pointQuantity}
                            </button>
                        </>
                    }
                </div>

                <button
                    className="pagination__btn"
                    onClick={() => {
                        if (paginPoint < pointQuantity) setPaginPoinit(point => point + 1)
                    }}>
                    <svg
                        className={paginPoint === pointQuantity ? "pagination__btn-icon--next pagination__btn-icon--disabled" : "pagination__btn-icon--next"}
                        version="1.1"
                        id="Layer_1"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        x="0px"
                        y="0px"
                        viewBox="0 0 66.91 122.88"
                        xmlSpace="preserve"
                    >
                        <g>
                            <path d="M1.95,111.2c-2.65,2.72-2.59,7.08,0.14,9.73c2.72,2.65,7.08,2.59,9.73-0.14L64.94,66l-4.93-4.79l4.95,4.8 c2.65-2.74,2.59-7.11-0.15-9.76c-0.08-0.08-0.16-0.15-0.24-0.22L11.81,2.09c-2.65-2.73-7-2.79-9.73-0.14 C-0.64,4.6-0.7,8.95,1.95,11.68l48.46,49.55L1.95,111.2L1.95,111.2L1.95,111.2z" />
                        </g>
                    </svg>
                </button>

            </div>
        </div>
    );
}

export default PaginationControl;