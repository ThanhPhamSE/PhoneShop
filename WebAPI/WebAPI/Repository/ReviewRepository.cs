using Microsoft.EntityFrameworkCore;
using WebAPI.Data;
using WebAPI.Models;
using WebAPI.ViewModel;
using WebAPI.ViewModel.ProductDetail;

namespace WebAPI.Repository
{
    public class ReviewRepository : IReviewRepository
    {
        private readonly AppDBContext _context;
        public ReviewRepository(AppDBContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<ReviewViewModel>> AddReviewProductByIdAsync(Guid productId, Guid userId, int rating, string comment)
        {
            // Create the review object
            var review = new Review()
            {
                ReviewId = Guid.NewGuid(),  // Generate new ReviewId
                ProductId = productId,
                UserId = userId,
                Rating = rating,
                Comment = comment,
                ReviewDate = DateTime.UtcNow
            };

            // Add the review to the context
            await _context.Reviews.AddAsync(review);

            // Save changes to the database
            bool isCreated = await _context.SaveChangesAsync() > 0;

            if (!isCreated)
            {
                // Handle failure to save if necessary
                return Enumerable.Empty<ReviewViewModel>();
            }

            // Fetch the reviews again after adding the new one
            var reviews = await _context.Reviews
                .Where(r => r.ProductId == productId)
                .Include(r => r.User)
                .Include(r => r.Product)
                .ToListAsync();

            // Map reviews to ReviewViewModel
            var reviewViewModels = reviews.Select(r => new ReviewViewModel
            {
                ReviewId = r.ReviewId,
                UserId = r.UserId,
                UserName = r.User.UserName,  // Assuming User has a Name property
                ProductId = r.ProductId,
                ProductName = r.Product.ProductName,  // Assuming Product has a Name property
                Rating = r.Rating,
                Comment = r.Comment,
                ReviewDate = r.ReviewDate
            });

            return reviewViewModels;
        }

        public async Task<IEnumerable<ReviewViewModel>> GetReviewsByProductIdAsync(Guid productId)
        {
            // Lấy tất cả đánh giá của sản phẩm theo productId, bao gồm thông tin User và Product
            var reviews = await _context.Reviews
                .Where(r => r.ProductId == productId)
                .Include(r => r.User)       // Include User thông qua UserId
                .Include(r => r.Product)    // Include Product thông qua ProductId
                .ToListAsync();

            // Nếu không tìm thấy bất kỳ review nào, trả về null
            if (reviews == null || !reviews.Any())
                return null;

            // Map dữ liệu sang ReviewViewModel
            var reviewVms = reviews.Select(review => new ReviewViewModel()
            {
                ReviewId = review.ReviewId,
                UserId = review.UserId,
                UserName = review.User?.UserName, // Kiểm tra null trước khi lấy UserName
                ProductId = review.ProductId,
                ProductName = review.Product?.ProductName, // Kiểm tra null trước khi lấy ProductName
                Rating = review.Rating,
                Comment = review.Comment,
                ReviewDate = review.ReviewDate,
            }).ToList();

            return reviewVms;
        }



    }
}
