import React, { Component } from 'react';
import { Button, Form, Col, Row, FormGroup, Label, Input, Container } from 'reactstrap';
import { cloneDeep } from 'lodash';

import InputElement from '../../components/InputElement/InputElement';
import Password from '../../components/Password/Password';
import Checkbox from '../../components/Checkbox/Checkbox';
import RadioButton from '../../components/RadioButton/RadioButton';
import { getClone } from '../../utilities/Utilities';
import './Register.css';

class Register extends Component {
  constructor() {
    super();
    this.state = {
      currentForm: {
        username: '',
        email: '',
        password: '',
        mobileno: '',
        address: '',
        gender: '',
        city: [],
        valid: {
          username: null,
          email: null,
          password: null,
          mobileno: null,
          gender: null,
          checkbox: null,
          address: null,
        } //add validation message instead of true false in valid
      },
    }
    this.cityNames = ['Ahmedabad', 'Rajkot', 'Surat'];
    this.radioFields = ['Male', 'Female'];
    this.cityNamesNew = [{ value: '0', name: 'Ahmedabad' }, { value: '1', name: 'Rajkot' }, { value: '2', name: 'Surat' }]
    this.radioFieldsNew = [{ genderId: '0', gender: 'Male' }, { genderId: '1', gender: 'Female' }, { genderId: '2', gender: 'Other' }];
    this.baseState = cloneDeep(this.state.currentForm);

    this.editClickHandler = this.editClickHandler.bind(this);
    this.submitClickHandler = this.submitClickHandler.bind(this);
  }

  editClickHandler = () => {
    !this.state.registered
      ? console.log('Please register before edit.')
      : this.setState((state) => ({ currentForm: { ...state.registered, password: '', valid: { ...state.registered.valid, password: null } } }));
  }

  submitClickHandler = (e) => {
    e.preventDefault();
    let obj = getClone(this.state.currentForm, this.validationHandler);
    if (obj) {
      this.setState({ currentForm: this.baseState, registered: obj, reset: true });
    } else {
      console.log('Failed');
    }
  }

  radioHandler = id => {
    this.setState({
      currentForm: {
        ...this.state.currentForm,
        gender: id,
        valid: {
          ...this.state.currentForm.valid,
          gender: true,
        }
      }
    });
  }

  addressChangeHandler = e => {
    this.setState({
      currentForm: {
        ...this.state.currentForm,
        address: e.target.value
      }
    })
  }
  checkboxHandler = id => {
    let validate;
    let tempcity = this.state.currentForm.city;
    tempcity.includes(id) ? tempcity.splice(tempcity.indexOf(id), 1) : tempcity.push(id);
    this.setState({
      currentForm: {
        ...this.state.currentForm,
        city: tempcity
      }
    });
    tempcity.length > 0 ? validate = true : validate = false;
    this.validationHandler('checkbox', validate)
  }

  validationHandler = (key, value) => {
    let valid = this.state.currentForm.valid;
    valid[key] = value;
    this.setState({
      currentForm: {
        ...this.state.currentForm,
        valid: valid
      }
    });
  }

  changeHandler = (key, value) => {
    this.setState({
      currentForm: {
        ...this.state.currentForm,
        [key]: value
      }
    });
  }

  componentDidUpdate() {
    this.state.reset && this.setState({ reset: false });
  }
  render() {
    const { username, email, password, mobileno, gender, address, valid, city } = this.state.currentForm;
    return (
      <Container>
        <Row>
          <Col md={{ size: 6, offset: 3 }}>
            <Form className='form'>
              <p className="heading">Registration Form</p>
              <InputElement
                inputProps={{
                  name: "username",
                  placeholder: "Username",
                  value: username,
                }}
                info="Username should starts with letter. ex. John_123"
                errMsg="Please enter valid username."
                regularEx="^([a-zA-Z]+[a-zA-Z0-9_]*)$"
                validSymbol={true}
                valid={valid.username}
                validationFunc={(value) => { this.validationHandler('username', value); }}
                changeFunc={(value) => { this.changeHandler('username', value); }} />

              <InputElement
                inputProps={{
                  type: "email",
                  name: "email",
                  placeholder: "Email Address",
                  value: email,
                }}
                info="ex. john@business.com"
                errMsg="Please enter valid email id."
                valid={valid.email}
                validationFunc={(value) => { this.validationHandler('email', value) }}
                changeFunc={(value) => { this.changeHandler('email', value); }} />

              <Password
                info="Password should contain digit, letter and special character. Length should be between 6 to 16."
                value={password}
                validVal={valid.password}
                reset={this.state.reset}
                validationFunc={(value) => { this.validationHandler('password', value) }}
                changeFunc={(value) => { this.changeHandler('password', value); }} />

              <InputElement
                inputProps={{
                  name: "mobile",
                  placeholder: "Mobile Number",
                  value: mobileno,
                }}
                info="Enter 10 digits mobile number."
                errMsg="Please enter valid mobile no."
                maxLength={10}
                valid={valid.mobileno}
                validationFunc={(value) => { this.validationHandler('mobileno', value) }}
                changeFunc={(value) => { this.changeHandler('mobileno', value); }} />

              <Checkbox
                id='city'
                label='Select your city'
                dataSource={this.cityNamesNew}
                dataValue='value'
                dataName='name'
                simpleArray={false}
                valid={valid.checkbox}
                checked={city}
                inline={true}
                changeListener={this.checkboxHandler} />

              <RadioButton
                id='gender'
                label='Gender'
                dataSource={this.radioFieldsNew}
                dataValue='genderId'
                dataName='gender'
                simpleArray={false}
                valid={valid.gender}
                checked={gender}
                inline={true}
                changeListener={this.radioHandler} />

              <FormGroup>
                <Label for='address'>Enter your Address</Label>
                <Input type="textarea"
                  name="address"
                  value={address}
                  className={valid.address !== null ? (!valid.address ? 'is-invalid' : 'is-valid') : null}
                  rows='3'
                  placeholder="1207, Times Square, Thaltej, Ahmedabad."
                  onChange={id => this.addressChangeHandler(id)}
                  onBlur={() => this.validationHandler('address', address !== '' ? true : false)} />
              </FormGroup>

              <Row>
                <Col md='6'>
                  <Button
                    onClick={this.editClickHandler}
                    block>
                    Edit
                  </Button>
                </Col>
                <Col md='6'>
                  <Button
                    color='primary'
                    onClick={this.submitClickHandler}
                    block>
                    Submit
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default Register;