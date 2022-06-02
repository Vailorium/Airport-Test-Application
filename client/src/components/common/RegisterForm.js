import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import * as yup from 'yup';
import { Formik } from 'formik';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import UserStore from '../../stores/UserStore';

const axios = require('axios').default;

const registerSchema = yup.object().shape({
  displayName: yup.string().required('Display Name is required').max(50, "Display Name cannot contain more than 50 characters"),
  username: yup.string().required('Username is required').max(50, "Username cannot contain more than 50 characters"),
  password: yup.string().required('Password is required').min(8, 'Password must contain atleast 8 characters'),
});

class RegisterForm extends React.Component {
  constructor() {
    super();
    this.state = {
      errorMessage: '',
    };

    this.setErrorMessage = this.setErrorMessage.bind(this);
  }

  setErrorMessage(message) {
    this.setState({ errorMessage: message });
  }

  /**
   * 
   * @param {object} values Register form data
   * @returns {Promise<boolean>} True if registration successful, false if registration failed (for any reason)
   */
  async handleRegister(values) {
    return new Promise((resolve) => axios.post(`${process.env.REACT_APP_API_URL}/register`, values, { withCredentials: true })
      .then((res) => {
        if(res.status === 200) {
          UserStore.setUser(res.data.user);
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((err) => {
        resolve(false);
      }),
    );
  }

  render() {
    const { modalHide } = this.props;
    const { errorMessage } = this.state;
    return (
      <Formik
      validationSchema={registerSchema}
      onSubmit={async (values) => {
        const loggedIn = await this.handleRegister(values);
        if(loggedIn) {
          if(modalHide) {
            modalHide();
          } else {
            //TODO: redirect
          }
        } else {
          this.setErrorMessage("Unknown error occured");
        }
      }}
      initialValues={{
        displayName: '',
        username: '',
        password: ''
      }}
      >
      {({
        handleSubmit,
        handleChange,
        handleBlur,
        values,
        touched,
        isValid,
        errors,
      }) => (
        <>
          <Form noValidate onSubmit={handleSubmit} className="d-flex flex-column mb-4">
            <div className="mb-4">
              <Form.Label>Display Name</Form.Label>
              <Form.Control
                type="text"
                name="displayName"
                value={values.displayName}
                onChange={handleChange}
                isValid={touched.displayName && !errors.displayName}
                isInvalid={!!errors.displayName}
              />
              <Form.Control.Feedback type="invalid">{errors.displayName}</Form.Control.Feedback>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={values.username}
                onChange={handleChange}
                isValid={touched.username && !errors.username}
                isInvalid={!!errors.username}
              />
              <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                isValid={touched.password && !errors.password}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
            </div>
            <Button
              className="w-50 align-self-center"
              disabled={values.username === '' || values.password === '' || values.displayName === '' || !isValid}
              variant="primary"
              type="submit"
            >
              Register
            </Button>
          </Form>
          {
            errorMessage
            && <Alert variant='error'>
              {errorMessage}
            </Alert>
          }
        </>
      )}
    </Formik>
    );
  }
}
export default RegisterForm;