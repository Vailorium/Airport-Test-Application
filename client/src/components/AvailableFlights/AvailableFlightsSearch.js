import React from 'react';
import * as yup from 'yup';
import { Formik, Field } from 'formik';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import SelectField from '../common/SelectField';
import FlightStore from '../../stores/FlightStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const flightSearchSchema = yup.object().shape({
  departureLocation: yup.string().required('From is required'),
  arrivalLocation: yup.string().required('To is required'),
  date: yup.date().min(new Date(new Date().setHours(0, 0, 0, 0)), 'Must be today, or after today').optional().nullable(),
});

class AvailableFlightsSearch extends React.Component {
  async componentDidMount() {
    await FlightStore.loadAirports();
    this.forceUpdate();
  }

  render() {
    const { updateTable } = this.props;

    const flightValues = FlightStore.getAirports().sort((a, b) => a.name > b.name ? 1 : -1).map((a) => ({
      label: `${a.name} (${a.code})`,
      value: a.code,
    }));
  
    return( 
      <Formik
        validationSchema={flightSearchSchema}
        onSubmit={async (values) => {
          const from = values.departureLocation;
          const to = values.arrivalLocation;
          let start, end;
          if(values.date) {
            start = new Date(new Date(values.date).setHours(0, 0, 0, 0));
            end = new Date(new Date(values.date).setHours(23, 59, 59, 999));
          } else {
            start = new Date();
            end = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 90)); // add 3 months onto current date, set as end date
          }
          await FlightStore.loadAvailableFlights(from, to, start, end);
          updateTable();
        }}
        initialValues={{
          departureLocation: '',
          arrivalLocation: '',
          date: null,
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
          <Form noValidate onSubmit={handleSubmit}>
            <Row className="mb-4">
              <Col sm="4">
                <Form.Label>From</Form.Label>
                <Field
                  name="departureLocation"
                  component={SelectField}
                  options={flightValues}
                  isValid={touched.departureLocation && !errors.departureLocation}
                  isInvalid={!!errors.departureLocation}
                  errorMessage={errors.departureLocation}
                  visualIndicators
                />
              </Col>
              <Col sm="4">
                <Form.Label>To</Form.Label>
                <Field
                  name="arrivalLocation"
                  component={SelectField}
                  options={flightValues}
                  isValid={touched.arrivalLocation && !errors.arrivalLocation}
                  isInvalid={!!errors.arrivalLocation}
                  errorMessage={errors.arrivalLocation}
                  visualIndicators
                />
              </Col>
              <Col sm="4">
                <Form.Label>Date</Form.Label>
                <Form.Control
                  name="date"
                  type="date"
                  onChange={handleChange}
                  isValid={touched.date && !errors.date}
                  isInvalid={!!errors.date}
                />
                <Form.Control.Feedback type="invalid">{errors.date}</Form.Control.Feedback>
              </Col>
            </Row>
            <Row className="justify-content-center">
              <Col sm="2">
                <Button
                  className="w-100"
                  variant="success"
                  disabled={!isValid || values.arrivalLocation === '' || FlightStore.state.availableFlightsLoading}
                  type="submit"
                >
                  <FontAwesomeIcon icon="search" />&nbsp;&nbsp;Search
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    );
  }
}
export default AvailableFlightsSearch;