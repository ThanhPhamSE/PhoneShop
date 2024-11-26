using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Repository;

namespace WebAPI.Controllers.Cart
{
    [Route("api/[controller]")]
    [ApiController]
    public class CartController : ControllerBase
    {
        private readonly ICartRepository _cartRepository;
        public CartController(ICartRepository cartRepository)
        {
            _cartRepository = cartRepository;
        }
        [HttpGet("get-cart")]
        public async Task<IActionResult> GetCartsOfUser(string userEmail)
        {
            var cartItems = _cartRepository.GetCartItemsByUserIdAsync(userEmail);
            return Ok(await cartItems);
        }

        [HttpPost("add-cart-item")]
        public async Task<IActionResult> AddCartItem(string userEmail, Guid productd, int quantity)
        {
            var result = await _cartRepository.AddCartItemAsync(userEmail, productd, quantity);
            if (!result)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to add cart item");
            }
            return Ok(result);
        }

        [HttpPut("update-quantity")]
        public async Task<IActionResult> UpdateQuantityCartItem(Guid cartId, int quantity)
        {
            var result = await _cartRepository.UpdateQuantityCartItemAsync(cartId, quantity);
            if (!result)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to update quantity");
            }
            return Ok(result);
        }

        [HttpDelete("delete-cart-item")]
        public async Task<IActionResult> DeleteCartItem(Guid cartItemId)
        {
            var result = await _cartRepository.DeleteCartItemAsync(cartItemId);
            if (!result)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to delete cart item");
            }
            return Ok(result);
        }

        [HttpDelete("delete-all-cart")]
        public async Task<IActionResult> ClearCart(string email)
        {
            var result = await _cartRepository.ClearCartAsync(email);
            if (!result)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, "Failed to clear cart");
            }
            return Ok(result);
        }
    }
}
