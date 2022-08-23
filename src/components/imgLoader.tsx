import type { FC } from 'react'

interface IImgLoader {
    image: string
}

const ImgLoader: FC<IImgLoader> = ({ image }) => {
    return (
        <div className='mockup-window border-2 border-base-300'>
            <img src={image} width={600} height={338} alt="screenshot" />
        </div>
    )
}

export default ImgLoader