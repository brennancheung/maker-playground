import React from 'react'
import PropTypes from 'prop-types'
import devices from './devices'
import { propEq } from 'ramda'
import { range } from '../fp'

/* TODO: This component would be more flexible as a render prop. */
class Obniz extends React.Component {
  state = { text: this.props.text || `id: ${this.props.id}` }

  componentDidMount () {
    const { id } = this.props
    const device = devices.find(propEq('id', id))
    const access_token = device.token
    this.obniz = new window.Obniz(id, { access_token })
    const o = this.obniz
    o.onconnect = () => {
      o.display.font('monospace', 24)
      o.io0.output(true)
      for (let i=0; i<=4; i++) {
        o[`io${i}`].output(0)
      }
      o.io11.output(true)
      o.io5.input(value => console.log('pin 5 set to', value))
      this.renderRemote()
    }
  }

  setPins = () => {
    const { onInputChange, pins } = this.props
    const o = this.obniz
    for (let i=1; i<=4; i++) {
      o[`io${i}`].output(pins[i])
    }
    if (!onInputChange) { return }
    range(5, 10).forEach(i => {
      o[`io${i}`].input(value => onInputChange(i, value))
    })
  }

  renderRemote = () => {
    this.obniz.display.clear()
    this.obniz.display.print(this.state.text)
    this.setPins()
  }

  componentDidUpdate (prevProps) {
    const { text } = this.props
    if (text !== prevProps.text) {
      this.setState({ text }, this.renderRemote)
    }
  }

  handleTextChange = e => this.setState({ text: e.target.value }, this.renderRemote)

  render () {
    return null
    /*
    return (
      <div style={{ marginBottom: '30px' }}>
        <div>
          <input type="text" value={this.state.text} onChange={this.handleTextChange} />
        </div>
      </div>
    )
    */
  }
}

Obniz.propTypes = {
  id: PropTypes.string.isRequired,
}

export default Obniz
