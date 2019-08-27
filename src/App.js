import React, { Component } from 'react';
import { Row, Col, Container, Card, CardBody, Button } from 'reactstrap';
import ModalWindow from './components/Modal';
import GeoMan from 'geoman-client';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import BasemapToggle from './components/BasemapToggle';
import FloatWindow from './components/FloatWindow';

class App extends Component {
  state = {
    geo: {},
    basemaps: [],
    type: '',
    data: {

    },
    style: 'LIGHT',
    styles: [],
    districts: [],
    subdistricts: [],
    neighbors: [],
    district: '',
    subdistrict: '',
    neighbor: '',
    activeBasemaps: [],
    sidebar: false
  }

  componentDidMount() {
    let { geo, styles, style } = this.state;
    // eslint-disable-next-line no-undef
    geo = new GeoMan('http://10.71.71.71', 8080, {
      container: 'App',
      center: [
        124.842624,
        1.4794296
      ],
      zoom: 15
    },
      GeoMan.Styles[style]
    )
    styles = Object.keys(GeoMan.Styles);
    this.setState({ geo, styles }, this.getBasemaps);
    geo.setRegionLabelEvent('click', 'district', ev => {
      this.ping();
      this.setState({ district : '', subdistrict : '', subdistricts : [], neighbors : [], neighbor : '' });
      const {districts} = this.state;
      const {properties:data} = ev;
      districts.forEach(d => {
        if (d.name === data.name) {
          this.setState({ district : d.id })
          d.focus()
        }
      })
      this.setState({ type: 'kec', data })
    })
    geo.setRegionLabelEvent('click', 'subdistrict', ev => {
      this.ping();
      this.setState({ district : '', subdistrict : '', subdistricts : [], neighbors : [], neighbor : '' });
      const {districts} = this.state;
      const {properties:data} = ev;
      districts.forEach(async d => {
        if (d.name === data.district) {
          let subdistricts = await d.getSubdistricts()
          this.setState({ district : data.district_id, subdistrict : data.id, subdistricts })
          subdistricts = subdistricts.filter(s => s.name === data.name)[0]
          subdistricts.focus()
        }
      })
      this.setState({ type: 'kel', data: ev.properties })
    })
    geo.setRegionLabelEvent('click', 'neighbor', ev => {
      this.ping();
      this.setState({ district : '', subdistrict : '', subdistricts : [], neighbors : [], neighbor : '' });
      const {districts} = this.state;
      const {properties:data} = ev;
      districts.forEach(async d => {
        if (d.name === data.district) {
          let subdistricts = await d.getSubdistricts()
          let subdistrict = subdistricts.filter(s => s.name === data.subdistrict)[0]
          let neighbors = await subdistrict.getNeighbors()
          let neighbor = neighbors.filter(n => n.name === data.name)[0]
          neighbor.focus()
          this.setState({ district : data.district_id, subdistrict : data.id, subdistricts, neighbor : neighbor.id, neighbors })
        }
      })
      this.setState({ type: 'rw', data: ev.properties })
    })
    geo.map.on('zoom', e => {
      const zoom = e.target.getZoom();
      this.showBaseMap(zoom)
    })
    this.ping();
  }

  showBaseMap = zoom => {
    let { basemaps, activeBasemaps } = this.state;
    activeBasemaps = activeBasemaps.filter(a => a !== 'Jalan');
    activeBasemaps = activeBasemaps.filter(a => a !== 'Bangunan');
    activeBasemaps = activeBasemaps.filter(a => a !== 'Sungai');
    basemaps.map(b => {      
      if (b.name === 'Bangunan' && zoom > 15) {
        b.show()
        if (activeBasemaps.findIndex(x => x === 'Bangunan') === -1) activeBasemaps.push('Bangunan');
        this.setState({ activeBasemaps });
      } else if (b.name === 'Sungai' && zoom > 14) {
        b.show()
        if (activeBasemaps.findIndex(x => x === 'Sungai') === -1) activeBasemaps.push('Sungai');
        this.setState({ activeBasemaps });
      } else {
        if (zoom < 16 && zoom > 15) {
          const a = activeBasemaps.filter(b => b !== 'Bangunan');
          this.setState({ activeBasemaps: a });
        }

        if (zoom < 14.25 && zoom > 14) {
          const a = activeBasemaps.filter(b => b !== 'Jalan');
          this.setState({ activeBasemaps: a });
        }

        if (zoom < 14 && zoom > 13) {
          const a = activeBasemaps.filter(b => b !== 'Sungai');
          this.setState({ activeBasemaps: a });
        }

        if (b.name === 'Sungai' || b.name === 'Jalan' || b.name === 'Bangunan') {
          b.hide()
        }
      }
            

      if (b.name === 'Jalan' && zoom > 14.25) {
        b.show()
        if (activeBasemaps.findIndex(x => x === 'Jalan') === -1) activeBasemaps.push('Jalan');
        this.setState({ activeBasemaps });
      }
    })
  }

  getDistricts = async () => {
    const { geo } = this.state;
    const districts = await geo.getDistricts();
    this.setState({ districts });
  }

  getSubdistricts = async d => {
    const subdistricts = await d.getSubdistricts();
    this.setState({ subdistricts })
  }

  getNeighbors = async n => {
    const neighbors = await n.getNeighbors();
    this.setState({ neighbors })
  }

  ping = () => {
    axios.get('http://10.71.71.24:8080/api/index.php/citizens/ping').then(resp => {
      console.log(resp);
    })
  }

  getBasemaps = async () => {
    const { geo } = this.state;
    const z = geo.map.getZoom()
    this.showBaseMap(z)
    const basemaps = await geo.getBasemaps();
    this.setState({ basemaps, activeBasemaps: ['Jalan', 'Sungai'] })
    basemaps.map(b => {
      if (b.name === 'Jalan' || b.name === 'Sungai') {
        b.show()
      }
    })
    this.getDistricts();
  }

  click = (e, bmap) => {
    if (e.target.checked) {
      bmap.show();
    } else {
      bmap.hide();
    }
    bmap.color = 'red'
  }

  clearData = () => {
    this.setState({ type: '', data: {} });
  }

  render() {
    document.title = "Manado Map"
    const { district, neighbor, subdistrict, basemaps, activeBasemaps } = this.state;
    return (
      <div className="App">
        <BasemapToggle updateBasemaps={activeBasemaps => this.setState({ activeBasemaps })} activeBasemaps={activeBasemaps} basemaps={basemaps} />
        <div className="logo">
          <img src={require('./components/logo.png')} alt="" />
        </div>
        <div id="App" style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh' }}></div>
        {this.state.type.length > 0 && Object.keys(this.state.data).length > 0 && <FloatWindow onClick={this.clearData} data={this.state.data} type={this.state.type} />}
        <Container fluid>
          <Row className="justify-content-end text-light">
            {!this.state.sidebar &&
              <Col md="3" className="text-right p-2">
                <Button color="dark" size="sm" onClick={() => this.setState({ sidebar: true })}>Sidebar</Button>
              </Col>
            }
            {this.state.sidebar && <Col md="3" className="vh-100" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(10px)', overflow: 'auto', height: '100vh' }}>
              {/* <ul className="text-left">
                {this.state.basemaps.map(bmap => (<li key={bmap.id}>
                  <input type="checkbox" onClick={(e) => this.click(e, bmap)} id="" />&nbsp;
                  {bmap.name}
                </li>))}
              </ul>
              <hr /> */}
              <div className="text-left my-2">
                <Button size="sm" className="rounded p-1 d-block" onClick={() => this.setState({ sidebar: false })} color="danger">Tutup</Button>
              </div>
              <label htmlFor="" className="control-label my-2">Style Map</label>
              <select id="" value={this.state.style} onChange={e => {
                this.setState({ style: e.target.value }, async () => {
                  await this.state.geo.setStyle(GeoMan.Styles[this.state.style])
                  const z = this.state.geo.map.getZoom();
                  setTimeout(() => this.showBaseMap(z), 500)
                })
              }} className="form-control">
                {this.state.styles.map((style, i) => (
                  <option key={i} value={style}>{style}</option>
                ))}
              </select>
              <hr />
              <Button color="light" size="sm" onClick={() => {
                this.setState({ district : '', subdistrict : '', neighbor : '', neighbors: [], subdistricts : [] }, () => this.state.geo.clearFocuses());
              }}>Manado</Button>
              {this.state.subdistricts.length === 0 && this.state.districts.map(d => (<Card onClick={() => {
                this.setState({ district: d.id })
                d.focus()
              }} onDoubleClick={() => this.getSubdistricts(d)}
                className={district === d.id ? "bg-primary text-left my-2 shadow-sm" : "bg-dark text-left my-2 shadow-sm"} key={d.id}>
                <CardBody className="p-2">
                  {d.name}
                </CardBody>
              </Card>))}
              {this.state.neighbors.length === 0 &&
                <>
                  {this.state.subdistricts.length > 0 &&
                    <>
                      <div className="d-flex justify-content-between align-items-center">
                        <Button color="light" size="sm" onClick={() => {
                          this.setState({ district: '' }, () => this.state.geo.clearFocuses());
                          // this.state.subdistricts[0].district.focus()
                          this.setState({ subdistricts: [], subdistrict: '' })
                        }}>Kembali</Button>
                        <p className="m-0">{this.state.subdistricts[0].district.name}</p>
                      </div>
                      <hr />
                      {this.state.subdistricts.map(d => (<Card onClick={() => {
                        this.setState({ subdistrict: d.id })
                        d.focus()
                      }} onDoubleClick={() => this.getNeighbors(d)}
                        className={subdistrict === d.id ? "bg-primary text-left my-2 shadow-sm" : "bg-dark text-left my-2 shadow-sm"} key={d.id}>
                        <CardBody className="p-2">
                          {d.name}
                        </CardBody>
                      </Card>))}
                    </>
                  }
                </>
              }
              {this.state.neighbors.length > 0 &&
                <>
                  <div className="d-flex justify-content-between align-items-center">
                    <Button color="light" size="sm" onClick={() => {
                      this.state.neighbors[0].subdistrict.focus()
                      this.setState({ neighbors: [], neighbor: '' })
                    }}>Kembali</Button>
                    <p className="small m-0">Kel. {this.state.neighbors[0].subdistrict.name}</p>
                  </div>
                  <hr />
                  {this.state.neighbors.map(d => (<Card onClick={() => {
                    this.setState({ neighbor: d.id })
                    d.focus()
                  }} className={neighbor === d.id ? "bg-primary text-left my-2 shadow-sm" : "bg-dark text-left my-2 shadow-sm"} key={d.id}>
                    <CardBody className="p-2">
                      {d.name}
                    </CardBody>
                  </Card>))}
                </>
              }
            </Col>}
          </Row>
        </Container>
        {/* {
          this.state.type.length > 0 && Object.keys(this.state.data).length > 0 &&
          <ModalWindow type={this.state.type} onClick={this.clearData} data={this.state.data} />
        } */}
      </div>
    );
  }
}

export default App;
