namespace WebAPI.ViewModel.UserInformation
{
    public class ChangePasswordViewModel
    {
        public string email { get; set; } // ID người dùng
        public string OldPassword { get; set; } // Mật khẩu cũ
        public string NewPassword { get; set; } // Mật khẩu mới
        public string ConfirmNewPassword { get; set; } // Xác nhận mật khẩu mới
    }
}
