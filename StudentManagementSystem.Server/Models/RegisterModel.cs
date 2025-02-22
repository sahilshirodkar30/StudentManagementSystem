﻿using System.ComponentModel.DataAnnotations;

namespace StudentManagementSystem.Server.Models
{
    public class RegisterModel
    {
        [Required(ErrorMessage ="Username is Required")]
        public string UserName { get; set; }
        [Required(ErrorMessage = "Email is Required")]
        public string Email { get; set; }
        [Required(ErrorMessage = "Password is Required")]
        public string Password { get; set; }
    }
}
