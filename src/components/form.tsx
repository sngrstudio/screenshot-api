import type { FC } from 'react'

const Form: FC = () => {
    return (
        <form className='form-control' action="">
            <label>
                <input className='input' type="text" />
                <span className='label'>URL</span>
            </label>
            <label>
                <input type="text" />
                <span>Width</span>
            </label>
            <label>
                <input type="text" />
                <span>Height</span>
            </label>
            <label>
                <input type="submit" />
                <span>Screenshot!</span>
            </label>
        </form>
    )
}

export default Form