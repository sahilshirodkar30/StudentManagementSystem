using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using StudentManagementSystem.Server.DATA;
using StudentManagementSystem.Server.Models;

namespace StudentManagementSystem.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ClassesController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public ClassesController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetClasses()
        {
            return Ok(await _context.Classs.ToListAsync());
        }

        [HttpPost]
        public async Task<IActionResult> CreateClass([FromBody] classmodel model)
        {
            Class modelClass = new Class
            {
                Name = model.name
            };
            _context.Classs.Add(modelClass);
            await _context.SaveChangesAsync();

            return Ok(model);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateClass(int id, [FromBody] classmodel model)
        {
            var existingClass = await _context.Classs.FindAsync(id);
            if (existingClass == null) return NotFound();

            existingClass.Name = model.name;

            _context.Classs.Update(existingClass);
            await _context.SaveChangesAsync();

            return Ok(existingClass);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteClass(int id)
        {
            var existingClass = await _context.Classs.FindAsync(id);
            if (existingClass == null) return NotFound();

            _context.Classs.Remove(existingClass);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
    public class classmodel
    {
        public string name { get; set; }
    }
}
