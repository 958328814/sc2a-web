import m = require('mithril')

import {addInterceptor} from './request'

const state = {
  token: localStorage.getItem('token') || ''
}

function extract(xhr: XMLHttpRequest, opts: Mithril.XHROptions): string {
  if (xhr.status === 204) {
    return 'null'
  }
  
  if (xhr.status === 401) {
    setToken('')
  }

  return xhr.responseText
}

export function isLoggedIn() {
  return state.token !== ''
}

export function setToken(token: string) {
  state.token = token
  localStorage.setItem('token', token)
}

export function init() {
  addInterceptor((opts) => {
    if (state.token) {
      opts.config = (xhr) => {
        xhr.setRequestHeader('Authorization', `Bearer ${state.token}`)
      }
    }
    opts.extract = extract
    return opts
  })
}