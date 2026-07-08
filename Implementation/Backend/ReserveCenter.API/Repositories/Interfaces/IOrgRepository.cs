using ReserveCenter.API.DatabaseModels;

namespace ReserveCenter.API.Repositories.Interfaces;

public interface IOrgRepository
{
    // برای گرفتن پروفایل کسب و کار مدنظر
    Task<Org?> GetByIdAsync(int orgId);

    //برای زمانی که ما یک درخواست ثبت کسب و کار رو می پذیریم
    //بعد مستقیما باید در این جدول قرار بگیره و نیازی به ثبت مجدد نباشه
    Task<Org> AddAsync(int unregisterdOrgId);

    Task<bool> UpdateAsync(Org org);

    Task<bool> DeleteAsync(int orgId);

    Task<bool> ChangeActiveStatusAsync(int orgId);

    Task<bool> ChangeBannedStatusAsync(int orgId);

    Task<Org?> GetWithDetailsByIdAsync(int orgId);

    //برای گرفتن همه کسب و کار ها
    Task<List<Org>?> GetAllOrgWithDetailAsync();

    //برای سرچ کردن
    Task<List<Org>?> SearchAsync(string searchPhrase);
}
