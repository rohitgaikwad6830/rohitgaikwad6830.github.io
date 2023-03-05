import { AfterViewInit, Component, OnInit } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'ng-otp-auto-read';
  constructor(private readonly updates: SwUpdate) {
    if (this.updates.isEnabled) {
      this.updates.available.subscribe((event) => {
        alert('New update available, please reload window to continue');
        window.location.reload();
      });
    }
  }

  ngOnInit() {
    this.errorMessage = 'in ngAfterViewInit';
    if ('OTPCredential' in window) {
      this.mainObj.isWebOtpSupported = true;
      this.errorMessage = 'in otp window';
      window.addEventListener('DOMContentLoaded', (e) => {
        this.errorMessage = 'in otp DOMContentLoaded';
        const input = document.querySelector(
          'input[autocomplete="one-time-code"]'
        );
        if (!input) return;
        const ac = new AbortController();
        var reqObj = {
          otp: { transport: ['sms'] },
          signal: ac.signal,
        };
        navigator.credentials
          .get(reqObj)
          .then((otp: any) => {
            this.errorMessage = 'in otp credentials';
            alert('GOT OTP***' + otp);
            if (otp) {
              if (otp && otp.code) {
                alert('GOT OTP***' + otp.code);
                this.myOTP = otp.code;
              }
            }
          })
          .catch((err) => {
            this.errorMessage = 'in otp error';
            console.log(err);
          })
      });
    } else {
      this.mainObj.isWebOtpSupported = false;
      this.errorMessage = 'out of otp window';
    }
  }
  errorMessage: any = '';
  
  myOTP: any;
  myOTP2:any;
  mainObj: any = {};

  code = `
  errorMessage: any = '';
  ngAfterViewInit() {
    this.errorMessage = 'in ngAfterViewInit';
    if ('OTPCredential' in window) {
      this.mainObj.isWebOtpSupported = true;
      this.errorMessage = 'in otp window';
      window.addEventListener('DOMContentLoaded', (e) => {
        this.errorMessage = 'in otp DOMContentLoaded';
        const input = document.querySelector(
          'input[autocomplete="one-time-code"]'
        );
        if (!input) return;
        const ac = new AbortController();
        var reqObj = {
          otp: { transport: ['sms'] },
          signal: ac.signal,
        };
        navigator.credentials
          .get(reqObj)
          .then((otp: any) => {
            this.errorMessage = 'in otp credentials';
            alert('GOT OTP***' + otp);
            if (otp) {
              if (otp && otp.code) {
                alert('GOT OTP***' + otp.code);
                this.myOTP = otp.code;
              }
            }
          })
          .catch((err) => {
            this.errorMessage = 'in otp error';
            console.log(err);
          }).finally(() => {
            this.errorMessage = 'in otp finally';
          })
      });
    } else {
      this.mainObj.isWebOtpSupported = false;
      this.errorMessage = 'out of otp window';
    }
  }
  `
}