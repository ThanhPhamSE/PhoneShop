namespace WebAPI.Models
{
    public class Address
    {
        public Guid AddressId { get; set; }
        public Guid UserId { get; set; } // FK đến ApplicationUser
        public string City { get; set; }
        public string District { get; set; }
        public string Village { get; set; }
        public string Description { get; set; }
        public User User { get; set; }
    }
}
