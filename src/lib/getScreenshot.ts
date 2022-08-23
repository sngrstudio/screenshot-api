const getScreenshot = (url) =>
  `/.netlify/builders/screenshot/${encodeURIComponent(url)}`
export default getScreenshot
