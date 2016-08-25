import m = require('mithril')
import request from '../libs/request'
import {date} from '../libs/format'
import {fg} from '../libs/utils'

interface Release {
  ID: string
  Version: string
  Date: string
  Description: string
}

interface FormProps {
  onPublish: () => void
}

interface FormVM {
  version: Mithril.BasicProperty<string>
  description: Mithril.BasicProperty<string>
  file: File,
  configFileInput: (elem: Element, inited: boolean) => void,
  publish: () => void
}

const PublishForm = {
  controller(props: FormProps): FormVM {
    const vm: FormVM = {
      version: m.prop(''),
      description: m.prop(''),
      file: null,
      configFileInput(elem, inited) {
        if (inited) {
          return
        }
        elem.addEventListener('change', (evt) => {
          m.startComputation()
          vm.file = (evt.target as HTMLInputElement).files[0]
          m.endComputation()
        })
      },
      publish() {
        const form = new FormData()
        form.append("Version", vm.version())
        form.append("Description", vm.description())
        form.append("File", vm.file)

        request({
          method: 'POST',
          url: '/api/release',
          data: form,
          serialize: (v) => v
        })
        .then(() => {
          vm.version('')
          vm.description('')
          vm.file = null
          props.onPublish()
        }, ({message}) => {
          alert(message)
        })
      }
    }
    return vm
  },

  view(vm: FormVM, props: FormProps) {
    const file = vm.file
    const canPublish = vm.version() && vm.description() && vm.file

    return m('div', [
      fg('Version',
        m('input.form-control', { value: vm.version(), oninput: m.withAttr('value', vm.version)})
      ),
      fg('File',
        m('input[type=file].form-control', 
          { config: vm.configFileInput }
        )
      ),
      fg('Description',
        m('textarea.form-control', {
          rows: 10,
          value: vm.description(),
          oninput: m.withAttr('value', vm.description)
        })
      ),
      m('button.btn.btn-primary[type=button]', 
        { disabled: !canPublish, onclick: vm.publish }, 
        'Publish'
      )
    ])
  }
}

interface VM {
  list: Mithril.Property<Release[]>
  reload: () => void
  unpublish: (id: string) => void
}

export default {
  controller(): VM {
    const vm = {
      list: request({
        method: 'GET',
        url: '/api/release'
      }),
      reload() {
        vm.list = request({
          method: 'GET',
          url: '/api/release'
        })
      },
      unpublish(id: string) {
        if (!confirm(`Are you sure to unpublish this version?`)) {
          return
        }
        request({
          method: 'DELETE',
          url: '/api/release/' + id
        })
        .then(vm.reload)
      }
    }
    return vm
  },
  view(vm: VM) {
    const list = vm.list()

    return m('.container-release', [
      m('h1.page-header', 'Releases'),
      m.component(PublishForm, { onPublish: vm.reload }),
      m('hr'),
      m('table.table.table-striped', [
        m('thead', [
          m('tr', [
            m('th', 'Date'),
            m('th', 'Version'),
            m('th', 'Description'),
            m('th')
          ])
        ]),
        m('tbody', list.length ? list.map((release) =>
          m('tr', [
            m('td', date(release.Date)),
            m('td', release.Version),
            m('td.pre', release.Description),
            m('td', [
              m('button.btn.btn-danger.btn-xs', {
                onclick: () => vm.unpublish(release.ID)
              }, 'Unpublish')
            ]),
          ])
        ) : m('tr', [
          m('td[colspan=4]', 'No release.')
        ]))
      ])
    ])
  }
}