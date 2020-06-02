package com.andres_k.web.services;

import com.andres_k.web.utils.handler.RequestHandler;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

@Service
public class ThermostatService {

    public RequestHandler request(String action, Double value) {
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

        MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
        map.add("action", action);
        map.add("value", value.toString());

        HttpEntity<MultiValueMap<String, String>> entity = new HttpEntity<>(map, headers);

        ResponseEntity<RequestHandler> response = restTemplate.exchange("https://dev.edflabs.net/thermostat/web/api/request", HttpMethod.POST, entity, RequestHandler.class);
        return response.getBody();
    }
}
