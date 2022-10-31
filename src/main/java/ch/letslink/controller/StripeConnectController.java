package ch.letslink.controller;

import ch.letslink.client.StripeClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin("*")
@RequestMapping("/stripe")
public class StripeConnectController {

    private final StripeClient stripeClient;

    @Autowired
    StripeConnectController(StripeClient stripeClient) {
        this.stripeClient = stripeClient;
    }

    @GetMapping("/connect")
    public String connect() {
        return "connectttest";
    }

    public StripeClient getStripeClient() {
        return stripeClient;
    }
}
