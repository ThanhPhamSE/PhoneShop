namespace WebAPI.Models
{
    public class Order
    {
        public Guid OrderId { get; set; }
        public Guid UserId { get; set; } // FK đến ApplicationUser
        public DateTime OrderDate { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; }
        public User User { get; set; }
        public ICollection<OrderItem> OrderItems { get; set; }
    }
}
