namespace StudentManagementSystem.Server.Models
{
    public class Teacher
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string ImageUrl { get; set; }
        public int? ClassId { get; set; }
        public Class? Class { get; set; }
    }
}
