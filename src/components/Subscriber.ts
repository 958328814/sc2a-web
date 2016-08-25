import m = require('mithril')
import request from '../libs/request'
import {date} from '../libs/format'
import {fg} from '../libs/utils'

interface Sub {
  ID: string
  Name: string
  Date: string
  Email: string
}

interface FormProps {
  onAdd: () => void
}

interface FormVM {
  id: Mithril.BasicProperty<string>
  name: Mithril.BasicProperty<string>
  email: Mithril.BasicProperty<string>
  submit: () => void
}

const Form = {
  controller(props: FormProps): FormVM {
    const vm: FormVM = {
      id: m.prop(''),
      name: m.prop(''),
      email: m.prop(''),
      submit() {
        request({
          method: 'POST',
          url: '/api/sub',
          data: {
            name: vm.name(),
            email: vm.email().trim()
          }
        })
        .then(() => {
          vm.name('')
          vm.email('')
          props.onAdd()
        }, ({message}) => {
          alert(message)
        })
      }
    }
    return vm
  },

  view(vm: FormVM, props: FormProps) {
    const ok = vm.name() && vm.email().trim()

    return m('div', [
      fg('Name',
        m('input.form-control', { value: vm.name(), oninput: m.withAttr('value', vm.name)})
      ),
      fg('Email',
        m('input.form-control', { value: vm.email(), oninput: m.withAttr('value', vm.email)})
      ),
      m('button.btn.btn-primary[type=button]', 
        { disabled: !ok, onclick: vm.submit }, 
        'Add'
      )
    ])
  }
}

interface VM {
  list: Mithril.Property<Sub[]>
  reload: () => void
  unsubscribe: (id: string) => void
}

export default {
  controller(): VM {
    const vm = {
      list: request({
        method: 'GET',
        url: '/api/sub'
      }),
      reload() {
        vm.list = request({
          method: 'GET',
          url: '/api/sub'
        })
      },
      unsubscribe(id: string) {
        if (!confirm(`Are you sure to delete this subscriber?`)) {
          return
        }
        request({
          method: 'DELETE',
          url: '/api/sub/' + id
        })
        .then(vm.reload)
      }
    }
    return vm
  },
  view(vm: VM) {
    const list = vm.list()

    return m('.container-subscriber', [
      m('h1.page-header', 'Subscribers'),
      m.component(Form, { onAdd: vm.reload }),
      m('hr'),
      m('table.table.table-striped', [
        m('thead', [
          m('tr', [
            m('th', 'Date'),
            m('th', 'Name'),
            m('th', 'Email'),
            m('th')
          ])
        ]),
        m('tbody', list.length ? list.map((sub) =>
          m('tr', [
            m('td', date(sub.Date)),
            m('td', sub.Name),
            m('td', sub.Email),
            m('td', [
              m('button.btn.btn-danger.btn-xs', {
                onclick: () => vm.unsubscribe(sub.ID)
              }, 'Unsubscribe')
            ]),
          ])
        ) : m('tr', [
          m('td[colspan=4]', 'No subscriber.')
        ]))
      ])
    ])
  }
}