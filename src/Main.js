import React from 'react'
import ControllerInterface from './midi/ControllerInterface'
import LaunchControlXL from './midi/LaunchControlXL'
import {Typography } from '@material-ui/core'

class Main extends React.Component {
  render () {
    return (
      <div>
        <Typography variant="h3">Maker Playground</Typography>
        <LaunchControlXL>
          {props => <ControllerInterface {...props} />}
        </LaunchControlXL>
      </div>
    )
  }
}

export default Main
