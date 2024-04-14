import http from 'k6/http';
import { check, sleep, group } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

//CONNECTION TEST

export let options = {
  vus: 10, //Intentos de Conexión por Segundo
  duration: '30s', //Duración Total de la Prueba
  //300 Intentos de Conexión en Total
};

export default function () {
  let url = 'https://api.coronavirus.data.gov.uk/v1/data';
  
  // Parametros
  let params = {
    filters: 'areaType=nation;areaName=england',
    structure: '{"date":"date","newCases":"newCasesByPublishDate","cumulativeCases":"cumCasesByPublishDate"}'
  };
  
  // Función GET
  let res = http.get(url, params);
  
  // Check
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time is less than 200ms': (r) => r.timings.duration < 200
  });
  
  // Sleep entre cada Intento de Conexión
  sleep(1);
}
