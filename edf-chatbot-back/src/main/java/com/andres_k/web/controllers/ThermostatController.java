package com.andres_k.web.controllers;

import com.andres_k.web.services.ThermostatService;
import com.andres_k.web.utils.handler.RequestHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;


@Controller
@RequestMapping(value = "/thermostat")
public class ThermostatController {
    private final ThermostatService thermostatService;

    @Autowired
    public ThermostatController(ThermostatService thermostatService) {
        this.thermostatService = thermostatService;
    }

    @RequestMapping(value = "/request", method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<?> request(@RequestParam String action, @RequestParam Double value) {
        try {
            RequestHandler result = this.thermostatService.request(action, value);
            return new ResponseEntity<>(result, HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
