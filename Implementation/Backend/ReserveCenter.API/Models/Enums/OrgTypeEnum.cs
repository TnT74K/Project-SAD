using System.ComponentModel.DataAnnotations;

namespace ReserveCenter.API.Models.Enums
{
    public enum OrgTypeEnum
    {
        [Display(Name = "همه دسته بندی ها")]
        All = 0,

        [Display(Name = "مطب پزشکان و کلینیک‌های درمانی")]
        MedicalClinics = 10,

        [Display(Name = "دندانپزشکی")]
        Dentistry = 11,

        [Display(Name = "مراکز مشاوره و روان‌شناسی")]
        CounselingCenters = 12,

        [Display(Name = "مراکز فیزیوتراپی و توان‌بخشی")]
        PhysiotherapyCenters = 13,

        [Display(Name = "آزمایشگاه و تصویربرداری پزشکی")]
        MedicalLaboratory = 14,

        [Display(Name = "پزشک عمومی")]
        GeneralPractitioner = 15,

        [Display(Name = "سالن‌های زیبایی و آرایشگاه زنانه")]
        WomensBeautySalon = 20,

        [Display(Name = "آرایشگاه مردانه")]
        MensBarbershop = 21,

        [Display(Name = "مراکز تخصصی پوست و مو")]
        SkinAndHairSpecialist = 22,

        [Display(Name = "سالن‌های ماساژ")]
        MassageSalon = 23,

        [Display(Name = "باشگاه‌های ورزشی و بدنسازی")]
        GymAndFitness = 30,

        [Display(Name = "استخرها و مجموعه‌های آبی")]
        SwimmingPool = 31,

        [Display(Name = "مجموعه‌های بازی (اتاق فرار، بیلیارد و...)")]
        GameCenter = 32,

        [Display(Name = "زمین‌های ورزشی اجاره‌ای (فوتسال، تنیس و...)")]
        SportsFieldRental = 33,

        [Display(Name = "مشاورین املاک")]
        RealEstateConsultant = 40,

        [Display(Name = "دفاتر اسناد رسمی")]
        NotaryPublic = 41,

        [Display(Name = "مراکز آموزش رانندگی")]
        DrivingSchool = 42,

        [Display(Name = "تعمیرگاه‌های تخصصی خودرو")]
        CarRepairShop = 50,

        [Display(Name = "مراکز معاینه فنی")]
        TechnicalInspectionCenter = 51,

        [Display(Name = "مکانیکی")]
        Mechanic = 52,

        [Display(Name = "آتلیه‌های عکاسی و فیلم‌برداری")]
        PhotographyStudio = 60,

        [Display(Name = "تالارهای پذیرایی و سالن‌های همایش")]
        ReceptionHall = 61,

        [Display(Name = "گیم نت")]
        GameNet = 70
    }
}
