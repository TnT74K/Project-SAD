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
        label: "مشتری",
        icon: "🧑"
    },

    Staff: {
        label: "کارمند کسب‌وکار",
        icon: "💼"
    },

    Support: {
        label: "پشتیبان",
        icon: "🎧"
    },

    OrgAdmin: {
        label: "مدیر کسب‌وکار",
        icon: "🏪"
    },

    SuperAdmin: {
        label: "مدیر ارشد سیستم",
        icon: "🛡️"
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

    const modal = document.getElementById("role-modal");
    const roleGrid = document.getElementById("role-grid");
    const confirmButton = document.getElementById("modal-confirm-btn");
    const messageElement = document.getElementById("role-modal-msg");

    // پاک‌کردن کارت‌های ساخته‌شده در ورود قبلی
    roleGrid.replaceChildren();

    confirmButton.disabled = true;
    messageElement.textContent = "";
    messageElement.className = "status-msg";

if (!Array.isArray(roles) || roles.length === 0) {
        showMessage("هیچ نقشی برای این کاربر یافت نشد.", "error");
        return;
    }

    // اگر فقط یک نقش Customer داشت، مستقیم انتخاب شود
    if (roles.length === 1 && String(roles[0].RoleName || roles[0].roleName).toLowerCase() === "customer") {
        const role = roles[0];

        selectedRoleBackendName = role.RoleName || role.roleName;
        selectedOrgId = role.OrgId ?? role.orgId ?? null;

        // اگر لازم داری نام نمایشی هم ست شود
        selectedRoleLabel = role.roleLabel || role.displayName || "مشتری";

        confirmRole();
        return;
    }

    // ادامه رفتار فعلی: ساخت کارت‌ها و نمایش مودال
    roleGrid.innerHTML = "";

    roles.forEach((role, index) => {
        const card = createRoleCard(role, index);
        roleGrid.appendChild(card);
    });

    modal.style.display = "flex";
}


function createRoleCard(role, index) {
    const backendRoleName = role.roleName;
    const roleInfo = roleMapping[backendRoleName];

    const roleLabel = roleInfo?.label ?? backendRoleName;
    const roleIcon = roleInfo?.icon ?? "👤";

    const organizationName =
        role.organizationName?.trim() ||
        getDefaultOrganizationLabel(role.orgId);

    const card = document.createElement("button");

    card.type = "button";
    card.className = "role-card";
    card.dataset.backendName = backendRoleName;
    card.dataset.index = String(index);

    // orgId ممکن است null باشد؛ مقدار null را داخل dataset نریز
    if (role.orgId !== null && role.orgId !== undefined) {
        card.dataset.orgId = String(role.orgId);
    }

    const check = document.createElement("div");
    check.className = "role-check";
    check.textContent = "✓";

    const icon = document.createElement("span");
    icon.className = "role-icon";
    icon.textContent = roleIcon;

    const content = document.createElement("div");
    content.className = "role-content";

    const label = document.createElement("span");
    label.className = "role-label";
    label.textContent = roleLabel;

    const organization = document.createElement("span");
    organization.className = "role-organization";
    organization.textContent = organizationName;

    content.append(label, organization);
    card.append(check, icon, content);

    card.addEventListener("click", function () {
        selectRole(this);
    });

    return card;
}


function getDefaultOrganizationLabel(orgId) {
    if (orgId === null || orgId === undefined) {
        return "بدون سازمان";
    }

    return `سازمان شماره ${orgId}`;
}


function selectRole(element) {
    document
        .querySelectorAll("#role-grid .role-card")
        .forEach(card => card.classList.remove("selected"));

    element.classList.add("selected");

    selectedRoleBackendName = element.dataset.backendName;

    selectedOrgId =
        element.dataset.orgId !== undefined
            ? Number(element.dataset.orgId)
            : null;

    document.getElementById("modal-confirm-btn").disabled = false;
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