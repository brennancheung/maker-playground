import React from 'react'
import { Slider } from '@material-ui/lab'
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
  }

  clearAll = () => {
    const { clearAll } = this.props
    clearAll()
  }

  setValue = field => e => this.setState({ [field]: e.target.value })

  cycle = async () => {
    const { setLED } = this.props
    this.clearAll()

    const animateButtons = withArr(buttonRows)
    await animateButtons(n => setLED(n, 3, 0))
    await animateButtons(n => setLED(n, 0, 3))
    await animateButtons(n => setLED(n, 3, 3))

    const animateDials = withArr(dialRows)
    await animateDials(n => setLED(n, 3, 0))
    await animateDials(n => setLED(n, 0, 3))
    await animateDials(n => setLED(n, 3, 3))
  }

  handleSliderChange = (e, value) => {
    const { setLED } = this.props
    // this.clearAll()
    setLED(value, 3, 0)
    this.setState({ current: value })
  }

  render () {
    const { controllers, buttons } = this.props
    const { current } = this.state

    return (
      <div>
        <Button variant="contained" onClick={() => this.handleSliderChange(0, current-1)}>-</Button>
        <Button variant="contained" onClick={() => this.handleSliderChange(0, current+1)}>+</Button>
        <Button variant="contained" onClick={this.clearAll}>Clear All</Button>
        <br />
        <Button variant="contained" color="secondary" onClick={this.cycle}>Cycle</Button>
        <br />
        {current}
        <br />
        <br />
        <Slider value={current} min={0} max={127} step={1} onChange={this.handleSliderChange} />
        <br />
        <h3>Controller</h3>
        <pre>{JSON.stringify(controllers, null, 4)}</pre>
        <h3>Button</h3>
        <pre>{JSON.stringify(buttons, null, 4)}</pre>
      </div>
    )
  }
}

export default ControllerInterface
