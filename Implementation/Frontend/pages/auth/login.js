// ===============================
// ReserveCenter Authentication
// Login + Role Selection + JWT
// ===============================

const API_BASE_URL = "http://localhost:5041/api";

let currentUserId = null;
let selectedRoleBackendName = "";
let selectedOrgId = null;


// ===============================
// Role Mapping
// مطابق با Backend Roles.cs
// ===============================

const roleMapping = {
    Customer: {
        label: "مشتری"
    },

    Staff: {
        label: "کارمند کسب‌وکار"
    },

    Support: {
        label: "پشتیبان"
    },

    OrgAdmin: {
        label: "مدیر کسب‌وکار"
    },

    SuperAdmin: {
        label: "مدیر ارشد سیستم"
    }
};


// ===============================
// UI Helpers
// ===============================

function showMsg(id, message, type) {

    const element = document.getElementById(id);

    if (!element)
        return;

    element.textContent = message;
    element.className = "status-msg " + type;
}


function setButtonLoading(button, loading) {

    if (!button)
        return;

    if (loading) {

        button.classList.add("loading");
        button.disabled = true;

    } else {

        button.classList.remove("loading");
        button.disabled = false;
    }
}


function validatePhone(phone) {

    return /^9[0-9]{9}$/.test(phone);
}



function togglePass(id, element) {

    const input = document.getElementById(id);

    if (input.type === "password") {

        input.type = "text";
        element.textContent = "🙈";

    } else {

        input.type = "password";
        element.textContent = "👁";
    }
}



// ===============================
// Tabs
// ===============================

function switchTab(type) {


    document.querySelectorAll(".tab-btn")
        .forEach(btn => btn.classList.remove("active"));


    document.querySelectorAll(".form-panel")
        .forEach(panel => panel.classList.remove("active"));



    if (type === "password") {

        document.querySelectorAll(".tab-btn")[0]
            .classList.add("active");

        document.getElementById("panel-password")
            .classList.add("active");

    } else {

        document.querySelectorAll(".tab-btn")[1]
            .classList.add("active");

        document.getElementById("panel-otp")
            .classList.add("active");
    }
}



// ===============================
// Login With Password
// POST /api/Auth/login
// ===============================


async function submitPassword() {


    const phone =
        document.getElementById("pw-phone")
        .value
        .trim();


    const password =
        document.getElementById("pw-password")
        .value
        .trim();



    const button =
        document.querySelector("#panel-password .btn-primary");



    if (!validatePhone(phone)) {

        showMsg(
            "pw-phone-msg",
            "شماره تلفن معتبر نیست",
            "error"
        );

        return;
    }



    if (!password) {

        showMsg(
            "pw-pass-msg",
            "رمز عبور را وارد کنید",
            "error"
        );

        return;
    }



    setButtonLoading(button, true);



    try {


        const response = await fetch(
            `${API_BASE_URL}/Auth/login`,
            {

                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },


                body: JSON.stringify({

                    phoneNumber:
                        "0" + phone,

                    password:
                        password,

                    rememberMe:
                        false
                })
            }
        );



        const data = await response.json();



        if (!response.ok) {

            throw new Error(
                data.message ||
                "ورود ناموفق بود"
            );
        }



        // LoginResponse
        currentUserId = data.userId;



        if (!currentUserId) {

            throw new Error(
                "شناسه کاربر دریافت نشد"
            );
        }



        openRoleModal(data.roles);



    }

    catch(error) {


        showMsg(
            "pw-pass-msg",
            error.message,
            "error"
        );

    }

    finally {

        setButtonLoading(button,false);
    }

}




// ===============================
// Role Modal
// ===============================


function openRoleModal(roles) {


    selectedRoleBackendName = "";
    selectedOrgId = null;


    const modal =
        document.getElementById("role-modal");


    modal.style.display = "flex";



    const cards =
        document.querySelectorAll(".role-card");



    cards.forEach(card => {


        card.classList.remove("selected");

        card.style.opacity = "0.3";

        card.style.pointerEvents = "none";

    });



    roles.forEach(role => {


        const backendName =
            role.roleName;



        cards.forEach(card => {


            const label =
                card.querySelector(".role-label")
                .textContent
                .trim();



            if (
                roleMapping[backendName] &&
                roleMapping[backendName].label === label
            ) {


                card.style.opacity = "1";

                card.style.pointerEvents = "auto";


                card.dataset.backendName =
                    backendName;



                if(role.orgId)
                {
                    card.dataset.orgId =
                        role.orgId;
                }
            }

        });


    });


}




function selectRole(element) {


    document
    .querySelectorAll(".role-card")
    .forEach(card =>
        card.classList.remove("selected")
    );



    element.classList.add("selected");



    selectedRoleBackendName =
        element.dataset.backendName;



    selectedOrgId =
        element.dataset.orgId
        ?
        Number(element.dataset.orgId)
        :
        null;



    document
    .getElementById("modal-confirm-btn")
    .disabled = false;

}





// ===============================
// POST /api/Auth/select-role
// دریافت JWT
// ===============================


async function confirmRole() {


    const button =
        document.getElementById(
            "modal-confirm-btn"
        );



    if(!selectedRoleBackendName)
        return;



    setButtonLoading(button,true);



    try {


        const response =
        await fetch(
            `${API_BASE_URL}/Auth/select-role`,
            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },


                body:JSON.stringify({

                    userId:
                        currentUserId,

                    roleName:
                        selectedRoleBackendName,

                    orgId:
                        selectedOrgId
                })

            });



        const data =
            await response.json();



        if(!response.ok)
        {
            throw new Error(
                data.message ||
                "خطا در انتخاب نقش"
            );
        }



        if(data.token)
        {

            localStorage.setItem(
                "token",
                data.token
            );


            // localStorage.setItem(
            //     "user",
            //     JSON.stringify(data.user)
            // );


            alert(
                "ورود موفق بود. JWT دریافت شد."
            );

            window.location.href =
            "/index.html";

        }


    }

    catch(error)
    {

        alert(error.message);

    }

    finally
    {

        setButtonLoading(button,false);

    }

}




// ===============================
// OTP بخش فعلاً دست‌نخورده
// چون Backend فعلی برای Reset Password است
// ===============================


function sendOtp(){

    alert(
        "OTP در مرحله بعد بررسی می‌شود."
    );
}


function verifyOtp(){

    alert(
        "OTP در مرحله بعد بررسی می‌شود."
    );
}



// ===============================
// OTP Boxes
// ===============================

document
.querySelectorAll(".otp-boxes input")
.forEach(
(input,index,inputs)=>{


    input.addEventListener(
        "input",
        ()=>{


            if(
                input.value.length===1 &&
                index < inputs.length-1
            )
            {
                inputs[index+1].focus();
            }

        }
    );

});