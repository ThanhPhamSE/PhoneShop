namespace WebAPI.ViewModel.UserInformation
{
    public class UpdateUserAndAddressViewModel
    {
        // User thông tin
        public string UserName { get; set; }
        public string PhoneNumber { get; set; }

        // Address thông tin
        public Guid AddressId { get; set; }
        public string City { get; set; }
        public string District { get; set; }
        public string Village { get; set; }
        public string Description { get; set; }
    }
}
