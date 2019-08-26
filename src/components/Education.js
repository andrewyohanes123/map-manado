import React, { Component } from 'react'
import { Card, CardBody, Table } from 'reactstrap';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';

export default class Education extends Component {

  state = {
    data: [{a:0,b:0}],
    dataset: {
      labels: [],
      datasets: [{
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
          'rgba(34, 47, 62,0.2)',
          'rgba(16, 172, 132,0.2)',
          'rgba(95, 39, 205,0.2)',
          'rgba(1, 163, 164,0.2)',
          'rgba(255, 159, 67,0.2)'
        ],
        borderColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
          'rgba(255, 159, 64, 0.7)',
          'rgba(34, 47, 62,0.7)',
          'rgba(16, 172, 132,0.7)',
          'rgba(95, 39, 205,0.7)',
          'rgba(1, 163, 164,0.7)',
          'rgba(255, 159, 67,0.7)'
        ],
        borderWidth: 1,
        data: [0, 0]
      }]
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
      type: 'pendidikan',
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
        return g.TOTAL
      })
      labels = data.map(g => (g.PENDIDIKAN))
      this.setState({ data, dataset: { datasets, labels }, });
    })
  }

  render() {
    const { data, dataset } = this.state
    return (
      <Card className="border-0 shadow">
        <CardBody>
          <Doughnut data={dataset} width='100%' height='100' />
        </CardBody>
        <Table bordered striped>
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
        <CardBody>
          Total data : {typeof data !== 'undefined' && data.map(d => d.TOTAL).reduce((a, b) => (parseInt(a) + parseInt(b)), 0)}
        </CardBody>
      </Card>
    )
  }
}
