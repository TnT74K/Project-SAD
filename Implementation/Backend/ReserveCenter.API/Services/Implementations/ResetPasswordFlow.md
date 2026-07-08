>```
>ForgotPassword
>   │
>   ▼
>User exists?
>   │
>   ├── No → false
>   ▼
>Pretend OTP = 123456
>   │
>   ▼
>Return true
>
>────────────
>
>VerifyOtp
>   │
>   ▼
>OTP == 123456 ?
>   │
>   ├── No → Invalid
>   ▼
>Return "RESET_TOKEN"
>
>────────────
>
>ResetPassword
>   │
>   ▼
>Token == "RESET_TOKEN" ?
>   │
>   ├── No → Invalid
>   ▼
>Update password
>```
>
>