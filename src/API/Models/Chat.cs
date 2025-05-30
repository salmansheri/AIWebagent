using System;

namespace API.Models;

public class Chat
{
    public int Id { get; set; }
    public List<ChatMessage> Messages { get; set; }
    

}
