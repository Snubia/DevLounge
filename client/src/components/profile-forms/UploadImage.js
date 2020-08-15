import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import { UploadImage } from '../../actions/profile';

export default class FilesUploadComponent extends Component {
  constructor(props) {
    super(props);

    this.onFileChange = this.onFileChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    this.state = {
      avatar: '',
    };
  }

  onFileChange(e) {
    this.setState({
      avatar: e.target.files[0],
    });
  }

  onSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append('avatar', this.state.avatar);
    axios
      .post('http://localhost:4000/api/user-profile', formData, {})
      .then((res) => {
        console.log(res);
      });
  }

  render() {
    return (
      <div className='container'>
        <div className='row'>
          <form onSubmit={this.onSubmit}>
            <div className='form-group'>
              <input type='file' onChange={this.onFileChange} />{' '}
            </div>{' '}
            <div className='form-group'>
              <button className='btn btn-primary' type='submit'>
                Upload image{' '}
              </button>{' '}
            </div>{' '}
          </form>{' '}
        </div>{' '}
      </div>
    );
  }
}
FilesUploadComponent.propTypes = {
  UploadImage: PropTypes.func.isRequired,
};
