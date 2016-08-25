import m = require('mithril')

import {isLoggedIn, setToken} from './libs/auth'
import SignIn from './components/SignIn'
import Spinner from './components/spinner'

const navItems = [
  { label: 'Releases', link: '/release' },
  { label: 'Subscribers', link: '/subscriber' },
  { label: 'Stats', link: '/stats' }
]

const state = {
  collapsed: false
}

function signOut() {
  setToken('')
  m.route('/')
}

function toggle() {
  state.collapsed = !state.collapsed
}

export default function<T> (component: Mithril.Component<T>): Mithril.Component<T> {
  return {
    controller() {
      return null
    },
    view() {
      if (!isLoggedIn()) {
        return m('.container', [
          m.component(Spinner),
          SignIn
        ])
      }

      return m('div', [
        m.component(Spinner),
        m('.navbar.navbar-default.navbar-fixed-top', [
          m('.container', [
            m('.navbar-header', [
              m("button.navbar-toggle.collapsed[type='button']", { onclick: toggle },
                [
                  m("span.sr-only", 
                    "Toggle navigation"
                  ),
                  m("span.icon-bar"),
                  m("span.icon-bar"),
                  m("span.icon-bar")
                ]
              ),
              m('a.navbar-brand', 'DreamHacks')
            ]),
            m('.collapse.navbar-collapse', { class: state.collapsed ? 'in' : '' }, [
              m('ul.nav.navbar-nav', navItems.map(({label, link}) => 
                m('li', [
                  m('a', { href: link, config:m.route}, label)
                ])
              )),
              m('ul.nav.navbar-nav.navbar-right', [
                m('li', [
                  m('p.navbar-btn', [
                    m('a.btn.btn-danger.nav-btn', { onclick: signOut }, 'Sign Out')
                  ])
                ])
              ])
            ])
          ])
        ]),
        m('.container', m.component(component))
      ])
    }
  }
}