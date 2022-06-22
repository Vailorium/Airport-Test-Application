import React from 'react';
import Select from 'react-select';

// designed to handle validation and match bootstrap (v5) form styles
const SelectField = ({
  options,
  field,
  form,
  isValid,
  isInvalid,
  errorMessage,
  defaultValue,
  visualIndicators,
  expandMultiLine,
  onChangeEvent = () => {},
  ...rest
}) => (
    <>
    <Select
      placeholder={'--'}
      options={options}
      name={field.name}
      styles={{
        control: (base, state) => ({
          ...base,
          borderColor: isValid ? '#198754 !important'
            : (isInvalid ? '#dc3545 !important' : '#cccccc'),
          backgroundImage: visualIndicators
            ? (
              isValid
                ? "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3E%3Cpath fill='%23198754' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3E%3C/svg%3E\")"
                : (
                  isInvalid
                    ? "url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23dc3545'%3E%3Ccircle cx='6' cy='6' r='4.5'/%3E%3Cpath stroke-linejoin='round' d='M5.8 3.6h.4L6 6.5z'/%3E%3Ccircle cx='6' cy='8.2' r='.6' fill='%23dc3545' stroke='none'/%3E%3C/svg%3E\")"
                    : ''
                )
            )
            : '',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right calc(2.575em + .1875rem) center',
          backgroundSize: 'calc(.75em + .375rem) calc(.75em + .375em)',
          boxShadow: state.isFocused
            ? (
              isValid
                ? '0 0 0 0.25rem rgb(25 135 84 / 25%)'
                : (
                  isInvalid
                    ? '0 0 0 0.25rem rgb(220 53 69 / 25%)'
                    : '0 0 0 0.25rem rgb(13 110 253 / 25%)'
                )
            ) : '',
          outline: state.isFocused ? '0' : '',
        }),
        singleValue: (base, state) => ({
          ...base,
          whiteSpace: expandMultiLine ? 'normal' : base.whiteSpace,
          position: expandMultiLine ? 'static' : base.position,
          transform: expandMultiLine ? 'none' : base.transform,
        }),
        valueContainer: (base, state) => ({
          ...base,
          flexWrap: expandMultiLine ? 'nowrap' : base.flexWrap,
        }),
      }}
      onChange={
        (option) => { form.setFieldValue(field.name, option.value); onChangeEvent(option); }
      }
      onBlur={field.onBlur}
      value={
        defaultValue
          ? defaultValue(options)
          : options.find((option) => option.value === field.value)
      }
      {...rest}
    />
    {
      isInvalid
      && (<div style={{
        width: '100%', marginTop: '.25rem', fontSize: '.875rem', color: '#dc3545',
      }}>{errorMessage}</div>)
    }
    </>
);
export default SelectField;