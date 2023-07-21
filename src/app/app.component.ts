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
    this.getSms()
    // this.errorMessage = 'in ngAfterViewInit';
    // console.log('step 1');
    // if ('OTPCredential' in window) {

    //   this.mainObj.isWebOtpSupported = true;
    //   this.errorMessage = 'in otp window';
    //   window.addEventListener('DOMContentLoaded', (e) => {
    //     this.errorMessage = 'in otp DOMContentLoaded';
    //     console.log('step 2 inside the dom otp');
    //     debugger
    //     const input = document.querySelector(
    //       'input[autocomplete="one-time-code"]'
    //     );
    //     alert("above the return");
    //     // if (!input) return;
    //     const ac = new AbortController();
    //     debugger
    //     console.log('step 3 inside the controler');
    //     var reqObj = {
    //       otp: { transport: ['sms']}, // Replace the regex with your desired format
    //       signal: ac.signal,
    //     };
    //     console.log('req obj',reqObj);
    //     debugger
    //     navigator.credentials
    //       .get(reqObj)
    //       .then((otp: any) => {
    //         console.log('step 4 inside get message');
    //         if (otp) {
    //           console.log('step 5 inside the got otp');
    //           alert('in OTP window***' + otp);
    //           this.errorMessage = 'in otp credentials';
    //           const otpRegex = /OTP for Aadhaar is ([0-9]{6})/; // Replace the regex with your desired format
    //           const match = otpRegex.exec(otp.toString());
    //           alert('GOT OTP***' + otp);
    //           alert('Got match'+ match)
    //           if (match && match[1]) {
    //             const extractedOTP = match[1];
    //             // Do something with the extractedOTP, e.g., assign it to an input field
    //             (document.getElementById("otpInputId") as HTMLInputElement).value = extractedOTP;
    //             this.myOTP = extractedOTP;
    //             // Trigger the OTP submission, if needed
    //             (document?.getElementById("otpButtonId") as any)?.click();
    //             alert('GOT OTP***' + otp.code);
    //           } else {
    //             // Handle the case when OTP format doesn't match
    //             this.errorMessage = 'OTP format not recognized.';
    //           }
    //         }
    //       })
    //       // .then((otp: any) => {
    //       //   this.errorMessage = 'in otp credentials';
    //       //   alert('GOT OTP***' + otp);
    //       //   if (otp) {
    //       //     if (otp && otp.code) {
    //       //       alert('GOT OTP***' + otp.code);
    //       //       this.myOTP = otp.code;
    //       //     }
    //       //   }
    //       // })
    //       .catch((err) => {
    //         this.errorMessage = 'in otp error';
    //         console.log(err);
    //       })
    //   });
    // } else {
    //   this.mainObj.isWebOtpSupported = false;
    //   this.errorMessage = 'out of otp window';
    // }
  }

  getSms() {
    if ('serviceWorker' in navigator && 'MessageChannel' in window) {
      navigator.serviceWorker
        .getRegistration()
        .then(registration => {
          if (registration) {
            const channel = new MessageChannel();
            channel.port1.onmessage = event => {
              const otp = event.data; // Assuming the OTP is received as a plain text message
              const otpElement = document.getElementById('otp') as HTMLInputElement;
              if (otpElement) {
                otpElement.value = otp;
              }
            };
            registration.active?.postMessage('getSms', [channel.port2]);
          } else {
            console.warn('Service worker registration not found.');
          }
        })
        .catch(error => {
          console.error('Error accessing service worker:', error);
        });
    } else {
      console.warn('Service workers or MessageChannel are not supported in this browser.');
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
