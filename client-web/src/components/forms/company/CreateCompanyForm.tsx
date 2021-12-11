import React, { useState } from 'react';

import { Paper, Box, TextField, Fab } from '@mui/material';

import AddIcon from '@mui/icons-material/Add';
import logo from '../../../images/cover-me-logo.png';
import { IValidation } from 'models/Validation';
import { isEmpty, isEmail } from 'utils/validation';

const CreateCompanyForm: React.FC = () => {
  const [companyName, setCompanyName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [errors, setErrors] = useState<IValidation>({
    valid: false,
    fields: {
      name: '',
      email: '',
      phone: '',
    },
  });

  const handleCreateCompany = () => {
    let result = true;
    let fields = {
      name: '',
      email: '',
      phone: '',
    };
    if (isEmpty(companyName)) {
      result = false;
      fields.name = 'Must not be empty.';
    }

    if (isEmpty(email)) {
      result = false;
      fields.email = 'Must not be empty.';
    }

    if (!isEmail(email)) {
      result = false;
      fields.email = 'Must not be a valid email.';
    }

    if (isEmpty(phone)) {
      result = false;
      fields.email = 'Must not be empty.';
    }

    setErrors({
      valid: result,
      fields: fields,
    });

    if (!result) {
      return;
    }
  };

  return (
    <Paper
      sx={{
        width: { xs: '80%', s: 300, md: 500 },
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <Box
        sx={{
          paddingY: 5,
          width: '80%',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <img src={logo} width={100} />
          <h2>Create a Company!</h2>
        </Box>

        <Box>
          <TextField
            sx={{ width: '100%' }}
            variant="outlined"
            type="text"
            label="Company Name"
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <TextField
            sx={{ width: '100%' }}
            variant="outlined"
            type="email"
            label="Contact Email"
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <TextField
            sx={{ width: '100%' }}
            variant="outlined"
            type="phone"
            label="Contact Phone"
          />
        </Box>
        {/* <Box>
					<h3>Address</h3>
				</Box>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
					<TextField variant="outlined" type="text" label="Street" />
					<TextField variant="outlined" type="text" label="City" />
				</Box>
				<Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2, mt: 2 }}>
					<TextField variant="outlined" type="text" label="Province" />
					<TextField variant="outlined" type="text" label="Postal Code" />
				</Box> */}
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Fab color="primary" aria-label="add">
            <AddIcon fontSize="large" />
          </Fab>
        </Box>
      </Box>
    </Paper>
  );
};

export default CreateCompanyForm;
