import type { FC } from 'react'
import { useStore } from '@nanostores/react'
import getScreenshot from '~/lib/getScreenshot'
import { screenshotUrl } from '~/lib/store'

const ImgLoader: FC = () => {
  const data = useStore(screenshotUrl)
  const src = getScreenshot(data)
  return (
    <div className="mockup-window border-4 border-base-300">
      <img src={src} width={600} height={338} alt="screenshot" />
    </div>
  )
}

export default ImgLoader
