using API.Dto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AIWebAgentController : ControllerBase
    {
        private readonly HttpClient _httpClient;

        public AIWebAgentController(IHttpClientFactory httpClientFactory)
        {
            _httpClient = httpClientFactory.CreateClient("ollama");  ;

        }

        [HttpPost("ask")]
        public async Task<ActionResult<APIResponseDto>> AskAsync(APIRequestDto request)
        {
            if (request.Message == null || string.IsNullOrEmpty(request.Message) || string.IsNullOrWhiteSpace(request.Message))
            {
                return BadRequest(new { Result = "Failure", Message = "Message cannot be null or empty." });
            }

            try
            {
                var payload = new
                {
                    
                    model = "gemma:2b",
                    prompt = request.Message,
                    stream = false
                };

                var response = await _httpClient.PostAsJsonAsync("http://localhost:11434/api/generate", payload);
                var content = await response.Content.ReadFromJsonAsync<APIResponseDto>();
                return Ok(new { Result = "Success", Message = content?.Response ?? "No Response from Api" }); 


            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new { Result = "Failure", Message = ex.Message });

            }

        }
    }
}
