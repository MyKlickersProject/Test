using Microsoft.AspNetCore.Mvc;
using Server.Models;
using Server.Repositories;

namespace Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdsController : ControllerBase
    {
        private readonly AdsRepository _repo;

        public AdsController(AdsRepository repo)
        {
            _repo = repo;
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            return Ok(_repo.GetAll());
        }

        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var ad = _repo.GetById(id);
            return ad is null ? NotFound() : Ok(ad);
        }

        [HttpPost]
        public IActionResult Create([FromForm] Ad request)
        {
            request.CreatedAt = DateTime.UtcNow;
            request.InsertDate = DateTime.UtcNow;

            var created = _repo.Add(request);
            return Created($"api/ads/{created.Id}", created);
        }

        [HttpPut("{id}")]
        public IActionResult Update(int id, [FromForm] Ad request)
        {
            var existing = _repo.GetById(id);
            if (existing == null)
                return NotFound();

            existing.Title = request.Title;
            existing.Description = request.Description;
            existing.Price = request.Price;
            existing.Category = request.Category;
            existing.ContactName = request.ContactName;
            existing.ContactPhone = request.ContactPhone;
            existing.Latitude = request.Latitude;
            existing.Longitude = request.Longitude;

            if (!string.IsNullOrEmpty(request.ImagePath))
                existing.ImagePath = request.ImagePath;

            var ok = _repo.Update(id, existing);
            return ok ? Ok(existing) : NotFound();
        }

        
        [HttpDelete("{id}")]
        public IActionResult Delete(int id)
        {
            var ok = _repo.Delete(id);
            return ok ? NoContent() : NotFound();
        }

        
        [HttpPost("search")]
        public IActionResult Search([FromBody] AdFilter filter)
        {
            var result = _repo.Search(filter);
            return Ok(result);
        }
    }
}
