using Azure;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Models;
using WebAPI.Repository;
using WebAPI.Services;

namespace WebAPI.Controllers.CheckOut
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderRepository _orderRepository;
        private readonly IEmailService _emailService;   

        public OrderController(IOrderRepository orderRepository, IEmailService emailService)
        {
            _orderRepository = orderRepository;
            _emailService = emailService;
        }
        [HttpGet("get-all-order")]
        public async Task<IActionResult> GetAllOrder()
        {
            var orders = _orderRepository.GetAlls();
            return Ok(await orders);
        }

        [HttpGet("get-order-by-status")]
        public async Task<IActionResult> GetOrderByStatus(string status)
        {
            var orders = _orderRepository.GetOrderByStatus(status);
            return Ok(await orders);
        }

        [HttpPut("change-status-order")]
        public async Task<IActionResult> ChangeStatusOrder(Guid orderId, string status)
        {
            var result = await _orderRepository.ChangeStatusOrder(orderId, status);
            if (result)
            {
                return Ok("Change status order successfully");
            }
            return BadRequest("Change status order failed");
        }

        [HttpGet("get-user-by-id")]
        public async Task<IActionResult> GetUserById(Guid userId)
        {
            var user = await _orderRepository.GetUserById(userId);
            if (user != null)
            {
                return Ok(user);
            }
            return NotFound();
        }

        [HttpGet("get-order-by-email")]
        public async Task<IActionResult> GetOrderByUserId(string userEmail)
        {
            var orders = await _orderRepository.GetUserByEmail(userEmail);
            return Ok(orders);
        }

        [HttpGet("get-order-items-by-orderId")]
        public async Task<IActionResult> GetOrderItemsByOrderId(Guid orderId)
        {
            var orderItems = await _orderRepository.GetOrderItemsByOrderId(orderId);
            return Ok(orderItems);
        }

        [HttpGet("get-order-by-id")]
        public async Task<IActionResult> GetOrderById(Guid orderId)
        {
            var order = await _orderRepository.GetOrderById(orderId);
            if (order != null)
            {
                return Ok(order);
            }
            return NotFound();
        }

        [HttpGet("get-product-by-id")]
        public async Task<IActionResult> GetProductById(Guid productId)
        {
            var product = await _orderRepository.GetProductById(productId);
            if (product != null)
            {
                return Ok(product);
            }
            return NotFound();
        }

        [HttpGet("get-address-by-userId")]
        public async Task<IActionResult> GetAddressByUserId(Guid userId)
        {
            var address = await _orderRepository.GetAddressByUserId(userId);
            if (address != null)
            {
                return Ok(address);
            }
            return NotFound();
        }

        [HttpGet("send-email")]
        public async Task<IActionResult> SendEmail(string email)
        {
            var message = new Message(new string[] { email }, "Đặt hàng", "Đơn hàng đã được đặt thành công");

            _emailService.SendEmail(message);
            return StatusCode(StatusCodes.Status200OK, "Email sent successfully!");
        }
    }
}
