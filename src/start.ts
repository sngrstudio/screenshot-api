import { builder, type Handler } from '@netlify/functions'

const start: Handler = async () => {
  return {
    statusCode: 200,
    body: `
      HOW TO TAKE SCREENSHOT OF ANY WEBSITE ONLINE
      ============================================

      1. Add encoded URL parameter at the end, e.g /?url=https%3A%2F%2Fwww.bing.com%2F.
         This is mandatory.
      2. Optionally, add width and height parameter, e.g /?url=https%3A%2F%2Fwww.bing.com%2F&w=1920w&h=1080h.
         Don't forget 'w' and 'h' in the end. If you don't specify, image will be generated with
         1280x720 size.
      3. Right click -> "Save Image As" to save the generated screenshot. You may also integrate it with your
         apps programmatically. 

      (c)2023 dev.radenpioneer.blog. Powered by Browserless. Hosted on Netlify.
    `,
    ttl: 60 * 60 * 24 * 365,
  }
}

const handler = builder(start)

export { handler }
