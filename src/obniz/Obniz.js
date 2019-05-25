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
    this.obniz = new Obniz(id, { access_token })
    this.obniz.onconnect = this.renderRemote
  }

  renderRemote = () => {
    this.obniz.display.clear()
    this.obniz.display.print(this.state.text)
  }

  handleTextChange = e => this.setState({ text: e.target.value }, this.renderRemote)

  render () {
    return (
      <div style={{ marginBottom: '30px' }}>
        <div>
          <input type="text" value={this.state.text} onChange={this.handleTextChange} />
        </div>
      </div>
    )
  }
}

Obniz.propTypes = {
  id: PropTypes.string.isRequired,
}

export default Obniz
