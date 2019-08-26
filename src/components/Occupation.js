import React, { Component } from 'react'
import { Card, CardBody, Table, Row, Col } from 'reactstrap';
import { HorizontalBar } from 'react-chartjs-2';
import axios from 'axios';

export default class Education extends Component {

  state = {
    data: [{ a: 0, b: 0 }],
    dataset: {
      labels: [],
      datasets: [{
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 0.7)',
        borderWidth: 1,
        data: [0, 0],
      }],
    },
    options: {
      legend: {
        display: false
      }
    }
  }

  componentDidMount = () => {
    this.ping();
  }

  ping = () => {
    axios.get('http://10.71.71.24:8080/api/index.php/citizens/ping').then(resp => {
      console.log(resp);
      this.getGenders();
    })
  }

  getGenders = () => {
    const { type, data } = this.props;
    const params = {
      region: this.props.type,
      type: 'pekerjaan',
    };
    if (type === 'kec') {
      params.no_kec = data.no_kec
    } else if (type === 'kel') {
      params.no_kec = data.no_kec
      params.no_kel = data.no_kel
    } else if (type === 'rw') {
      params.no_kec = data.no_kec
      params.no_kel = data.no_kel
      params.no_rw = data.no_rw
    }
    axios.get('http://10.71.71.24:8080/api/index.php/citizens/statistics', {
      params
    }).then(({ data }) => {
      let { dataset: { datasets, labels } } = this.state;
      datasets[0].data = data.map(g => {
        return { x: g.TOTAL, y: g.PEKERJAAN }
      })
      labels = data.map(g => (g.PEKERJAAN))
      this.setState({ data, dataset: { datasets, labels }, });
    })
  }

  render() {
    const { data, dataset,options } = this.state
    return (
      <Card className="border-0 shadow my-2">
        <Row noGutters>
          <Col md="4">
            <Table size="sm" bordered striped>
              <thead>
                <tr>
                  {/* {typeof data !== 'undefined' ? data.map((dat) => ( */}
                  {Object.keys(data[0]).map((col, i) => (
                    <th key={i}>{col}</th>
                  ))}
                  {/* )) : ''} */}
                </tr>
              </thead>
              <tbody>
                {typeof data !== 'undefined' ? data.map((dat, i) => (
                  <tr key={i}>
                    {Object.keys(dat).map((col, i) => (
                      <td key={i}>{dat[col]}</td>
                    ))}
                  </tr>
                )) : ''}
              </tbody>
            </Table>
          </Col>
          <Col className="h-100" md="8">
            <CardBody className="h-100">
              <HorizontalBar options={options} data={dataset} width='100%' height='100%' />
            </CardBody>
          </Col>
        </Row>
        <CardBody>
          Total data : {typeof data !== 'undefined' && data.map(d => d.TOTAL).reduce((a, b) => (parseInt(a) + parseInt(b)), 0)}
        </CardBody>
      </Card>
    )
  }
}
