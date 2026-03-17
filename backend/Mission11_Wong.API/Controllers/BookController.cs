using Microsoft.AspNetCore.Mvc;
using Mission11_Wong.API.Data;

namespace Mission11_Wong.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly BookDbContext _context;

        public BooksController(BookDbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        public IActionResult GetBooks()
        {
            var books = _context.Books.ToList();
            return Ok(books);
        }
    }
}