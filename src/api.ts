import puppeteer, { type Browser } from 'puppeteer-core'
import { builder, type Handler } from '@netlify/functions'

const isURL = (url: string) => {
  try {
    new URL(url)
    return true
  } catch (e) {
    return false
  }
}

const api: Handler = async (event) => {
  const params = event.path.split('/')

  if (!isURL(decodeURIComponent(params[params.length - 1]))) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        Error:
          'Please provide valid encoded URL. Example: ?url=https%3A%2F%2Fwww.bing.com%2F',
      }),
    }
  }
  const url = new URL(decodeURIComponent(params[params.length - 1]))
  const options = {
    width:
      Number(params.find((p) => p.endsWith('w'))?.replace('w', '')) || 1280,
    height:
      Number(params.find((p) => p.endsWith('h'))?.replace('h', '')) || 720,
  }

  let browser: Browser | null = null
  let image: string | Buffer | null = null

  try {
    browser = await puppeteer.connect({
      browserWSEndpoint: `wss://chrome.browserless.io?token=${process.env.BROWSER_TOKEN}`,
    })
    const page = await browser.newPage()
    await page.setViewport({
      width: options.width,
      height: options.height,
    })

    const response = await Promise.race([
      await page.goto(url.href, {
        waitUntil: 'networkidle2',
        timeout: 8500,
      }),
      new Promise((resolve) => {
        setTimeout(() => {
          resolve(false)
        }, 7000)
      }),
    ])

    if (response === false) await page.evaluate(() => window.stop())

    image = (await page.screenshot({
      type: 'jpeg',
      quality: 80,
      captureBeyondViewport: false,
    })) as Buffer
  } catch (e) {
    console.error(e.message)
    return {
      statusCode: 500,
      body: JSON.stringify({ Error: e.message }),
    }
  } finally {
    if (browser !== null) {
      await browser.close()
    }
  }

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'image/jpeg',
      'Content-Length': image.length,
    },
    body: image.toString('base64'),
    isBase64Encoded: true,
    ttl: 60 * 60 * 24 * 30 * 6,
  }
}

const handler = builder(api)

export { handler }
