import ReactHtmlParser, { convertNodeToElement, processNodes } from 'react-html-parser'

const allowedTags = [
  'p',
  'b',
  'i',
  'strong',
  'em',
  'a',
  'ul',
  'li',
  'ol',
  'span',
  'br',
  'style',
  'font',
]

const allowedAttribs = [
  'href',
  'target',
  'style',
  'class',
  'rel',
  'color',
  'size',
  'type',
]

function transform(node, index) {
  if (node.type === 'tag') {
    if (!allowedTags.includes(node.name)) return null
    if (Object.keys(node.attribs).some(attrib => !allowedAttribs.includes(attrib))) {
      return null
    }
    if (node.name === 'a') {
      node.attribs.target = '_blank'
      return convertNodeToElement(node, index, transform)
    }
    if (node.name === 'p') {
      if (node.children.length === 1 && node.children[0].name === 'br') {
        return convertNodeToElement(node.children[0], index, transform)
      }
      node.attribs.class = 'c-cs-parsed-element'
      return convertNodeToElement(node, index, transform)
    }
  }
}

const options = {
  decodeEntities: true,
  transform
}

export default function parse(html) {
  return ReactHtmlParser(html, options)
}
