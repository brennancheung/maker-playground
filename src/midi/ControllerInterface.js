import React from 'react'
import Obniz from '../obniz/Obniz'
import devices from '../obniz/devices'
import { Button } from '@material-ui/core'

const buttonsRow1 = [41, 42, 43, 44, 57, 58, 59, 60]
const buttonsRow2 = [73, 74, 75, 76, 89, 90, 91, 92]
const buttonRows = [...buttonsRow1, ...buttonsRow2]

const dialsRow1 = [13, 29, 45, 61, 77, 93, 109, 125]
const dialsRow2 = dialsRow1.map(x => x + 1)
const dialsRow3 = dialsRow1.map(x => x + 2)
const dialRows = [...dialsRow1, ...dialsRow2, ...dialsRow3]

/*
const forRange = async (start, stop, fn) => {
  for (let i=start; i<=stop; i++) {
    fn(i)
    await sleep(50)
  }
}
*/

const sleep = ms => {
  const p = new Promise(resolve => {
    setTimeout(() => resolve(), ms)
  })
  return p
}

const withArr = arr => async fn => {
  for (let i=0; i<arr.length; i++) {
    fn(arr[i])
    await sleep(50)
  }
}

class ControllerInterface extends React.Component {
  state = {
    start: 0,
    end: 127,
    current: 0,
    red: 0,
    green: 0,
    pins: {},
  }

  componentDidMount () {
    this.props.addEventListener(this.handleEvent)
  }

  handleEvent = e => {
    if (e.type !== 'noteon') { return }
    if (!buttonsRow2.includes(e.number)) { return }

    const convertToPin = n => (n - 72) % 12
    const pin = convertToPin(e.number)
    this.setState(
      state => ({ pins: { ...state.pins, [pin]: !state.pins[pin] } }),
      this.setPins
    )
  }

  clearAll = () => {
    const { clearAll } = this.props
    clearAll()
  }

  setPins = () => {
    const { pins } = this.state
    const { setLED } = this.props

    const convertToControl = pin => {
      const offset = pin <= 4 ? 72 : 84

      return pin + offset
    }

    Object.entries(pins).forEach(([pin, on]) => {
      const controlNum = convertToControl(parseInt(pin, 10))
      const value = on ? 3 : 0
      setLED(controlNum, 0, value)
    })
  }

  setValue = field => e => this.setState({ [field]: e.target.value })

  setRow = arr => async (value, mask) => {
    const { setLED } = this.props
    const red = value * ((mask & 2) >> 1)
    const green = value * (mask & 1)
    arr.forEach(n => setLED(n, red, green))
    await sleep(200)
  }

  fadeInRow = async mask => {
    await this.setRow(buttonRows)(0, mask)
    await this.setRow(buttonRows)(1, mask)
    await this.setRow(buttonRows)(2, mask)
    await this.setRow(buttonRows)(3, mask)
    await this.setRow(buttonRows)(2, mask)
    await this.setRow(buttonRows)(1, mask)
  }

  cycle = async () => {
    const { setLED } = this.props
    this.clearAll()

    const animateButtons = withArr(buttonRows)
    // await animateButtons(n => setLED(n, 3, 0))
    // await animateButtons(n => setLED(n, 0, 3))
    // await animateButtons(n => setLED(n, 3, 3))

    const animateDials = withArr(dialRows)
    // await animateDials(n => setLED(n, 3, 0))
    // await animateDials(n => setLED(n, 0, 3))
    // await animateDials(n => setLED(n, 3, 3))

    for (let i=0; i<100; i++) {
      await this.fadeInRow(i % 4)
    }
  }

  render () {
    const { controllers, buttons } = this.props

    let text = ''
    for (let i=1; i<=8; i++) {
      text += this.state.pins[i] ? i : ' '
    }

    const device = devices[0]

    return (
      <div>
        <Obniz id={device.id} text={text} />
        <Button variant="contained" onClick={this.clearAll}>Clear All</Button>
        <br />
        <Button variant="contained" color="secondary" onClick={this.cycle}>Cycle</Button>
        <br />
        <br />
        <h3>Controller</h3>
        <pre>{JSON.stringify(controllers, null, 4)}</pre>
        <h3>Button</h3>
        <pre>{JSON.stringify(buttons, null, 4)}</pre>
        <h3>Pins</h3>
        <pre>{JSON.stringify(this.state.pins, null, 4)}</pre>
      </div>
    )
  }
}

export default ControllerInterface
