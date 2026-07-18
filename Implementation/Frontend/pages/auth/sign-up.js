const API_BASE_URL = "http://localhost:5041/api";


// نمایش خطا
function showError(inputId, errorId, message) {

    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    if (input && error) {

        input.classList.add("error");
        input.classList.remove("success");

        error.textContent = message;
        error.classList.add("show");
    }
}


// نمایش موفقیت
function showSuccess(inputId, errorId) {

    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    if (input && error) {

        input.classList.remove("error");
        input.classList.add("success");

        error.classList.remove("show");
    }
}


// نمایش / مخفی کردن رمز
function togglePasswordVisibility(inputId, icon) {

    const input = document.getElementById(inputId);

    if (input.type === "password") {

        input.type = "text";
        icon.textContent = "🙈";

    } else {

        input.type = "password";
        icon.textContent = "👁";

    }
}


// اعتبارسنجی نام
function validateFirstName() {

    const value =
        document.getElementById("firstName").value.trim();


    if (value.length < 2) {

        showError(
            "firstName",
            "firstName-error",
            "نام باید حداقل ۲ کاراکتر باشد"
        );

        return false;
    }


    showSuccess(
        "firstName",
        "firstName-error"
    );

    return true;
}


// اعتبارسنجی نام خانوادگی
function validateLastName() {

    const value =
        document.getElementById("lastName").value.trim();


    if (value.length < 2) {

        showError(
            "lastName",
            "lastName-error",
            "نام خانوادگی باید حداقل ۲ کاراکتر باشد"
        );

        return false;
    }


    showSuccess(
        "lastName",
        "lastName-error"
    );

    return true;
}


// اعتبارسنجی شماره تلفن
function validatePhone() {

    const phone =
        document.getElementById("phone-number").value.trim();


    const pattern = /^09[0-9]{9}$/;


    if (!pattern.test(phone)) {

        showError(
            "phone-number",
            "phone-number-error",
            "شماره تلفن معتبر نیست"
        );

        return false;
    }


    showSuccess(
        "phone-number",
        "phone-number-error"
    );

    return true;
}





// اعتبارسنجی رمز
function validatePassword() {

    const password =
        document.getElementById("password").value;


    if (password.length < 6) {

        showError(
            "password",
            "password-error",
            "رمز عبور باید حداقل ۶ کاراکتر باشد"
        );

        return false;
    }


    showSuccess(
        "password",
        "password-error"
    );

    return true;
}


// تطبیق رمز
function validateConfirmPassword() {

    const password =
        document.getElementById("password").value;


    const confirm =
        document.getElementById("confirm-password").value;


    if (password !== confirm) {

        showError(
            "confirm-password",
            "confirm-error",
            "رمز عبورها یکسان نیستند"
        );

        return false;
    }


    showSuccess(
        "confirm-password",
        "confirm-error"
    );

    return true;
}


// ارسال ثبت نام به بک اند
async function registerUser() {


    const button =
        document.querySelector(".btn-primary");


    button.disabled = true;
    button.textContent = "در حال ثبت‌نام...";


    const requestData = {

        firstName:
            document.getElementById("firstName").value.trim(),

        lastName:
            document.getElementById("lastName").value.trim(),

        phoneNumber:
            document.getElementById("phone-number").value.trim(),

      

        password:
            document.getElementById("password").value,

        role:
            "Customer"
    };


    try {

        const response =
            await fetch(
                `${API_BASE_URL}/Auth/register`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body:
                        JSON.stringify(requestData)
                }
            );


        const result =
            await response.json();

        // مدیریت خطا - طبق استاندارد پروژه
        if (response.status === 400) {
            alert(result.message || "درخواست نامعتبر است");
            return;
        }

        if (response.status === 403) {
            window.location.href = "/pages/errors/error-403.html";
            return;
        }

        if (!response.ok) {

            throw new Error(
                result.message || "خطا در ثبت نام"
            );
        }


        alert(
            "ثبت‌نام با موفقیت انجام شد"
        );


        window.location.href =
            "login.html";


    } catch (error) {

        console.error(error);

        alert(
            error.message ||
            "ارتباط با سرور برقرار نشد"
        );


    } finally {

        button.disabled = false;
        button.textContent = "ثبت‌نام";
    }
}



// شروع صفحه
document.addEventListener(
    "DOMContentLoaded",
    function () {


        const form =
            document.getElementById("registerForm");


        form.addEventListener(
            "submit",
            function (event) {


                event.preventDefault();


                const valid =

                    validateFirstName() &&
                    validateLastName() &&
                    validatePhone() &&
                    
                    validatePassword() &&
                    validateConfirmPassword();



                if (!valid) {

                    alert(
                        "لطفاً اطلاعات را درست وارد کنید"
                    );

                    return;
                }


                registerUser();

            }
        );

    }
);