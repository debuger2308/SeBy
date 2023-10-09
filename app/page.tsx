"use client"

import Categories from "@/components/Categories/Categories";
import { useState } from "react";


export default function Home() {

  const [activeCategory, setActiveCategory] = useState('')

  return (
    <main>
      <div className="container">
        <div className="main__mainpage">

          <Categories setActiveBtn={setActiveCategory} />

        </div>
      </div>
    </main>
  )
}
