import type { Handler } from '@netlify/functions'
import type { Browser } from 'puppeteer-core'
import { builder } from '@netlify/functions'
import chrome from 'chrome-aws-lambda'

const getBrowser = async () => chrome.puppeteer.launch({
    args: chrome.args,
    headless: true,
    ignoreHTTPSErrors: true,
    defaultViewport: chrome.defaultViewport,
    executablePath: await chrome.executablePath
})

const getImage:Handler = async () => {

    let browser: Browser|null = null
    let image: string|Buffer|null = null

    try {
        browser = await getBrowser()
        const page = await browser.newPage()
        await page.goto('https://sngr.studio', { waitUntil: ['networkidle0'] })
        image = await page.screenshot() as Buffer
    } catch(e) {
        return {
            statusCode: 500,
            body: JSON.stringify(e)
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
        isBase64Encoded: true
    }
}

const handler = builder(getImage)

export { handler }