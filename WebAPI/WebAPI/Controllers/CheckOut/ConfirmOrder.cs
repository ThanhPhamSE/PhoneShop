using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Repository.IRepository;
using WebAPI.ViewModel.CheckOut;

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
            return Ok(address);
        }

        [HttpGet("get-user-by-email")]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            var user = await _confirmOrderRepository.GetUserByEmail(email);
            if (user == null) return NotFound();
            return Ok(user);
        }

        [HttpPost("add-address")]
        public async Task<IActionResult> AddressUser([FromBody] AddressViewModel address)
        {
            if (await _confirmOrderRepository.AddressUser(address))
            {
                return Ok();
            }
            return BadRequest();
        }
    }
}
