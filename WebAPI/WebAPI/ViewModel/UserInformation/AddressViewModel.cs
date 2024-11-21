namespace WebAPI.ViewModel.UserInformation
{
    public class AddressViewModel
    {
        public Guid AddressId { get; set; }
        public string City { get; set; }
        public string District { get; set; }
        public string Village { get; set; }
        public string Description { get; set; }
        public Guid UserId { get; set; } // Id người dùng (nếu cần)
        public string UserName { get; set; } // Tên người dùng (nếu cần)
    }
}
