package io.github.rrbbrb.sushirubackend.controller;

import io.github.rrbbrb.sushirubackend.dto.LogInRequest;
import io.github.rrbbrb.sushirubackend.dto.SignUpRequest;
import io.github.rrbbrb.sushirubackend.service.AuthService;
import io.github.rrbbrb.sushirubackend.service.AuthenticationResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/sign-up")
    public ResponseEntity<Boolean> signUp(@RequestBody SignUpRequest signUpRequest) {
        if(authService.signUp(signUpRequest)) {
            return new ResponseEntity<Boolean>(true, HttpStatus.OK);
        }
        return new ResponseEntity<Boolean>(false, HttpStatus.FORBIDDEN);
    }

    @PostMapping("/log-in")
    public AuthenticationResponse logIn(@RequestBody LogInRequest logInRequest) {
        return authService.logIn(logInRequest);
    }
}
