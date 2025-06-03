import { Injectable } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/utils';
import {AnalyticsService} from '../../services/analytics.service'
import { analytics } from 'src/app/models/analytics';
import { finalize } from 'rxjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export interface IChartProps {
  data?: any;
  labels?: any;
  options?: any;
  colors?: any;
  type?: any;
  legend?: any;

  [propName: string]: any;
}

@Injectable({
  providedIn: 'any'
})
export class DashboardChartsData {
  analyticsData?: any;

  constructor(private analyticsService: AnalyticsService) {
   this.initMainChart();
  }

  getAllAnalytics(): void {
    this.analyticsService.getAnalyticsData().pipe(
      finalize(() => {
        if (this.analyticsData) {
          this.initMainChart();
        }
      })
    ).subscribe(data => {
      this.analyticsData = data.analytics;
      console.log("got");
      console.log(this.analyticsData);
      
    });
  }
  

  public mainChart: IChartProps = {};

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  // initMainChart(period: string = 'Month') {
    initMainChart() {
      this.mainChart['elements'] = [];
    const brandSuccess = getStyle('--cui-success') ?? '#4dbd74';
    const brandInfo = getStyle('--cui-info') ?? '#20a8d8';
    const brandInfoBg = hexToRgba(brandInfo, 10);
    const brandDanger = getStyle('--cui-danger') || '#f86c6b';

    // mainChart
    // mainChart
    // this.mainChart['elements'] = period === 'Month' ? 12 : 60;
    if(this.analyticsData){
      console.log("dates");
      console.log(this.analyticsData.dates)
      this.mainChart['elements'] = [...this.analyticsData.dates];
      
    }
   
    this.mainChart['Data1'] = [];
    this.mainChart['Data2'] = [];
    this.mainChart['Data3'] = [];

    // generate random values for mainChart

    for (let i = 0; i < this.mainChart['elements'].length; i++) {
      if (this.analyticsData) {
        this.mainChart['Data1'].push(this.analyticsData.NbEngagesQuiz[i]);
        this.mainChart['Data2'].push(this.analyticsData.NbUsersAR[i]);
        this.mainChart['Data3'].push(this.analyticsData.NbUsersReminder[i]);
        console.log( this.mainChart['Data1']);
      }
    }

    let labels: string[] = [];
 

    // if (period === 'Month') {
      if(this.analyticsData)

      labels = labels.concat(this.analyticsData.dates);
      labels.sort
    
      
    

    const colors = [
      {
        // brandInfo
        backgroundColor: brandInfoBg,
        borderColor: brandInfo,
        pointHoverBackgroundColor: brandInfo,
        borderWidth: 2,
        fill: true
      },
      {
        // brandSuccess
        backgroundColor: 'transparent',
        borderColor: brandSuccess || '#4dbd74',
        pointHoverBackgroundColor: '#fff'
      },
      {
        // brandDanger
        backgroundColor: 'transparent',
        borderColor: brandDanger || '#f86c6b',
        pointHoverBackgroundColor: brandDanger,
        borderWidth: 1,
        borderDash: [8, 5]
      }
    ];

    const datasets = [
      {
        data: this.mainChart['Data1'],
        label: 'Current',
        ...colors[0]
      },
      {
        data: this.mainChart['Data2'],
        label: 'Previous',
        ...colors[1]
      },
      {
        data: this.mainChart['Data3'],
        label: 'BEP',
        ...colors[2]
      }
    ];

    const plugins = {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          labelColor: function(context: any) {
            return {
              backgroundColor: context.dataset.borderColor
            };
          }
        }
      }
    };

    const options = {
      maintainAspectRatio: false,
      plugins,
      scales: {
        x: {
          grid: {
            drawOnChartArea: false
          }
        },
        y: {
          beginAtZero: true,
          max: 20,
          ticks: {
            maxTicksLimit: 5,
            stepSize: Math.ceil(20 / 5)
          }
        }
      },
      elements: {
        line: {
          tension: 0.4
        },
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
          hoverBorderWidth: 3
        }
      }
    };

    this.mainChart.type = 'line';
    this.mainChart.options = options;
    this.mainChart.data = {
      datasets,
      labels
    };
    // if(this.analyticsData)
    // this.mainChart.labels = this.analyticsData.dates
  }





}
