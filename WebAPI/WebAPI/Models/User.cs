using Microsoft.AspNetCore.Identity;
using System.Net;

namespace WebAPI.Models
{
    public class User : IdentityUser<Guid>
    {
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastLogin { get; set; }
        public bool IsActive { get; set; } = true;

        // Quan hệ 1-n với Address
        public ICollection<Address> Addresses { get; set; }

        // Quan hệ 1-n với CartItem
        public ICollection<CartItem> CartItems { get; set; }

        // Quan hệ 1-n với Order
        public ICollection<Order> Orders { get; set; }

        // Quan hệ 1-n với Review
        public ICollection<Review> Reviews { get; set; }
    }
}
