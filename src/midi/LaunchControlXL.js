import React from 'react'
import WebMidi from 'webmidi'

const trace = x => {
  // console.log(x)
  return x
}

const mapControlChangeEvent = e => ({
  channel: e.channel,
  controller: e.controller.number,
  timestamp: e.timestamp,
  value: e.value,
})

const mapNoteEvent = e => ({
  number: e.note.number,
})

const range = (start, stop) => {
  let arr = []
  for (let i=start; i<=stop; i++) {
    arr.push(i)
  }
  return arr
}

class LaunchControlXL extends React.Component {
  state = {
    wm: null,
    input: null,
    output: null,
    controllers: {},
    buttons: {},
    listeners: [],
  }

  componentDidMount () {
    const { deviceName } = this.props
    const wm = WebMidi

    window.wm = WebMidi
    WebMidi.enable(err => {
      if (err) {
        console.log('Could not enable WebMidi', err)
        return
      }
      const input = WebMidi.getInputByName(deviceName)
      const output = WebMidi.getOutputByName(deviceName)

      if (!input || !output) {
        console.error(`Unabled to find ${deviceName}`)
        return
      }

      this.setState({
        wm,
        input,
        output,
        setController: this.setController,
        setLED: this.setLED,
        clearAll: this.clearAll,
        addEventListener: this.addEventListener,
      }, () => {
        this.registerListeners()
      })

      // output.playNote(42, 1, { rawVelocity: true, velocity: 63 })
      console.log(`WebMidi enabled for ${deviceName}!`)
    })
  }

  addEventListener = fn => {
    const { listeners } = this.state
    this.setState({ listeners: [...listeners, fn] })
  }

  triggerListener = type => event => {
    this.state.listeners.forEach(fn => fn({ ...event, type }))
  }

  clearAll = () => {
    range(0, 127).forEach(i => this.setLED(i, 0, 0))
    range(0, 119).forEach(i => this.setController(i, 0, 0))
  }

  setController = (controller, green, red, flash = false) => {
    const { output } = this.state
    const flags = flash ? 12 : 8
    const value = 16 * green + red + flags
    // console.log(`Setting ${controller} to ${value}`)
    output.sendControlChange(controller, value)
  }

  setLED = (controller, green, red, flash = false) => {
    const { output } = this.state
    const flags = flash ? 12 : 8
    const velocity = 16 * green + red + flags
    output.playNote(controller, 9, { rawVelocity: true, velocity } )
  }

  registerListeners = () => {
    const { input } = this.state

    input.addListener('controlchange', 'all', e => {
      const { controller, value } = trace(mapControlChangeEvent(e))
      this.setState({ controllers: { ...this.state.controllers, [controller]: value } })
      this.triggerListener('controlchange')(mapControlChangeEvent(e))
    })

    input.addListener('noteon', 'all',  e => {
      const { number } = mapNoteEvent(e)
      this.setState({ buttons: { ...this.state.buttons, [number]: true } })
      this.triggerListener('noteon')(mapNoteEvent(e))
    })

    input.addListener('noteoff', 'all',  e => {
      const { number } = mapNoteEvent(e)
      this.setState({ buttons: { ...this.state.buttons, [number]: false } })
      this.triggerListener('noteoff')(mapNoteEvent(e))
    })
  }

  render () {
    const { wm } = this.state
    const { children, deviceName } = this.props
    if (!wm) {
      return <div>Loading {deviceName}</div>
    }
    return children(this.state)
  }
}

LaunchControlXL.defaultProps = {
  deviceName: 'Launch Control XL',
}

export default LaunchControlXL
