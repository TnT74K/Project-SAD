 function togglePasswordVisibility(inputId, icon) {
     const input = document.getElementById(inputId);

        if (input.type === 'password') {
                input.type = 'text';
                icon.textContent = '🙈';
            } 
            else {
                input.type = 'password';
                icon.textContent = '👁';
            }
 }
 // چک کردن تطابق رمز عبور جدید با تکرار آن
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const newPassword = document.getElementById('new_password');
    const confirmPassword = document.getElementById('confirm_new_password');
    
    function checkPasswordsMatch() {
        if (newPassword.value !== confirmPassword.value) {
            confirmPassword.setCustomValidity('رمز عبور با تکرار آن مطابقت ندارد');
            return false;
        } else {
            confirmPassword.setCustomValidity('');
            return true;
        }
    }
    
    // هنگام تایپ در فیلد تکرار رمز
    confirmPassword.addEventListener('input', checkPasswordsMatch);
    
    // هنگام تایپ در فیلد رمز اصلی
    newPassword.addEventListener('input', function() {
        if (confirmPassword.value) {
            checkPasswordsMatch();
        }
    });
    
    // هنگام ارسال فرم
    form.addEventListener('submit', function(event) {
        if (!checkPasswordsMatch()) {
            event.preventDefault();
            alert('رمز عبور با تکرار آن مطابقت ندارد');
        }
    });
});
