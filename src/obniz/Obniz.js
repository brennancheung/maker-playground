import React from 'react'
import PropTypes from 'prop-types'
import devices from './devices'
import { propEq } from 'ramda'

/* TODO: This component would be more flexible as a render prop. */
class Obniz extends React.Component {
  state = { text: this.props.text || `id: ${this.props.id}` }

  componentDidMount () {
    const { id } = this.props
    const device = devices.find(propEq('id', id))
    const access_token = device.token
    this.obniz = new window.Obniz(id, { access_token })
    this.obniz.onconnect = () => {
      this.obniz.display.font('monospace', 24)
      this.renderRemote()
    }
  }

  renderRemote = () => {
    this.obniz.display.clear()
    this.obniz.display.print(this.state.text)
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
