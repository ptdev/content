import { eventHandler } from 'h3'

export default eventHandler(async (event) => {
  const slug = event.context.params?.slug
  
  if (slug === ':') {
    return [
      "hello.md"
    ]
  }

  if (slug?.endsWith('$')) {
    return {
      "meta": "value"
    }
  }
  
  return "# Hello World\n\nThis is a test file";
})