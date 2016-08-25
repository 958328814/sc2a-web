import m = require('mithril')
import request from '../libs/request'
import {setToken} from '../libs/auth'
import {fg} from '../libs/utils'

interface VM {
  user: Mithril.BasicProperty<string>
  password: Mithril.BasicProperty<string>
  busy: Mithril.BasicProperty<boolean>
  error: Mithril.BasicProperty<string>
  onSubmit: (evt: Event) => void
}

export default {
  controller(): VM {
    const vm = {
      user: m.prop(''),
      password: m.prop(''),
      busy: m.prop(false),
      error: m.prop(''),
      onSubmit(evt: Event) {
        evt.preventDefault()
        vm.busy(true)
        vm.error('')
        request({
          method: 'POST',
          url: '/login',
          data: {
            username: vm.user(),
            password: vm.password()
          }
        })
        .then(({token}) => {
          setToken(token)
        }, ({message}) => {
          vm.error(message)
        })
        .then(() => {
          vm.busy(false)
        })
      }
    }
    return vm
  },

  view(vm: VM) {
    const err = vm.error()
    const busy = vm.busy()

    return m('form.form-signin', { onsubmit: vm.onSubmit }, [
      m('h1', 'Sign In'),
      m('.alert.alert-danger', { class: err ? '' : 'hide' }, err),
      fg('Username', 
        m('input.form-control', { oninput: m.withAttr('value', vm.user) })
      ),
      fg('Password',
        m('input[type=password].form-control', { oninput: m.withAttr('value', vm.password) })
      ),
      m('button.btn.btn-primary[type=submit]', 'Sign In')
    ])
  }
}