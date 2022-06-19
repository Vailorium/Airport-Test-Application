import { Field, Formik } from 'formik';
import React from 'react';
import * as yup from 'yup';
import Form from 'react-bootstrap/Form';
import SelectField from '../../common/SelectField';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
const axios = require('axios').default;

const bookSchema = yup.object().shape({
  seatCount: yup.number().min(0),
});

class BookFlightForm extends React.Component {
  constructor(props) {
    super(props);
  
    this.handleBook = this.handleBook.bind(this);
  }


  /**
   * 
   * @param {{seatCount: number}} values Booking form data
   * @returns {Promise<boolean>} True if login successful, false if login failed (for any reason)
   */
  async handleBook(values) {
    const { flight } = this.props;
    const data = {
      routes: flight.routes.map((r) => r.routeId),
      count: values.seatCount,
    };
    return new Promise((resolve) => axios.post(`${process.env.REACT_APP_API_URL}/book`, data, { withCredentials: true })
      .then((res) => {
        if(res.status === 200) {
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
    const { flight, handleCloseBook } = this.props;
    const maxSeats = flight.planeCapacity - Math.max(...flight.routes.map((r) => r.seats));
    const options = Array(maxSeats).fill().map((x, i) => ({ label: (i + 1).toString(), value: i + 1}));
    const basePrice = (flight.routes.map((r) => r.price).reduce((prev, curr) => prev + curr) / 100)
    return (
      <Formik
        validationSchema={bookSchema}
        onSubmit={async (values) => {
          const result = await this.handleBook(values);
          if(result === true) {
            handleCloseBook();
          } else {
            console.error("Error while trying to book flights!");
          }
        }}
        initialValues={{
          seatCount: 1,
        }}
      >
        {({
          handleSubmit,
          handleChange,
          values,
          isValid,
          touched,
          errors,
        }) => (
          <>
            <Form noValidate onSubmit={handleSubmit} className="d-flex flex-column mb-4">
              <Row className="mb-4">
                <Col sm="6">
                  <Form.Label>Seats</Form.Label>
                  <Field
                    name="seatCount"
                    component={SelectField}
                    options={options}
                    isValid={touched.seatCount && !errors.seatCount}
                    isInvalid={!!errors.seatCount}
                    errorMessage={errors.seatCount}
                    visualIndicators
                  />
                </Col>
              </Row>
              <Row>
                <Col sm="6">
                  <p>Price: ${(basePrice * values.seatCount).toFixed(2)}</p>
                </Col>
              </Row>
              <Row>
                <Col sm="6">
                  <Button
                    variant="primary"
                    type="submit"
                  >
                    Book
                  </Button>
                </Col>
              </Row>
            </Form>
          </>
        )}
      </Formik>
    )
  }
}
export default BookFlightForm;