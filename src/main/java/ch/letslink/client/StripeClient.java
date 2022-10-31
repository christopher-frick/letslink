package ch.letslink.client;


import com.stripe.Stripe;
import com.stripe.model.Account;
import com.stripe.model.AccountLink;
import com.stripe.model.Charge;
import com.stripe.model.Customer;
import java.util.HashMap;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class StripeClient {

    @Value("${stripe.keys.secret}")
    private String secretKey;

    @Autowired
    StripeClient() {
        Stripe.apiKey = secretKey;
    }

    public Account createAccount(String email) throws Exception {
        Map<String, Object> accountParams = new HashMap<>();
        accountParams.put("type", "standard");
        accountParams.put("country", "CH");
        accountParams.put("email", email);
        return Account.create(accountParams);
    }

    public Account getAccount(String id) throws Exception {
        return Account.retrieve(id);
    }

    public AccountLink createAccountLink(String accountId) throws Exception {
        Map<String, Object> params = new HashMap<>();
        params.put("account", accountId);
        params.put("refresh_url", "http://localhost:8080");
        params.put("return_url", "http://localhost:8080");
        params.put("type", "account_onboarding");
        return AccountLink.create(params);
    }

    public Customer createCustomer(String token, String email) throws Exception {
        Map<String, Object> customerParams = new HashMap<String, Object>();
        customerParams.put("email", email);
        customerParams.put("source", token);
        return Customer.create(customerParams);
    }

    private Customer getCustomer(String id) throws Exception {
        return Customer.retrieve(id);
    }

    public Charge chargeNewCard(String token, double amount) throws Exception {
        Map<String, Object> chargeParams = new HashMap<String, Object>();
        chargeParams.put("amount", (int) (amount * 100));
        chargeParams.put("currency", "USD");
        chargeParams.put("source", token);
        Charge charge = Charge.create(chargeParams);
        return charge;
    }

    public Charge chargeCustomerCard(String customerId, int amount) throws Exception {
        String sourceCard = getCustomer(customerId).getDefaultSource();
        Map<String, Object> chargeParams = new HashMap<String, Object>();
        chargeParams.put("amount", amount);
        chargeParams.put("currency", "USD");
        chargeParams.put("customer", customerId);
        chargeParams.put("source", sourceCard);
        Charge charge = Charge.create(chargeParams);
        return charge;
    }
}
