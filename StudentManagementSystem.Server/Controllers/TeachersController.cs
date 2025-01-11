using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

using StudentManagementSystem.Server.DATA;
using StudentManagementSystem.Server.Models;
using static System.Net.Mime.MediaTypeNames;

namespace StudentManagementSystem.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TeachersController : ControllerBase
    {
        private readonly ApplicationDBContext _context;
        public TeachersController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetTeachers()
        {
            return Ok(await _context.Teachers.ToListAsync());
        }

        [HttpPost]
        public async Task<IActionResult> CreateTeacher([FromForm] teachermodel model, IFormFile image)
        {
            if (string.IsNullOrEmpty(model.Name)) {
                return BadRequest(new { message = "Teacher name is required." });
            }

            if (image != null)
            {
                try
                {
                    // Create the directory if it doesn't exist
                    var imagesDirectory = Path.Combine(Directory.GetCurrentDirectory(), "C:/Users/sahil/OneDrive/Desktop/Project/StudentManagementSystem/studentmanagementsystem.client/public/images");
                    if (!Directory.Exists(imagesDirectory))
                    {
                        Directory.CreateDirectory(imagesDirectory);
                    }

                    // Generate a unique file name to prevent overwriting
                    var safeFileName = Path.GetFileName(image.FileName);
                    var uniqueFileName = $"{Guid.NewGuid()}_{safeFileName}";
                    var filePath = Path.Combine(imagesDirectory, uniqueFileName);

                    // Save the image file
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await image.CopyToAsync(stream);
                    }

                    // Set the image URL in the model
                    model.ImageUrl = $"/images/{uniqueFileName}";
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "An error occurred while uploading the image.", details = ex.Message });
                }
            }

            Teacher st = new Teacher
            {
                Name = model.Name,
                ImageUrl = model.ImageUrl
            };

            _context.Teachers.Add(st);
            await _context.SaveChangesAsync();

            return Ok(model);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTeacher(int id, [FromBody] teachermodel model, IFormFile image)
        {
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null)
            {
                return NotFound(new { message = "Student not found." });
            }

            if (string.IsNullOrEmpty(model.Name))
            {
                return BadRequest(new { message = "Student name is required." });
            }

            // Update student details
            teacher.Name = model.Name;

            if (image != null)
            {
                try
                {
                    // Create the directory if it doesn't exist
                    var imagesDirectory = Path.Combine(Directory.GetCurrentDirectory(), "C:/Users/sahil/OneDrive/Desktop/Project/StudentManagementSystem/studentmanagementsystem.client/public/images");
                    if (!Directory.Exists(imagesDirectory))
                    {
                        Directory.CreateDirectory(imagesDirectory);
                    }

                    // Generate a unique file name to prevent overwriting
                    var safeFileName = Path.GetFileName(image.FileName);
                    var uniqueFileName = $"{Guid.NewGuid()}_{safeFileName}";
                    var filePath = Path.Combine(imagesDirectory, uniqueFileName);

                    // Save the image file
                    using (var stream = new FileStream(filePath, FileMode.Create))
                    {
                        await image.CopyToAsync(stream);
                    }

                    // Set the image URL in the model
                    teacher.ImageUrl = $"/images/{uniqueFileName}";
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "An error occurred while uploading the image.", details = ex.Message });
                }
            }

            // Save the updated student data to the database
            _context.Teachers.Update(teacher);
            await _context.SaveChangesAsync();

            return Ok(teacher); // Return the updated student object

          
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTeacher(int id)
        {
            var teacher = await _context.Teachers.FindAsync(id);
            if (teacher == null) return NotFound();

            _context.Teachers.Remove(teacher);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
    public class teachermodel
    {
        public string Name { get; set; }
        public string? ImageUrl { get; set; }
    }
}
