import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

const SearchFilter = ({ doSearch }) => {
  const [value, setValue] = useState('');
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        doSearch(value);
      }}
    >
      <InputGroup className="mb-3">
        <InputGroup.Prepend>
          <InputGroup.Text>
            <FontAwesomeIcon icon={faSearch} />
          </InputGroup.Text>
        </InputGroup.Prepend>
        <Form.Control
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          placeholder={'post content must contain'}
        />
        <InputGroup.Append>
          <Button variant="outline-secondary" type="submit">
            Search
          </Button>
        </InputGroup.Append>
      </InputGroup>
    </Form>
  );
};
export default SearchFilter;
