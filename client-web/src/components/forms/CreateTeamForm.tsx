import React, { useState, useEffect } from 'react';
import { useTypedSelector } from 'hooks/use-typed-selector';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';

import {
  Box,
  TextField,
  Fab,
  Checkbox,
  Autocomplete,
  CircularProgress,
  Typography,
} from '@mui/material';

import HowToRegIcon from '@mui/icons-material/Add';
import logo from 'images/cover-me-logo.png';
import axios from 'utils/axios-intance';
import { validateUserCreate } from 'utils/validation';

import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import { IUserInfo } from 'models/User';

interface ICreateFormProps {
  onFinish: () => void;
}

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

const CreateTeamForm: React.FC<ICreateFormProps> = ({ onFinish }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [managers, setManagers] = useState<IUserInfo[]>([]);
  const [staff, setStaff] = useState<IUserInfo[]>([]);
  const [selectedManagers, setSelectedManagers] = useState<string[]>([]);
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);

  const user = useTypedSelector((state) => state.user);

  const { enqueueSnackbar } = useSnackbar();

  const { handleSubmit, handleChange, handleBlur, touched, errors } = useFormik(
    {
      initialValues: {
        teamName: '',
      },
      validate: validateUserCreate,
      onSubmit: (values: any) => {
        // setIsLoading(true);
        // axios
        //   .post(`${process.env.REACT_APP_SERVER_API}/auth/register-link`, {
        //     name: values.teamName,
        //     managers: selectedManagers,
        //     staff: selectedStaff,
        //   })
        //   .then((result) => {
        //     setIsLoading(false);
        //     enqueueSnackbar('Team created.', {
        //       variant: 'success',
        //     });
        //     onFinish();
        //   })
        //   .catch((err) => {
        //     setIsLoading(false);
        //     enqueueSnackbar('An error has occured, please try again', {
        //       variant: 'error',
        //     });
        //     console.log(err);
        //     onFinish();
        //   });
      },
    }
  );

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_API}/user/all/${user.company!}`)
      .then((result) => {
        const users: IUserInfo[] = result.data.users;
        const retrievedManagers = users.filter(
          (user) => user.role === 'manager'
        );
        const retreivedStaff = users.filter((user) => user.role === 'staff');

        setManagers(retrievedManagers);
        setStaff(retreivedStaff);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <Box
      sx={{
        width: { xs: '80%', s: 300, md: 500 },
        borderRadius: 5,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          paddingY: 5,
          width: '80%',
        }}
      >
        <img src={logo} width={100} alt="Cover Me Logo" />
        <Typography sx={{ mb: 2 }} variant="h2">
          Create a Team!
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box>
            <TextField
              sx={{ width: '100%' }}
              variant="outlined"
              type="text"
              name="teamName"
              label="Team Name"
              onChange={handleChange}
              onBlur={handleBlur}
              error={
                touched.teamName &&
                errors.teamName !== undefined &&
                errors.teamName !== ''
              }
              helperText={touched.teamName ? errors.teamName : ''}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Autocomplete
              multiple
              options={managers}
              disableCloseOnSelect
              getOptionLabel={(option) =>
                `${option.firstName} ${option.lastName}`
              }
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.firstName} {option.lastName}
                </li>
              )}
              renderInput={(params) => (
                <TextField {...params} label="Managers" />
              )}
              onChange={(e) => console.log(e)}
            />
          </Box>
          <Box sx={{ mt: 2 }}>
            <Autocomplete
              multiple
              options={staff}
              disableCloseOnSelect
              getOptionLabel={(option) =>
                `${option.firstName} ${option.lastName}`
              }
              renderOption={(props, option, { selected }) => (
                <li {...props}>
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 8 }}
                    checked={selected}
                  />
                  {option.firstName} {option.lastName}
                </li>
              )}
              renderInput={(params) => <TextField {...params} label="Staff" />}
              onChange={(e) => console.log(e)}
            />
          </Box>

          <Box sx={{ mt: 3 }}>
            {isLoading ? (
              <CircularProgress />
            ) : (
              <Fab color="primary" aria-label="Register User" type="submit">
                <HowToRegIcon fontSize="large" />
              </Fab>
            )}
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default CreateTeamForm;
