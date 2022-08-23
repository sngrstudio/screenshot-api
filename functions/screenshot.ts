import type { Handler } from '@netlify/functions'
import type { Browser } from 'puppeteer-core'
import { builder } from '@netlify/functions'
import chrome from 'chrome-aws-lambda'

const isURL = (url:string) => {
    try {
        new URL(url)
        return true
    } catch (e) {
        return false
    }
}

const getBrowser = async () => chrome.puppeteer.launch({
    args: chrome.args,
    headless: true,
    ignoreHTTPSErrors: true,
    defaultViewport: chrome.defaultViewport,
    executablePath: await chrome.executablePath
})

const getImage:Handler = async (event) => {
    const params = event.path.split('/')
    if (!isURL(decodeURIComponent(params.at(-1)))) throw new Error(`Please provide decoded URL, e.g: '/image/https%3A%2F%2Fwww.sngr.studio'`)
    const url = new URL(decodeURIComponent(params.at(-1)))
    const options = {
        width: Number(params.find(p => p.endsWith('w'))?.replace('w', '')) || 1280,
        height: Number(params.find(p => p.endsWith('h'))?.replace('h', '')) || 720
    }

    let browser: Browser|null = null
    let image: string|Buffer|null = null

    try {
        browser = await getBrowser()
        const page = await browser.newPage()
        await page.setViewport({
            width: options.width,
            height: options.height
        })
        await page.goto(url.href, { waitUntil: ['networkidle2'] })
        image = await page.screenshot({ type: 'jpeg', quality: 80 }) as Buffer
    } catch(e) {
        console.error(e.message)
        return {
            statusCode: 500,
            body: JSON.stringify({ Error: e.message })
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
            'Content-Length': image.length
        },
        body: image.toString('base64'),
        isBase64Encoded: true,
        ttl: 60 * 60 * 24 * 30 * 3
    }
}

const handler = builder(getImage)

export { handler }