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
    public class StudentsController : ControllerBase
    {
        private readonly ApplicationDBContext _context;

        public StudentsController(ApplicationDBContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetStudents()
        {
            return Ok(await _context.Students.ToListAsync());
        }

        [HttpPost]
        public async Task<IActionResult> CreateStudent([FromForm] studentmodel model, IFormFile image)
        {
            if (string.IsNullOrEmpty(model.Name))
            {
                return BadRequest(new { message = "Student name is required." });
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

            // Create new Student entity and assign properties
            Student st = new Student
            {
                Name = model.Name,
                ImageUrl = model.ImageUrl,
               ClassId = model.Classid
            };

            // Add the student model to the database
            _context.Students.Add(st);
            await _context.SaveChangesAsync();

            return Ok(st); // Return the created student object
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateStudent(int id, [FromForm] studentmodel model, IFormFile image)
        {
            // Fetch the existing student by ID
            var student = await _context.Students.FindAsync(id);
            if (student == null)
            {
                return NotFound(new { message = "Student not found." });
            }

            if (string.IsNullOrEmpty(model.Name))
            {
                return BadRequest(new { message = "Student name is required." });
            }

            // Update student details
            student.Name = model.Name;
            student.ClassId = model.Classid;

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
                    student.ImageUrl = $"/images/{uniqueFileName}";
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { message = "An error occurred while uploading the image.", details = ex.Message });
                }
            }

            // Save the updated student data to the database
            _context.Students.Update(student);
            await _context.SaveChangesAsync();

            return Ok(student); // Return the updated student object
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteStudent(int id)
        {
            var student = await _context.Students.FindAsync(id);
            if (student == null) return NotFound();

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
    public class studentmodel
    {
        public string Name { get; set; }
        public string? ImageUrl { get; set; }
        public int? Classid { get; set; }

    }
}
