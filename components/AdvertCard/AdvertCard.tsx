
import "./AdvertCard.css"

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
    return (
        <div className="advert-card">

        </div>
    );
}

export default AdvertCard;