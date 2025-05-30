using System;

namespace API.Models;

public class ChatMessage
{
    public int Id { get; set; }
    public string Message { get; set; }
    public int ChatId { get; set; }
    public Chat Chat { get; set; }

    public bool IsRequest { get; set; }

}
