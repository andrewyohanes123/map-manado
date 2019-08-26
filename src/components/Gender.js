import React, { Component } from 'react'
import { Card, CardBody, Table } from 'reactstrap';
import { Doughnut } from 'react-chartjs-2';
import axios from 'axios';

export default class Gender extends Component {

  state = {
    data: [],
    dataset: {
      labels: ['Laki - laki', 'Perempuan'],
      datasets: [{
        backgroundColor: [
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 99, 132, 0.2)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 99, 132, 0.7)',
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
      type: 'jenis_kelamin',
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
      const { dataset: { datasets } } = this.state;
      datasets[0].data = data.map(g => {
        return g.TOTAL
      })
      this.setState({ data, dataset: { datasets } });
    })
  }

  render() {
    const { data, dataset } = this.state
    console.log(data);
    return (
      <Card className="border-0 shadow">
        <CardBody>
          <Doughnut data={dataset} width='100%' height='100' />
        </CardBody>
        <Table bordered striped>
          <thead>
            <tr>
              <th>Jenis Kelamin</th>
              <th>Jumlah</th>
            </tr>
          </thead>
          <tbody>
            {typeof data !== 'undefined' ? data.map((dat, i) => (
              <tr>
                <td>{dat.JENIS_KELAMIN}</td>
                <td>{dat.TOTAL}</td>
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
