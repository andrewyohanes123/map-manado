import React, { Component } from 'react'
import { Card, CardBody, Button, CardFooter } from 'reactstrap';
import Slider, { Range } from 'rc-slider';
import 'rc-slider/assets/index.css'

export default class BasemapToggle extends Component {
  state = {
    show: false
  }
  render() {
    const { basemaps, activeBasemaps, updateBasemaps } = this.props;
    return (
      <>
        {!this.state.show && <div onClick={() => this.setState({ show: true })} className="btn-toggle-container">
          <p className="m-0">Basemap</p>
        </div>}
        {this.state.show && <div className="toggle-basemap-container text-white">
          <p className="my-2 font-weight-light">Basemap</p>
          <hr className="text-white border-white" />
          <div className="basemap-wrapper">
          {basemaps.map(b => (
            <Card key={b.id}
              className={activeBasemaps.findIndex(x => x === b.name) > -1 ? "bg-primary border-0 my-2" : "bg-dark border-0 my-2"}
            >
              <CardBody
                onClick={() => {
                  if (activeBasemaps.findIndex(x => x === b.name) > -1) {
                    b.hide()
                    updateBasemaps(activeBasemaps.filter(a => a !== b.name))
                  } else {
                    b.show()
                    activeBasemaps.push(b.name);
                    updateBasemaps(activeBasemaps)
                  }
                }}
                className="p-2">{b.name}</CardBody>
              {activeBasemaps.findIndex(x => x === b.name) > -1 && <CardFooter>
                <Slider min={0} max={100} defaultValue={100} onChange={v => b.setOpacity(v/100)} />
              </CardFooter>}
            </Card>
          ))}
          </div>
          <hr />
          <Button color="light" size="sm" onClick={() => this.setState({ show: false })}>Tutup</Button>
        </div>}
      </>
    )
  }
}
