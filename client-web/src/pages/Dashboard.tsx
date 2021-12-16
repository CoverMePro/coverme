import React, { useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTypedSelector } from 'hooks/use-typed-selector';
import axios from 'utils/axios-intance';
import { AxiosError } from 'axios';
import { SnackbarContext } from 'context/snackbar-context';

const Dashboard: React.FC = () => {
  const user = useTypedSelector((state) => state.user);

  const navigate = useNavigate();
  const { openSnackbar } = useContext(SnackbarContext);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_SERVER_API}/company`, {
        withCredentials: true,
      })
      .then((result) => {
        console.log(result);
      })
      .catch((err: AxiosError) => {});
    openSnackbar('Test message that is longer lets see what happens', 'error');
  }, []);

  console.log(user);
  return <div>DASHBOARD</div>;
};

export default Dashboard;
