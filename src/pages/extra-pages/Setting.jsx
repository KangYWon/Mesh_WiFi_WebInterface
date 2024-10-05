// material-ui
import Typography from '@mui/material/Typography';
import Footer from 'src/pages/extra-pages/footer.jsx';

// project import
import MainCard from 'components/MainCard';

// ==============================|| SAMPLE PAGE ||============================== //

export default function SamplePage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <MainCard title="Setting">
      <Typography variant="body2">
        Setting Page
      </Typography>
    </MainCard>
    <Footer />
    </div>
  );
}
