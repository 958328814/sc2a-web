import './index.html'
import './bootstrap.css'
import './styles.less'

import m = require('mithril')

import layout from './layout'
import SignIn from './components/SignIn'
import Release from './components/Release'
import Subscriber from './components/Subscriber'

import {init as initAuth} from './libs/auth'

initAuth()

m.route(document.body, '/', {
  '/': layout(Release),
  '/subscriber': layout(Subscriber)
})