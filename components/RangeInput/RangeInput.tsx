"use client"

import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import "./RangeInput.css"


const RangeInput = ({ min, max, setActualMinPrice, setActualMaxPrice }: 
    { min: number, max: number, setActualMinPrice: Dispatch<SetStateAction<number>>, setActualMaxPrice:Dispatch<SetStateAction<number>> }) => {

    const [minVal, setMinVal] = useState(min)
    const [maxVal, setMaxVal] = useState(max)
    

    const [inputValueMin, setInputValueMin] = useState<number>(min)
    const [inputValueMax, setInputValueMax] = useState<number>(max)

    useEffect(()=>{
        setMinVal(min)
        setMaxVal(max)
        setInputValueMin(min)
        setInputValueMax(max)
    },[min,max])

    const minValueRef = useRef<HTMLInputElement>(null)
    const maxValueRef = useRef<HTMLInputElement>(null)
    const range = useRef<HTMLDivElement>(null)

    const getPercent = useCallback((value: number) => Math.round(((value - min) / (max - min)) * 100), [min, max])

    useEffect(() => {
        if (maxValueRef.current) {
            const minPercent = getPercent(minVal);
            const maxPercent = getPercent(+maxValueRef.current.value);

            if (range.current) {
                range.current.style.left = `${minPercent}%`;
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
        setInputValueMin(minVal)
        setActualMinPrice(minVal)
    }, [minVal, getPercent]);
    useEffect(() => {
        if (minValueRef.current) {
            const minPercent = getPercent(+minValueRef.current.value);
            const maxPercent = getPercent(maxVal);

            if (range.current) {
                range.current.style.width = `${maxPercent - minPercent}%`;
            }
        }
        setInputValueMax(maxVal)
        setActualMaxPrice(maxVal)
    }, [maxVal, getPercent]);
    // useEffect(() => {
    //     onChange({ min: minVal, max: maxVal });
    //   }, [minVal, maxVal, onChange]);    

    return (
        <div className="rangeinput">
            <h1 className="rangeinput__title">Цiна:</h1>
            <div className="rangeinput__inputs">
                <input
                    className="rangeinput__input"
                    type="text"
                    value={inputValueMin}
                    onChange={(event) => {
                        if (!Number.isNaN(+event.currentTarget.value)) setInputValueMin(+event.currentTarget.value)
                    }}
                    onBlur={() => {
                        if (inputValueMin < min) {
                            setMinVal(min)
                            setInputValueMin(min)
                        }
                        else if (maxValueRef.current && inputValueMin > +maxValueRef.current.value) {
                            setMinVal(+maxValueRef.current.value - 1)
                            setInputValueMin(+maxValueRef.current.value - 1)
                        }
                        else {
                            setMinVal(+inputValueMin)
                        }
                    }}
                    onKeyUp={(event) => {
                        if (event.key === "Enter") {
                            event.currentTarget.blur()
                        }
                    }}
                />
                <input
                    className="rangeinput__input"
                    type="text"
                    value={inputValueMax}
                    onChange={(event) => {
                        if (!Number.isNaN(+event.currentTarget.value)) setInputValueMax(+event.currentTarget.value)
                    }}
                    onBlur={(event) => {
                        if (inputValueMax > max) {
                            setMaxVal(max)
                            setInputValueMax(max)
                        }
                        else if (minValueRef.current && inputValueMax < +minValueRef.current.value) {
                            setMaxVal(+minValueRef.current.value + 1)
                            setInputValueMax(+minValueRef.current.value + 1)
                        }
                        else {
                            setMaxVal(inputValueMax)
                        }
                    }}
                    onKeyUp={(event) => {
                        if (event.key === "Enter") {
                            event.currentTarget.blur()
                        }
                    }}
                />
            </div>

            <div className="rangeinput__slider">

                <input
                    type="range"
                    min={min}
                    max={max}
                    value={minVal}
                    ref={minValueRef}
                    onChange={(event) => {
                        const value = Math.min(+event.currentTarget.value, maxVal - 1)
                        setMinVal(value)
                        event.currentTarget.value = value.toString()
                    }}
                    className={minVal > max - 100 ? "rangeinput__thumb rangeinput__thumb--zindex-5" : "rangeinput__thumb rangeinput__thumb--zindex-3"}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={maxVal}
                    ref={maxValueRef}
                    onChange={(event) => {
                        const value = Math.max(+event.currentTarget.value, minVal + 1);
                        setMaxVal(value);
                        event.currentTarget.value = value.toString();
                    }}
                    className="rangeinput__thumb rangeinput__thumb--zindex-4"
                />
                <div className="rangeinput__slider">
                    <div className="rangeinput__track" />
                    <div ref={range} className="rangeinput__range" />

                </div>
            </div>
        </div >
    );
}

export default RangeInput;