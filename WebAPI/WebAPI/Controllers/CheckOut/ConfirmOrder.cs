using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Repository.IRepository;

namespace WebAPI.Controllers.CheckOut
{
    [Route("api/[controller]")]
    [ApiController]
    public class ConfirmOrder : ControllerBase
    {
        private readonly IConfirmOrderRepository _confirmOrderRepository;
        public ConfirmOrder(IConfirmOrderRepository confirmOrderRepository)
        {
            _confirmOrderRepository = confirmOrderRepository;
        }

        [HttpGet("get-address-by-email")]
        public async Task<IActionResult> GetAddressByEmail(string email)
        {
            var address = await _confirmOrderRepository.GetAddressByEmail(email);
            if (address == null) return NotFound();
            return Ok(address);
        }
    }
}
