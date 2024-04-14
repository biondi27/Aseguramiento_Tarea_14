import http from 'k6/http';
import { check, sleep } from 'k6';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.1/index.js";

//STRESS TEST

export let options = {
  stages: [
    { duration: '2m', target: 100 }, // Conectar 100 usuarios en 2 minuto
    { duration: '3m', target: 100 }, // Mantenerlos en 100 por 5 minutos
    { duration: '2m', target: 0 },   // Llevarlos a 0 a lo largo de 1 minuto
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests must complete below 500ms
    'http_req_duration{error:false}': ['p(99)<1000'], // 99% of successful requests must complete below 1000ms
  },
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
    });
    
    // Sleep por una duración aleatoria para simular usuarios reales
    sleep(Math.random() * 2 + 1);
  }
