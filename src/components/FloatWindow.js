import React, { Component } from 'react'
import { Card, CardBody, Button } from 'reactstrap'
import { Doughnut, HorizontalBar } from 'react-chartjs-2'
import axios from 'axios'
import Draggable from 'react-draggable'

export default class FloatWindow extends Component {
    state = {
        top: 60,
        left: 15,
        types: {
            'Jenis Kelamin': 'jenis_kelamin',
            'Agama': 'agama',
            'Pendidikan': 'pendidikan',
            'Golongan Darah': 'golongan_darah',
            'Pekerjaan': 'pekerjaan',
        },
        type: 'Jenis Kelamin',
        data: [{ a: 0, b: 0 }],
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
                    'rgba(255, 159, 67,0.2)',
                    'rgba(29, 209, 161,0.2)',
                    'rgba(84, 160, 255,0.2)'
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
                    'rgba(255, 159, 67,0.7)',
                    'rgba(29, 209, 161,0.7)',
                    'rgba(84, 160, 255,0.7)'
                ],
                borderWidth: 1,
                data: [0, 0]
            }]
        }
    }

    componentDidMount = () => {
        this.getData()
    }

    onchange = ev => {
        this.setState({ type: ev.target.value }, this.getData);
    }

    componentWillReceiveProps = (p) => {
        this.getData(p)
    }

    getData = (p) => {
        const { type, data } = typeof p === 'undefined' ? this.props : p;
        const { type: t, types } = this.state;
        const params = {
            region: this.props.type,
            type: types[t],
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
            if (typeof datasets[0].data !== 'undefined') {
                if (t === 'Pekerjaan') {
                    datasets[0].backgroundColor = 'rgba(54, 162, 235, 0.2)'
                    datasets[0].borderColor = 'rgba(54, 162, 235, 0.7)'
                } else {
                    datasets[0].backgroundColor = [
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
                        'rgba(255, 159, 67,0.2)',
                        'rgba(29, 209, 161,0.2)',
                        'rgba(84, 160, 255,0.2)'
                    ]
                    datasets[0].borderColor = [
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
                        'rgba(255, 159, 67,0.7)',
                        'rgba(29, 209, 161,0.7)',
                        'rgba(84, 160, 255,0.7)'
                    ]
                }

                console.log(data)

                datasets[0].data = data.map(g => {
                    return g.TOTAL
                })
                labels = data.map(g => {
                    return (g[types[t].toUpperCase()])
                })
                this.setState({ data, dataset: { datasets, labels }, });
            }
        })
    }

    render() {
        const { types, type, dataset, data : d } = this.state;
        const {data, type : t} = this.props;
        return (
            <div style={{ position: 'fixed', width: type !== 'Pekerjaan' ? 350 : 700 }}>
                <Draggable
                    defaultPosition={{ x: 227, y: 41 }}
                >
                    <Card style={{
                        background: 'rgba(255,255,255,0.5)',
                        backdropFilter: 'blur(10px)',
                        WebkitBackdropFilter : 'blur(10px)'
                    }} className="border-0 shadow text-left">
                        <CardBody className="p-2">
                            <div className="d-flex justify-content-between align-items-center">
                                <Button size="sm" className="d-inline-block" color="danger" onClick={() => this.props.onClick()}>Tutup</Button>
                                <p className="m-0 text-right">{t === 'kec' ? `Kecamatan ${data.name}`
                                    :
                                    t === 'kel' ? `Kecamatan ${data.district} - Kelurahan ${data.name}`
                                        :
                                        t === 'rw' ? `Kecamatan ${data.district} - Kelurahan ${data.subdistrict} - Lingkungan ${data.name}`
                                            :
                                            ''
                                }</p>
                            </div>
                            <hr />
                            <select className="form-control form-control-sm" onChange={this.onchange} value={type} id="">
                                {Object.keys(types).map((t, i) => (
                                    <option key={i} value={t}>{t}</option>
                                ))}
                            </select>
                            {type !== 'Pekerjaan' && <Doughnut data={dataset} width={100} height={100} />}
                            {type === 'Pekerjaan' && <HorizontalBar options={{
                                legend: { display: false }
                            }} data={dataset} width="100%" height="100%" />}
                            <hr/>
                            Total data : {typeof d !== 'undefined' && d.map(dt => dt.TOTAL).reduce((a, b) => (parseInt(a) + parseInt(b)), 0)}
                        </CardBody>
                    </Card>
                </Draggable>
            </div>
        )
    }
}
