import md5 from 'md5'
import 'isomorphic-fetch'

const MARVEL_API_BASEURL = 'https://gateway.marvel.com:443/v1/public'
const MARVEL_PUBLIC_KEY = 'f9b381a7f1b212818b39ce1c8e8fc8ab'
const MARVEL_PRIVATE_KEY = ''

function toQueryString(obj) {
  return Object.keys(obj)
    .filter(key => obj[key])
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`)
    .join('&')
}

function urlFor(path = '', params = {}) {
  const ts = Date.now()
  const hash = md5(ts+MARVEL_PRIVATE_KEY+MARVEL_PUBLIC_KEY)
  const query = toQueryString(Object.assign({}, {
    apikey: MARVEL_PUBLIC_KEY,
    ts,
    hash
  }, params))
  return `${MARVEL_API_BASEURL}/${path}?${query}`
}

function parseJson(response) {
  return response.json()
}

function request(path, options = {}) {
  return fetch(path).then(parseJson)
}

export default {
  characters: {
    find(params = {}) {
      return request(urlFor(`characters`, params))
    },

    findOne(characterId) {
      return request(urlFor(`characters`, { characterId }))
    }
  }
}
