using WebAPI.ViewModel.ProductDetail;

namespace WebAPI.Repository
{
    public interface IReviewRepository
    {
        Task<IEnumerable<ReviewViewModel>> GetReviewsByProductIdAsync(Guid productId);
        Task<IEnumerable<ReviewViewModel>> AddReviewProductByIdAsync(Guid productId, Guid userId, int rating, string comment);
    }
}
