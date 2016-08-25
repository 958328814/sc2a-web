import m = require('mithril')

declare const BASE_URI: string

const baseURI: string = BASE_URI

type Interceptor = (opts: Mithril.XHROptions) => Mithril.XHROptions
const interceptors: Interceptor[] = []

let ongoingRequests = 0

export function addInterceptor(i: Interceptor) {
  interceptors.push(i)
  return () => {
    interceptors.splice(interceptors.indexOf(i), 1)
  }
}

export default function request(opts: Mithril.XHROptions) {
  const modifiedOpts = interceptors.reduce((opts, fn) => fn(opts), opts)
  modifiedOpts.url = `${BASE_URI}${opts.url}`
  ongoingRequests++
  m.redraw(true)
  return m.request(modifiedOpts).then((v) => {
    ongoingRequests--
    return v
  }, (v) => {
    ongoingRequests--
    return v
  })
}

export function hasOngoingRequest() {
  return !!ongoingRequests
}