import React, { Component } from 'react'
import { Modal, ModalBody, ModalHeader, CardColumns } from 'reactstrap';
import Gender from './Gender';
import Religion from './Religion';
import Education from './Education';
import BloodType from './BloodType';
import Occupation from './Occupation';
import axios from 'axios';

export default class ModalInfo extends Component {

  componentDidMount = () => {
    this.ping();
  }

  ping = () => {
    axios.get('http://10.71.71.24:8080/api/index.php/citizens/ping').then(resp => {
      console.log(resp);
    })
  }

  render() {
    const { type, data } = this.props;
    return (
      <>
        <Modal size="xl" toggle={this.props.onClick} isOpen onClosed={this.props.onClick}>
          <ModalHeader toggle={this.props.onClick}>
            {type === 'kec' ? `Kecamatan ${data.name}`
              :
              type === 'kel' ? `Kecamatan ${data.district} - Kelurahan ${data.name}`
                :
                type === 'rw' ? `Kecamatan ${data.district} - Kelurahan ${data.subdistrict} - Lingkungan ${data.name}`
                  :
                  ''
            }
          </ModalHeader>
          <ModalBody>
            <CardColumns>
                <Gender data={data} type={type} />
                <Religion data={data} type={type} />
                <Education data={data} type={type} />
                <BloodType data={data} type={type} />
            </CardColumns>
            <Occupation data={data} type={type} />
          </ModalBody>
        </Modal>
      </>
    )
  }
}
