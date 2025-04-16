// List available models (GET /models)
const response = await fetch("https://openrouter.ai/api/v1/models", {
  method: "GET",
  headers: {},
});

const body = await response.json();
console.log(body);