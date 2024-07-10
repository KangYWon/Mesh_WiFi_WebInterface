import { Link } from 'react-router-dom';

// material-ui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// project import
import AuthWrapper from './AuthWrapper';
//import AuthLogin from './auth-forms/AuthLogin';
import DeviceRegistrationForm from '../device/DeviceRegistrationForm'; // 장치 등록 폼을 불러옴


// ================================|| DEVICE REGISTRATION ||================================ //

export default function Device() {
  return (
    <AuthWrapper>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: { xs: -0.5, sm: 0.5 } }}>
            <Typography variant="h3">Device Registration</Typography>
            <Typography component={Link} to="/dashboard/default" variant="body1" sx={{ textDecoration: 'none' }} color="primary">
              Go to Dashboard
            </Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <DeviceRegistrationForm /> {/* 장치 등록 폼 컴포넌트 사용 */}
        </Grid>
      </Grid>
    </AuthWrapper>
  );
}
