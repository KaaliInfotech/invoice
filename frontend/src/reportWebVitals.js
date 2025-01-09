const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
// src/reportWebVitals.js
// import { reportWebVitals } from 'web-vitals';

// const reportWebVitalsToAnalytics = (metric) => {
//   console.log(metric);
// };

// reportWebVitals(reportWebVitalsToAnalytics);
