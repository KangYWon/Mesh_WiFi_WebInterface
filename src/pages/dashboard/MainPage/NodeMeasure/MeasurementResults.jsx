import React from 'react';
import Box from '@mui/material/Box';
import LatencyChartPage from 'src/pages/dashboard/MainPage/NodeMeasure/latencyChartPage.jsx';
import ThroughputChartPage from 'src/pages/dashboard/MainPage/NodeMeasure/throughputChartPage.jsx';
import { clearButtonStyles } from 'src/components/styles.js';

const MeasurementResults = ({ measurementResult, currentMeasurementType, source, destination, resultPage, onClearResults }) => {
  return (
    <Box sx={{ marginTop: 2, padding: 2, border: '1px solid gray' }}>
      <h3>[ Result ] </h3>
      <p>
        Source Node [{source}] ➔ Destination Node [{destination}]
      </p>
      {currentMeasurementType === 'Latency' ? (
        <LatencyChartPage latencyData={measurementResult.value} />
      ) : (
        <ThroughputChartPage throughputData={measurementResult} />
      )}

      {measurementResult && (
        <Button
          variant="outlined"
          sx={clearButtonStyles}
          onClick={onClearResults}
        >
          {resultPage ? 'Stop Measurement' : 'Clear Results'}
        </Button>
      )}
    </Box>
  );
};

export default MeasurementResults;