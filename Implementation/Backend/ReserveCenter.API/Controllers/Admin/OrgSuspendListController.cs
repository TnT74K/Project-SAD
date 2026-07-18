

using Microsoft.AspNetCore.Mvc;
using ReserveCenter.API.Services.Interfaces;

namespace ReserveCenter.API.Controllers.Admin;
/*
GET   /api/admin/org-suspend-list
PATCH /api/admin/org-suspend-list/{orgId}/suspend
PATCH /api/admin/org-suspend-list/{orgId}/unlock
*/

[ApiController]
[Route("api/admin/org-suspend-list")]
public class OrgSuspendListController : ControllerBase
{
    private readonly IOrgSuspendListService _orgSuspendListService;

    public OrgSuspendListController(IOrgSuspendListService orgSuspendListService)
    {
        _orgSuspendListService = orgSuspendListService;
    }

    [HttpGet]
    public async Task<IActionResult> ShowAllOrgs()
    {
        var orgs = await _orgSuspendListService.ShowAllOrgsAsync();
        return Ok(orgs);
    }

    [HttpPatch("{orgId}/suspend")]
    public async Task<IActionResult> SuspendOrg(int orgId)
    {
        var result = await _orgSuspendListService.SuspendOrgAsync(orgId);

        if (!result)
        {
            return BadRequest("Organization does not exist or is already suspended.");
        }

        return Ok("Organization suspended successfully.");
    }

    [HttpPatch("{orgId}/unlock")]
    public async Task<IActionResult> UnlockOrg(int orgId)
    {
        var result = await _orgSuspendListService.UnlockOrgAsync(orgId);

        if (!result)
        {
            return BadRequest("Organization does not exist or is not suspended.");
        }

        return Ok("Organization unlocked successfully.");
    }
}