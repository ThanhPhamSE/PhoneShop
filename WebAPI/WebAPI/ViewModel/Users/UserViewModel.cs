namespace WebAPI.ViewModel.Users
{
    public class UserViewModel
    {
        public Guid Id { get; set; }
        public string Email {  get; set; }
        public string UserName {  get; set; }
        public DateTime? LastLogin { get; set; }
        public bool IsActive {  get; set; }
        public string PhoneNumber {  get; set; }
        public List<UserRoleViewModel> Roles { get; set; } = new List<UserRoleViewModel>();
    }
}
