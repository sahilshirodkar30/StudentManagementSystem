namespace StudentManagementSystem.Server.Models
{
    public class Class
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public List<Student>? Students { get; set; }
        public List<Teacher>? Teachers { get; set; }
    }
}
