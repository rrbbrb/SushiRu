package io.github.rrbbrb.sushirubackend.service;

import io.github.rrbbrb.sushirubackend.dao.UserRepository;
import io.github.rrbbrb.sushirubackend.dto.AddressDto;
import io.github.rrbbrb.sushirubackend.dto.ChangePasswordRequest;
import io.github.rrbbrb.sushirubackend.dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<io.github.rrbbrb.sushirubackend.entity.User> listAllUsers() {
        return userRepository.findAll();
    }

    public UserDto getUserInfo() {
        if(getCurrentUser().isPresent()) {
            UserDto userDto = new UserDto();
            String username = getCurrentUser().get().getUsername();
            if(userFromDB(username) != null) {
                io.github.rrbbrb.sushirubackend.entity.User user = userFromDB(username);
                userDto.setUsername(user.getUsername());
                AddressDto addressDto = new AddressDto();
                addressDto.setFullName(user.getFullName());
                addressDto.setContactNumber(user.getContactNumber());
                addressDto.setAddress(user.getAddress());
                addressDto.setDistrict(user.getDistrict());
                addressDto.setCity(user.getCity());
                userDto.setAddressDto(addressDto);
                return userDto;
            }
        }
        return null;
    }

    public String updateAddress(AddressDto addressDto) {
        if(getCurrentUser().isPresent()) {
            if(anyFieldEmptyOrNull(addressDto)) {
                return "bad request";
            } else {
                io.github.rrbbrb.sushirubackend.entity.User user = userFromDB(getCurrentUser().get().getUsername());
                if(user != null) {
                    setAddress(user, addressDto);
                    userRepository.save(user);
                    return "OK";
                }
                return "user not found";
            }
        }
        return "forbidden";
    }

    public boolean updatePassword(ChangePasswordRequest changePasswordRequest) {
        if(getCurrentUser().isPresent()) {
            String username = getCurrentUser().get().getUsername();
            if (matchPassword(username, changePasswordRequest.getOldPassword())) {
                io.github.rrbbrb.sushirubackend.entity.User user = userFromDB(username);
                user.setEncodedPassword(passwordEncoder.encode(changePasswordRequest.getNewPassword()));
                userRepository.save(user);
                return true;
            }
        }
        return false;
    }

    public boolean anyFieldEmptyOrNull(AddressDto addressDto) {
        return addressDto.getFullName().isEmpty() ||
                addressDto.getFullName() == null ||
                addressDto.getContactNumber().isEmpty() ||
                addressDto.getContactNumber() == null ||
                addressDto.getAddress().isEmpty() ||
                addressDto.getAddress() == null ||
                addressDto.getDistrict().isEmpty() ||
                addressDto.getDistrict() == null ||
                addressDto.getCity().isEmpty() ||
                addressDto.getCity() == null;
    }

    public void setAddress(io.github.rrbbrb.sushirubackend.entity.User user, AddressDto addressDto) {
        user.setFullName(addressDto.getFullName());
        user.setContactNumber(addressDto.getContactNumber());
        user.setAddress(addressDto.getAddress());
        user.setDistrict(addressDto.getDistrict());
        user.setCity(addressDto.getCity());
    }

    private boolean matchPassword(String username, String password) {
        io.github.rrbbrb.sushirubackend.entity.User user = userFromDB(username);
        return passwordEncoder.matches(password, user.getEncodedPassword());
    }

    public io.github.rrbbrb.sushirubackend.entity.User userFromDB(String username) {
        return userRepository.findByUsername(username).orElseThrow(() -> new UsernameNotFoundException("Username not found in DB"));
    }

    public Optional<User> getCurrentUser() {
        return authService.getCurrentUser();
    }
}
