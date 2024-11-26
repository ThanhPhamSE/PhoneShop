namespace WebAPI.ViewModel.CheckOut
{
    public class AddressViewModel
    {
        public Guid AddressId { get; set; }
        public Guid UserId { get; set; } // FK đến ApplicationUser
        public string City { get; set; }
        public string District { get; set; }
        public string Village { get; set; }
        public string Description { get; set; }
    }
}
