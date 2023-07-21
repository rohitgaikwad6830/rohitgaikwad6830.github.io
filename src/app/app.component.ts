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
console.log('step 1');
if ('OTPCredential' in window) {
  this.mainObj.isWebOtpSupported = true;
  this.errorMessage = 'in otp window';
  window.addEventListener('DOMContentLoaded', (e) => {
    this.errorMessage = 'in otp DOMContentLoaded';
    console.log('step 2 inside the dom otp');
    const input = document.querySelector(
      'input[autocomplete="one-time-code"]'
    );
    // if (!input) return;
    const ac = new AbortController();
    console.log('step 3 inside the controler');
    var reqObj = {
      otp: { transport: ['sms'] }, // Replace the regex with your desired format
      signal: ac.signal,
    };
    console.log('req obj', reqObj);
    navigator.credentials
      .get(reqObj)
      .then((otp: any) => {
        console.log('step 4 inside get message');
        if (otp) {
          console.log('step 5 inside the got otp');
          alert('in OTP window***' + otp);
          this.errorMessage = 'in otp credentials';
          const aadhaarOtpRegex = /OTP for Aadhaar \(([A-Za-z0-9]+)\) is (\d+) \(valid for (\d+) mins\)/;
          const taxBuddyOtpRegex = /#(\d+)/;
          const aadhaarMatch = aadhaarOtpRegex.exec(otp.toString());
          const taxBuddyMatch = taxBuddyOtpRegex.exec(otp.toString());

          if (aadhaarMatch && aadhaarMatch[2]) {
            const extractedOTP = aadhaarMatch[2];
            // Do something with the extractedOTP for Aadhaar
            // For example, you can set it to an input field or process it accordingly.
            alert('GOT Aadhaar OTP***' + extractedOTP);
          } else if (taxBuddyMatch && taxBuddyMatch[1]) {
            const extractedOTP = taxBuddyMatch[1];
            // Do something with the extractedOTP for TaxBuddy
            // For example, you can set it to an input field or process it accordingly.
            alert('GOT TaxBuddy OTP***' + extractedOTP);
          } else {
            // Handle the case when OTP format doesn't match for both providers
            this.errorMessage = 'OTP format not recognized.';
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
