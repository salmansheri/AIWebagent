using System;
using API.Models;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class ApplicationDBContext(DbContextOptions<ApplicationDBContext> options) : DbContext(options)
{
    public DbSet<Chat> Chat { get; set; }
    public DbSet<ChatMessage> ChatMessage { get; set; }

    

}
