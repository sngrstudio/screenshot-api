import type { FC } from 'react'
import { useForm } from 'react-hook-form'
import { useStore } from '@nanostores/react'
import { screenshotUrl } from '~/lib/store'
import style from './form.module.scss'

const Form: FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  const defaultSrc = useStore(screenshotUrl)
  const onSubmit = (data) => screenshotUrl.set(data.URL)

  return (
    <form className={style.__form} onSubmit={handleSubmit(onSubmit)}>
      <label className="label flex-1">
        <span className="hidden">URL</span>
        <input
          className="input input-bordered w-full"
          defaultValue={defaultSrc}
          {...register('URL')}
          type="text"
        />
      </label>
      <input className="btn" type="submit" value="Screenshot!" />
    </form>
  )
}

export default Form
