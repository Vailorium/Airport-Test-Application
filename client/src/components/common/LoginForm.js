import React from 'react';
import Form from 'react-bootstrap/Form';
import * as yup from 'yup';
import { Formik } from 'formik';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import UserStore from '../../stores/UserStore';

const axios = require('axios').default;

const loginSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().required('Password is required'),
});

class LoginForm extends React.Component {
  constructor() {
    super();

    this.state = {
      errorMessage: '',
    }

    this.handleLogin.bind(this);
    this.setErrorMessage.bind(this);
  }

  setErrorMessage(message) {
    this.setState({ errorMessage: message });
  }

  /**
   * 
   * @param {object} values Login form data
   * @returns {Promise<boolean>} True if login successful, false if login failed (for any reason)
   */
  async handleLogin(values) {
    return new Promise((resolve) => axios.post(`/auth/login`, values, { withCredentials: true })
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
        validationSchema={loginSchema}
        onSubmit={async (values) => {
          const loggedIn = await this.handleLogin(values);
          console.log(loggedIn);
          if(loggedIn) {
            if(modalHide) {
              modalHide();
            } else {
              // TODO: redirect
            }
          } else {
            this.setErrorMessage("Incorrect username or password");
          }
        }}
        initialValues={{
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
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={values.username}
                onChange={handleChange}
                isInvalid={!!errors.username}
              />
              <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={values.password}
                onChange={handleChange}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
            </div>
            <Button
              className="w-50 align-self-center"
              disabled={values.username === '' || values.password === '' || !isValid}
              variant="primary"
              type="submit"
            >
              Login
            </Button>
          </Form>
          {
            errorMessage
            && <Alert variant='danger'>
              {errorMessage}
            </Alert>
          }
        </>
      )}
    </Formik>
    );
  }
}
export default LoginForm;