namespace WebAPI.ViewModel.UserInformation
{
    public class UserViewModel
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; }
        public string Email {  get; set; }

        public string PasswordHash { get; set; }

        public string PhoneNumber { get; set; }

    }
}
