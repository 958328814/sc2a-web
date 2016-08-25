import m = require('mithril')

export function fg(label: string, control: Mithril.Child) {
  return m('.form-group', [
    m('label.form-label', label),
    control
  ])
}