import m = require('mithril')

import {hasOngoingRequest} from '../libs/request'

export default {
  controller() {
    return {}
  },
  view() {
    const visible = hasOngoingRequest()
    return m('.spinner-container', { class: visible ? '' : 'hide' }, [
      m('.spinner', [
        m('.bounce1'),
        m('.bounce2'),
        m('.bounce3')
      ])
    ])
  }
}