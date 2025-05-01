package com.example.back_end;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping
public class AuthController {
    @Autowired
    private UserService userService;

    @Autowired
    private AuthenticationManager authManager;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest request) {
		User user = userService.registerUser(request.getUsername(), request.getPassword(), "USER");
		return ResponseEntity.ok(user);
	}

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
		Authentication auth = authManager.authenticate(
				new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword()));
        System.out.print(request.getUsername());
        System.out.print(request.getPassword());
		if (auth.isAuthenticated()) {
			return ResponseEntity.ok("Login successful");
		}
		return ResponseEntity.status(401).body("Login failed");
	}
}

class RegisterRequest{
    private String username;
    private String password;
    
    public String getUsername(){
        return username;
    }

    public void setUsername(String username){
        this.username = username;
    }

    public String getPassword(){
        return password;
    }
    public void setPassword(String password){
        this.password = password;
    }
}

class LoginRequest{
    private String username;
    private String password;
    
    public String getUsername(){
        return username;
    }

    public void setUsername(String username){
        this.username = username;
    }

    public String getPassword(){
        return password;
    }
    public void setPassword(String password){
        this.password = password;
    }
}
