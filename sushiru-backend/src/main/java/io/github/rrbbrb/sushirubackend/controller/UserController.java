package io.github.rrbbrb.sushirubackend.controller;

import io.github.rrbbrb.sushirubackend.dto.AddressDto;
import io.github.rrbbrb.sushirubackend.dto.ChangePasswordRequest;
import io.github.rrbbrb.sushirubackend.dto.UserDto;
import io.github.rrbbrb.sushirubackend.entity.User;
import io.github.rrbbrb.sushirubackend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<UserDto> getUser() {
        UserDto userDto = userService.getUserInfo();
        if(userDto != null) {
            return new ResponseEntity<UserDto>(userDto, HttpStatus.OK);
        }
        return new ResponseEntity<UserDto>((UserDto) null, HttpStatus.FORBIDDEN);
    }

    @PutMapping("/update-address")
    public ResponseEntity<Boolean> updateUserAddress(@RequestBody AddressDto addressDto) {
        switch(userService.updateAddress(addressDto)) {
            case "bad request":
                return new ResponseEntity<>(false, HttpStatus.BAD_REQUEST);
            case "OK":
                return new ResponseEntity<>(true, HttpStatus.OK);
            case "user not found":
                return new ResponseEntity<>(false, HttpStatus.NOT_FOUND);
            default:
                return new ResponseEntity<>(false, HttpStatus.FORBIDDEN);
        }
    }

    @PutMapping("/change-password")
    public ResponseEntity<Boolean> updateUserPassword(@RequestBody ChangePasswordRequest changePasswordRequest) {
        if(userService.updatePassword(changePasswordRequest)) {
            return new ResponseEntity<>(true, HttpStatus.OK);
        }

        return new ResponseEntity<>(false, HttpStatus.FORBIDDEN);
    }

    @GetMapping("/all")
    public ResponseEntity<List<User>> getAllUsers() {
        return new ResponseEntity<>(userService.listAllUsers(), HttpStatus.OK);
    }

}
