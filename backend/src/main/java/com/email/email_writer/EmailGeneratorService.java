package com.email.email_writer;

import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;


import java.util.List;
import java.util.Map;

@Service
public class EmailGeneratorService {

    private final WebClient webClient;

    @Value("${gemini.api.url}")
    private String geminiApiUrl;

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    public EmailGeneratorService(WebClient.Builder webClientBuilder) {
        this.webClient = webClientBuilder.build();
    }

    public String generateEmailReply(EmailRequest emailRequest) throws JsonProcessingException {

        //Build the prompt
        String prompt = buildPrompt(emailRequest);
        System.out.println(prompt);
        // Craft a request

        Map<String, Object> requestBody = Map.of(
                "contents", new Object[]{
                        Map.of("parts", new Object[]{
                                Map.of("text", prompt)
                        })
                });

        ObjectMapper mapper = new ObjectMapper();
        String json = mapper.writerWithDefaultPrettyPrinter()
                .writeValueAsString(requestBody);

        System.out.println(json);





        // Do request and get Response

        String response = webClient.post()
                .uri(geminiApiUrl + "?key=" + geminiApiKey)
                .header("Content-Type", "application/json")
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        System.out.println(response);


        //Extract Response and return
        String ans = extractResponseContent(response);
        System.out.println(ans);
        return ans;

     }

    private String extractResponseContent(String response) {

        String extracted;
       try{
            ObjectMapper mapper = new ObjectMapper();//provided by jakson converts json to Java Object and vice-versa
            JsonNode rootNode = mapper.readTree(response); //readTree method converts JSON into a tree Like Structure
             extracted = rootNode.path("candidates")
                   .get(0)                           // first candidate
                   .path("content")
                   .path("parts")
                   .get(0)
                     .path("text")
                   .asText();
           System.out.println(extracted);

       }catch (Exception e)
       {
           return "Error processing request" + e.getMessage();
       }

       return extracted;

    }

    private String buildPrompt(EmailRequest emailRequest) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("Generate a reply for this email text,");
        if (emailRequest.getTone() != null && !emailRequest.getTone().isEmpty()) {
            System.out.println("The tone is"+ emailRequest.getTone());
            prompt.append(" Use a ").append(emailRequest.getTone()).append(" Tone");
        }
        return prompt.toString();

    }
}