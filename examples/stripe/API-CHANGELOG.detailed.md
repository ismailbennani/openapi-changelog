Version 2024-06-20 
  - Changes
    - Changed documentation of operation GET /v1/refunds
      - Changes:\
        ~~<p>Returns a list of all refunds you created. We return the refunds in sorted order, with the most recent
        refunds appearing first The 10 most recent refunds are always available by default on the Charge object.</p>~~\
        **<p>Returns a list of all refunds you created. We return the refunds in sorted order, with the most recent
        refunds appearing first. The 10 most recent refunds are always available by default on the Charge object.</p>**

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - Changes
    - In operation GET /v1/disputes
      - Changed documentation of parameter created
        - Changes:\
          Only return disputes that were created during the given date interval.
    - Changed documentation of operation GET /v1/events/{id}
      - Changes:\
        ~~<p>Retrieves the details of an event. Supply the unique identifier of the event, which you might have received
        in a webhook.</p>~~\
        **<p>Retrieves the details of an event if it was created in the last 30 days. Supply the unique identifier of
        the event, which you might have received in a webhook.</p>**

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - Changes
    - Changed documentation of schema identity.verification_report used in 8 endpoints
    
      - Used in GET /v1/identity/verification_reports
      - Used in GET /v1/identity/verification_reports/{report}
      - Used in GET /v1/identity/verification_sessions
      - Used in POST /v1/identity/verification_sessions
      - Used in GET /v1/identity/verification_sessions/{session}
      - Used in POST /v1/identity/verification_sessions/{session}
      - Used in POST /v1/identity/verification_sessions/{session}/cancel
      - Used in POST /v1/identity/verification_sessions/{session}/redact
      - Changes:\
        ~~Related guides: [Accessing verification
        results](https://stripe.com/docs/identity/verification-sessions\#results).~~\
        **Related guide: [Accessing verification
        results](https://stripe.com/docs/identity/verification-sessions\#results).**
    - Changed documentation of schema payment_method_domain used in 5 endpoints
    
      - Used in GET /v1/payment_method_domains
      - Used in POST /v1/payment_method_domains
      - Used in GET /v1/payment_method_domains/{payment_method_domain}
      - Used in POST /v1/payment_method_domains/{payment_method_domain}
      - Used in POST /v1/payment_method_domains/{payment_method_domain}/validate
      - Changes:\
        ~~Related guides: [Payment method
        domains](https://stripe.com/docs/payments/payment-methods/pmd-registration).~~\
        **Related guide: [Payment method domains](https://stripe.com/docs/payments/payment-methods/pmd-registration).**

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - Changes
    - Changed documentation of operation POST /v1/subscriptions/{subscription_exposed_id}
      - Changes:\
        ~~To preview how the proration is calculated, use the <a href="/docs/api/invoices/upcoming">upcoming invoice</a>
        endpoint.</p>~~\
        **To preview how the proration is calculated, use the <a href="/docs/api/invoices/create_preview">create
        preview</a> endpoint.</p>**\
        ~~<li>The subscription moves from free to paid, or paid to free.</li>~~\
        **<li>The subscription moves from free to paid.</li>**\
        ~~<p>In these cases, we apply a credit for the unused time on the previous price, immediately charge the
        customer using the new price, and reset the billing date.</p>~~\
        **<p>In these cases, we apply a credit for the unused time on the previous price, immediately charge the
        customer using the new price, and reset the billing date. Learn about how <a
        href="/billing/subscriptions/upgrade-downgrade\#immediate-payment">Stripe immediately attempts payment for
        subscription changes</a>.</p>**\
    
    
        <p>If you want to charge for an upgrade immediately, pass <code>proration_behavior</code> as
        <code>always_invoice</code> to create prorations, automatically invoice the customer for those proration
        adjustments, and attempt to collect payment. If you pass <code>create_prorations</code>, the prorations are
        created but not automatically invoiced. If you want to bill the customer for the prorations before the
        subscription’s renewal date, you need to manually <a href="/docs/api/invoices/create">invoice the
        customer</a>.</p>
    
        <p>If you don’t want to prorate, set the <code>proration_behavior</code> option to <code>none</code>. With this
        option, the customer is billed <currency>100</currency> on May 1 and <currency>200</currency> on June 1.
        Similarly, if you set <code>proration_behavior</code> to <code>none</code> when switching between different
        billing intervals (for example, from monthly to yearly), we don’t generate any credits for the old
        subscription’s unused time. We still reset the billing date and bill immediately for the new subscription.</p>
    
        <p>Updating the quantity on a subscription many times in an hour may result in <a href="/docs/rate-limits">rate
        limiting</a>. If you need to bill for a frequently changing quantity, consider integrating <a
        href="/docs/billing/subscriptions/usage-based">usage-based billing</a> instead.</p>
    - Changed documentation of schema billing_portal.session used in 1 endpoints
    
      - Used in POST /v1/billing_portal/sessions
      - Changes:\
        ~~Learn more in the [integration
        guide](https://stripe.com/docs/billing/subscriptions/integrating-customer-portal).~~\
        **Related guide: [Customer management](/customer-management)**

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - Changes
    - In operation GET /v1/billing/meters/{id}/event_summaries
      - Changed documentation of parameter end_time
        - Changes:\
          ~~The timestamp from when to stop aggregating meter events (exclusive).~~\
          **The timestamp from when to stop aggregating meter events (exclusive). Must be aligned with minute
          boundaries.**
      - Changed documentation of parameter start_time
        - Changes:\
          ~~The timestamp from when to start aggregating meter events (inclusive).~~\
          **The timestamp from when to start aggregating meter events (inclusive). Must be aligned with minute
          boundaries.**

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - Changes
    - Changed documentation of operation POST /v1/customer_sessions
      - Changes:\
        ~~<p>Creates a customer session object that includes a single-use client secret that you can use on your
        front-end to grant client-side API access for certain customer resources.</p>~~\
        **<p>Creates a Customer Session object that includes a single-use client secret that you can use on your
        front-end to grant client-side API access for certain customer resources.</p>**
    - Changed documentation of schema customer_session used in 1 endpoints
    
      - Used in POST /v1/customer_sessions
      - Changes:\
        ~~A customer session allows you to grant client access to Stripe's frontend SDKs (like StripeJs)~~\
        **A Customer Session allows you to grant Stripe's frontend SDKs (like Stripe.js) client-side access**\
        ~~control over a customer.~~\
        **control over a Customer.**
    - Changed documentation of schema customer_session_resource_components used in 1 endpoints
    
      - Used in POST /v1/customer_sessions
      - Changes:\
        ~~Configuration for the components supported by this customer session.~~\
        **Configuration for the components supported by this Customer Session.**

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - Changes
    - In operation GET /v1/billing/meters/{id}/event_summaries
      - Changed documentation of parameter value_grouping_window
        - Changes:\
          ~~Specifies what granularity to use when generating event summaries. If not specified, a single event summary
          would be returned for the specified time range.~~\
          **Specifies what granularity to use when generating event summaries. If not specified, a single event summary
          would be returned for the specified time range. For hourly granularity, start and end times must align with
          hour boundaries (e.g., 00:00, 01:00, ..., 23:00). For daily granularity, start and end times must align with
          UTC day boundaries (00:00 UTC).**

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - Changes
    - Changed documentation of operation POST /v1/tax/calculations
      - Changes:\
        ~~<p>Calculates tax based on input and returns a Tax <code>Calculation</code> object.</p>~~\
        **<p>Calculates tax based on the input and returns a Tax <code>Calculation</code> object.</p>**

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-06-20 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - Changes
    - Changed documentation of operation GET /v1/tax/calculations/{calculation}/line_items
      - Changes:\
        ~~<p>Retrieves the line items of a persisted tax calculation as a collection.</p>~~\
        **<p>Retrieves the line items of a tax calculation as a collection, if the calculation hasn’t expired.</p>**

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - Changes
    - Changed documentation of schema bank_account used in 533 endpoints
    
      - Used in GET /v1/account
      - Used in POST /v1/account_links
      - Used in POST /v1/account_sessions
      - Used in GET /v1/accounts
      - Used in POST /v1/accounts
      - Used in DELETE /v1/accounts/{account}
      - Used in GET /v1/accounts/{account}
      - Used in POST /v1/accounts/{account}
      - Used in POST /v1/accounts/{account}/bank_accounts
      - Used in DELETE /v1/accounts/{account}/bank_accounts/{id}
      - Used in GET /v1/accounts/{account}/bank_accounts/{id}
      - Used in POST /v1/accounts/{account}/bank_accounts/{id}
      - Used in GET /v1/accounts/{account}/capabilities
      - Used in GET /v1/accounts/{account}/capabilities/{capability}
      - Used in POST /v1/accounts/{account}/capabilities/{capability}
      - Used in GET /v1/accounts/{account}/external_accounts
      - Used in POST /v1/accounts/{account}/external_accounts
      - Used in DELETE /v1/accounts/{account}/external_accounts/{id}
      - Used in GET /v1/accounts/{account}/external_accounts/{id}
      - Used in POST /v1/accounts/{account}/external_accounts/{id}
      - Used in POST /v1/accounts/{account}/login_links
      - Used in GET /v1/accounts/{account}/people
      - Used in POST /v1/accounts/{account}/people
      - Used in DELETE /v1/accounts/{account}/people/{person}
      - Used in GET /v1/accounts/{account}/people/{person}
      - Used in POST /v1/accounts/{account}/people/{person}
      - Used in GET /v1/accounts/{account}/persons
      - Used in POST /v1/accounts/{account}/persons
      - Used in DELETE /v1/accounts/{account}/persons/{person}
      - Used in GET /v1/accounts/{account}/persons/{person}
      - Used in POST /v1/accounts/{account}/persons/{person}
      - Used in POST /v1/accounts/{account}/reject
      - Used in GET /v1/apple_pay/domains
      - Used in POST /v1/apple_pay/domains
      - Used in DELETE /v1/apple_pay/domains/{domain}
      - Used in GET /v1/apple_pay/domains/{domain}
      - Used in GET /v1/application_fees
      - Used in GET /v1/application_fees/{fee}/refunds/{id}
      - Used in POST /v1/application_fees/{fee}/refunds/{id}
      - Used in GET /v1/application_fees/{id}
      - Used in POST /v1/application_fees/{id}/refund
      - Used in GET /v1/application_fees/{id}/refunds
      - Used in POST /v1/application_fees/{id}/refunds
      - Used in GET /v1/apps/secrets
      - Used in POST /v1/apps/secrets
      - Used in POST /v1/apps/secrets/delete
      - Used in GET /v1/apps/secrets/find
      - Used in GET /v1/balance
      - Used in GET /v1/balance/history
      - Used in GET /v1/balance/history/{id}
      - Used in GET /v1/balance_transactions
      - Used in GET /v1/balance_transactions/{id}
      - Used in POST /v1/billing/meter_event_adjustments
      - Used in POST /v1/billing/meter_events
      - Used in GET /v1/billing/meters
      - Used in POST /v1/billing/meters
      - Used in GET /v1/billing/meters/{id}
      - Used in POST /v1/billing/meters/{id}
      - Used in POST /v1/billing/meters/{id}/deactivate
      - Used in GET /v1/billing/meters/{id}/event_summaries
      - Used in POST /v1/billing/meters/{id}/reactivate
      - Used in GET /v1/billing_portal/configurations
      - Used in POST /v1/billing_portal/configurations
      - Used in GET /v1/billing_portal/configurations/{configuration}
      - Used in POST /v1/billing_portal/configurations/{configuration}
      - Used in POST /v1/billing_portal/sessions
      - Used in GET /v1/charges
      - Used in POST /v1/charges
      - Used in GET /v1/charges/search
      - Used in GET /v1/charges/{charge}
      - Used in POST /v1/charges/{charge}
      - Used in POST /v1/charges/{charge}/capture
      - Used in GET /v1/charges/{charge}/dispute
      - Used in POST /v1/charges/{charge}/dispute
      - Used in POST /v1/charges/{charge}/dispute/close
      - Used in POST /v1/charges/{charge}/refund
      - Used in GET /v1/charges/{charge}/refunds
      - Used in POST /v1/charges/{charge}/refunds
      - Used in GET /v1/charges/{charge}/refunds/{refund}
      - Used in POST /v1/charges/{charge}/refunds/{refund}
      - Used in GET /v1/checkout/sessions
      - Used in POST /v1/checkout/sessions
      - Used in GET /v1/checkout/sessions/{session}
      - Used in POST /v1/checkout/sessions/{session}/expire
      - Used in GET /v1/checkout/sessions/{session}/line_items
      - Used in GET /v1/climate/orders
      - Used in POST /v1/climate/orders
      - Used in GET /v1/climate/orders/{order}
      - Used in POST /v1/climate/orders/{order}
      - Used in POST /v1/climate/orders/{order}/cancel
      - Used in GET /v1/climate/products
      - Used in GET /v1/climate/products/{product}
      - Used in GET /v1/climate/suppliers
      - Used in GET /v1/climate/suppliers/{supplier}
      - Used in GET /v1/confirmation_tokens/{confirmation_token}
      - Used in GET /v1/country_specs
      - Used in GET /v1/country_specs/{country}
      - Used in GET /v1/coupons
      - Used in POST /v1/coupons
      - Used in DELETE /v1/coupons/{coupon}
      - Used in GET /v1/coupons/{coupon}
      - Used in POST /v1/coupons/{coupon}
      - Used in GET /v1/credit_notes
      - Used in POST /v1/credit_notes
      - Used in GET /v1/credit_notes/preview
      - Used in GET /v1/credit_notes/preview/lines
      - Used in GET /v1/credit_notes/{credit_note}/lines
      - Used in GET /v1/credit_notes/{id}
      - Used in POST /v1/credit_notes/{id}
      - Used in POST /v1/credit_notes/{id}/void
      - Used in POST /v1/customer_sessions
      - Used in GET /v1/customers
      - Used in POST /v1/customers
      - Used in GET /v1/customers/search
      - Used in DELETE /v1/customers/{customer}
      - Used in GET /v1/customers/{customer}
      - Used in POST /v1/customers/{customer}
      - Used in GET /v1/customers/{customer}/balance_transactions
      - Used in POST /v1/customers/{customer}/balance_transactions
      - Used in GET /v1/customers/{customer}/balance_transactions/{transaction}
      - Used in POST /v1/customers/{customer}/balance_transactions/{transaction}
      - Used in GET /v1/customers/{customer}/bank_accounts
      - Used in POST /v1/customers/{customer}/bank_accounts
      - Used in DELETE /v1/customers/{customer}/bank_accounts/{id}
      - Used in GET /v1/customers/{customer}/bank_accounts/{id}
      - Used in POST /v1/customers/{customer}/bank_accounts/{id}
      - Used in POST /v1/customers/{customer}/bank_accounts/{id}/verify
      - Used in GET /v1/customers/{customer}/cards
      - Used in POST /v1/customers/{customer}/cards
      - Used in DELETE /v1/customers/{customer}/cards/{id}
      - Used in GET /v1/customers/{customer}/cards/{id}
      - Used in POST /v1/customers/{customer}/cards/{id}
      - Used in GET /v1/customers/{customer}/cash_balance
      - Used in POST /v1/customers/{customer}/cash_balance
      - Used in GET /v1/customers/{customer}/cash_balance_transactions
      - Used in GET /v1/customers/{customer}/cash_balance_transactions/{transaction}
      - Used in DELETE /v1/customers/{customer}/discount
      - Used in GET /v1/customers/{customer}/discount
      - Used in POST /v1/customers/{customer}/funding_instructions
      - Used in GET /v1/customers/{customer}/payment_methods
      - Used in GET /v1/customers/{customer}/payment_methods/{payment_method}
      - Used in GET /v1/customers/{customer}/sources
      - Used in POST /v1/customers/{customer}/sources
      - Used in DELETE /v1/customers/{customer}/sources/{id}
      - Used in GET /v1/customers/{customer}/sources/{id}
      - Used in POST /v1/customers/{customer}/sources/{id}
      - Used in POST /v1/customers/{customer}/sources/{id}/verify
      - Used in GET /v1/customers/{customer}/subscriptions
      - Used in POST /v1/customers/{customer}/subscriptions
      - Used in DELETE /v1/customers/{customer}/subscriptions/{subscription_exposed_id}
      - Used in GET /v1/customers/{customer}/subscriptions/{subscription_exposed_id}
      - Used in POST /v1/customers/{customer}/subscriptions/{subscription_exposed_id}
      - Used in DELETE /v1/customers/{customer}/subscriptions/{subscription_exposed_id}/discount
      - Used in GET /v1/customers/{customer}/subscriptions/{subscription_exposed_id}/discount
      - Used in GET /v1/customers/{customer}/tax_ids
      - Used in POST /v1/customers/{customer}/tax_ids
      - Used in DELETE /v1/customers/{customer}/tax_ids/{id}
      - Used in GET /v1/customers/{customer}/tax_ids/{id}
      - Used in GET /v1/disputes
      - Used in GET /v1/disputes/{dispute}
      - Used in POST /v1/disputes/{dispute}
      - Used in POST /v1/disputes/{dispute}/close
      - Used in GET /v1/entitlements/active_entitlements
      - Used in GET /v1/entitlements/active_entitlements/{id}
      - Used in GET /v1/entitlements/features
      - Used in POST /v1/entitlements/features
      - Used in GET /v1/entitlements/features/{id}
      - Used in POST /v1/entitlements/features/{id}
      - Used in POST /v1/ephemeral_keys
      - Used in DELETE /v1/ephemeral_keys/{key}
      - Used in GET /v1/events
      - Used in GET /v1/events/{id}
      - Used in GET /v1/exchange_rates
      - Used in GET /v1/exchange_rates/{rate_id}
      - Used in GET /v1/file_links
      - Used in POST /v1/file_links
      - Used in GET /v1/file_links/{link}
      - Used in POST /v1/file_links/{link}
      - Used in GET /v1/files
      - Used in POST /v1/files
      - Used in GET /v1/files/{file}
      - Used in GET /v1/financial_connections/accounts
      - Used in GET /v1/financial_connections/accounts/{account}
      - Used in POST /v1/financial_connections/accounts/{account}/disconnect
      - Used in GET /v1/financial_connections/accounts/{account}/owners
      - Used in POST /v1/financial_connections/accounts/{account}/refresh
      - Used in POST /v1/financial_connections/accounts/{account}/subscribe
      - Used in POST /v1/financial_connections/accounts/{account}/unsubscribe
      - Used in POST /v1/financial_connections/sessions
      - Used in GET /v1/financial_connections/sessions/{session}
      - Used in GET /v1/financial_connections/transactions
      - Used in GET /v1/financial_connections/transactions/{transaction}
      - Used in GET /v1/forwarding/requests
      - Used in POST /v1/forwarding/requests
      - Used in GET /v1/forwarding/requests/{id}
      - Used in GET /v1/identity/verification_reports
      - Used in GET /v1/identity/verification_reports/{report}
      - Used in GET /v1/identity/verification_sessions
      - Used in POST /v1/identity/verification_sessions
      - Used in GET /v1/identity/verification_sessions/{session}
      - Used in POST /v1/identity/verification_sessions/{session}
      - Used in POST /v1/identity/verification_sessions/{session}/cancel
      - Used in POST /v1/identity/verification_sessions/{session}/redact
      - Used in GET /v1/invoiceitems
      - Used in POST /v1/invoiceitems
      - Used in DELETE /v1/invoiceitems/{invoiceitem}
      - Used in GET /v1/invoiceitems/{invoiceitem}
      - Used in POST /v1/invoiceitems/{invoiceitem}
      - Used in GET /v1/invoices
      - Used in POST /v1/invoices
      - Used in POST /v1/invoices/create_preview
      - Used in GET /v1/invoices/search
      - Used in GET /v1/invoices/upcoming
      - Used in GET /v1/invoices/upcoming/lines
      - Used in DELETE /v1/invoices/{invoice}
      - Used in GET /v1/invoices/{invoice}
      - Used in POST /v1/invoices/{invoice}
      - Used in POST /v1/invoices/{invoice}/finalize
      - Used in GET /v1/invoices/{invoice}/lines
      - Used in POST /v1/invoices/{invoice}/lines/{line_item_id}
      - Used in POST /v1/invoices/{invoice}/mark_uncollectible
      - Used in POST /v1/invoices/{invoice}/pay
      - Used in POST /v1/invoices/{invoice}/send
      - Used in POST /v1/invoices/{invoice}/void
      - Used in GET /v1/issuing/authorizations
      - Used in GET /v1/issuing/authorizations/{authorization}
      - Used in POST /v1/issuing/authorizations/{authorization}
      - Used in POST /v1/issuing/authorizations/{authorization}/approve
      - Used in POST /v1/issuing/authorizations/{authorization}/decline
      - Used in GET /v1/issuing/cardholders
      - Used in POST /v1/issuing/cardholders
      - Used in GET /v1/issuing/cardholders/{cardholder}
      - Used in POST /v1/issuing/cardholders/{cardholder}
      - Used in GET /v1/issuing/cards
      - Used in POST /v1/issuing/cards
      - Used in GET /v1/issuing/cards/{card}
      - Used in POST /v1/issuing/cards/{card}
      - Used in GET /v1/issuing/disputes
      - Used in POST /v1/issuing/disputes
      - Used in GET /v1/issuing/disputes/{dispute}
      - Used in POST /v1/issuing/disputes/{dispute}
      - Used in POST /v1/issuing/disputes/{dispute}/submit
      - Used in GET /v1/issuing/personalization_designs
      - Used in POST /v1/issuing/personalization_designs
      - Used in GET /v1/issuing/personalization_designs/{personalization_design}
      - Used in POST /v1/issuing/personalization_designs/{personalization_design}
      - Used in GET /v1/issuing/physical_bundles
      - Used in GET /v1/issuing/physical_bundles/{physical_bundle}
      - Used in GET /v1/issuing/settlements/{settlement}
      - Used in POST /v1/issuing/settlements/{settlement}
      - Used in GET /v1/issuing/tokens
      - Used in GET /v1/issuing/tokens/{token}
      - Used in POST /v1/issuing/tokens/{token}
      - Used in GET /v1/issuing/transactions
      - Used in GET /v1/issuing/transactions/{transaction}
      - Used in POST /v1/issuing/transactions/{transaction}
      - Used in POST /v1/link_account_sessions
      - Used in GET /v1/link_account_sessions/{session}
      - Used in GET /v1/linked_accounts
      - Used in GET /v1/linked_accounts/{account}
      - Used in POST /v1/linked_accounts/{account}/disconnect
      - Used in GET /v1/linked_accounts/{account}/owners
      - Used in POST /v1/linked_accounts/{account}/refresh
      - Used in GET /v1/mandates/{mandate}
      - Used in GET /v1/payment_intents
      - Used in POST /v1/payment_intents
      - Used in GET /v1/payment_intents/search
      - Used in GET /v1/payment_intents/{intent}
      - Used in POST /v1/payment_intents/{intent}
      - Used in POST /v1/payment_intents/{intent}/apply_customer_balance
      - Used in POST /v1/payment_intents/{intent}/cancel
      - Used in POST /v1/payment_intents/{intent}/capture
      - Used in POST /v1/payment_intents/{intent}/confirm
      - Used in POST /v1/payment_intents/{intent}/increment_authorization
      - Used in POST /v1/payment_intents/{intent}/verify_microdeposits
      - Used in GET /v1/payment_links
      - Used in POST /v1/payment_links
      - Used in GET /v1/payment_links/{payment_link}
      - Used in POST /v1/payment_links/{payment_link}
      - Used in GET /v1/payment_links/{payment_link}/line_items
      - Used in GET /v1/payment_method_configurations
      - Used in POST /v1/payment_method_configurations
      - Used in GET /v1/payment_method_configurations/{configuration}
      - Used in POST /v1/payment_method_configurations/{configuration}
      - Used in GET /v1/payment_method_domains
      - Used in POST /v1/payment_method_domains
      - Used in GET /v1/payment_method_domains/{payment_method_domain}
      - Used in POST /v1/payment_method_domains/{payment_method_domain}
      - Used in POST /v1/payment_method_domains/{payment_method_domain}/validate
      - Used in GET /v1/payment_methods
      - Used in POST /v1/payment_methods
      - Used in GET /v1/payment_methods/{payment_method}
      - Used in POST /v1/payment_methods/{payment_method}
      - Used in POST /v1/payment_methods/{payment_method}/attach
      - Used in POST /v1/payment_methods/{payment_method}/detach
      - Used in GET /v1/payouts
      - Used in POST /v1/payouts
      - Used in GET /v1/payouts/{payout}
      - Used in POST /v1/payouts/{payout}
      - Used in POST /v1/payouts/{payout}/cancel
      - Used in POST /v1/payouts/{payout}/reverse
      - Used in GET /v1/plans
      - Used in POST /v1/plans
      - Used in DELETE /v1/plans/{plan}
      - Used in GET /v1/plans/{plan}
      - Used in POST /v1/plans/{plan}
      - Used in GET /v1/prices
      - Used in POST /v1/prices
      - Used in GET /v1/prices/search
      - Used in GET /v1/prices/{price}
      - Used in POST /v1/prices/{price}
      - Used in GET /v1/products
      - Used in POST /v1/products
      - Used in GET /v1/products/search
      - Used in DELETE /v1/products/{id}
      - Used in GET /v1/products/{id}
      - Used in POST /v1/products/{id}
      - Used in GET /v1/products/{product}/features
      - Used in POST /v1/products/{product}/features
      - Used in DELETE /v1/products/{product}/features/{id}
      - Used in GET /v1/products/{product}/features/{id}
      - Used in GET /v1/promotion_codes
      - Used in POST /v1/promotion_codes
      - Used in GET /v1/promotion_codes/{promotion_code}
      - Used in POST /v1/promotion_codes/{promotion_code}
      - Used in GET /v1/quotes
      - Used in POST /v1/quotes
      - Used in GET /v1/quotes/{quote}
      - Used in POST /v1/quotes/{quote}
      - Used in POST /v1/quotes/{quote}/accept
      - Used in POST /v1/quotes/{quote}/cancel
      - Used in GET /v1/quotes/{quote}/computed_upfront_line_items
      - Used in POST /v1/quotes/{quote}/finalize
      - Used in GET /v1/quotes/{quote}/line_items
      - Used in GET /v1/quotes/{quote}/pdf
      - Used in GET /v1/radar/early_fraud_warnings
      - Used in GET /v1/radar/early_fraud_warnings/{early_fraud_warning}
      - Used in GET /v1/radar/value_list_items
      - Used in POST /v1/radar/value_list_items
      - Used in DELETE /v1/radar/value_list_items/{item}
      - Used in GET /v1/radar/value_list_items/{item}
      - Used in GET /v1/radar/value_lists
      - Used in POST /v1/radar/value_lists
      - Used in DELETE /v1/radar/value_lists/{value_list}
      - Used in GET /v1/radar/value_lists/{value_list}
      - Used in POST /v1/radar/value_lists/{value_list}
      - Used in GET /v1/refunds
      - Used in POST /v1/refunds
      - Used in GET /v1/refunds/{refund}
      - Used in POST /v1/refunds/{refund}
      - Used in POST /v1/refunds/{refund}/cancel
      - Used in GET /v1/reporting/report_runs
      - Used in POST /v1/reporting/report_runs
      - Used in GET /v1/reporting/report_runs/{report_run}
      - Used in GET /v1/reporting/report_types
      - Used in GET /v1/reporting/report_types/{report_type}
      - Used in GET /v1/reviews
      - Used in GET /v1/reviews/{review}
      - Used in POST /v1/reviews/{review}/approve
      - Used in GET /v1/setup_attempts
      - Used in GET /v1/setup_intents
      - Used in POST /v1/setup_intents
      - Used in GET /v1/setup_intents/{intent}
      - Used in POST /v1/setup_intents/{intent}
      - Used in POST /v1/setup_intents/{intent}/cancel
      - Used in POST /v1/setup_intents/{intent}/confirm
      - Used in POST /v1/setup_intents/{intent}/verify_microdeposits
      - Used in GET /v1/shipping_rates
      - Used in POST /v1/shipping_rates
      - Used in GET /v1/shipping_rates/{shipping_rate_token}
      - Used in POST /v1/shipping_rates/{shipping_rate_token}
      - Used in GET /v1/sigma/scheduled_query_runs
      - Used in GET /v1/sigma/scheduled_query_runs/{scheduled_query_run}
      - Used in POST /v1/sources
      - Used in GET /v1/sources/{source}
      - Used in POST /v1/sources/{source}
      - Used in GET /v1/sources/{source}/mandate_notifications/{mandate_notification}
      - Used in GET /v1/sources/{source}/source_transactions
      - Used in GET /v1/sources/{source}/source_transactions/{source_transaction}
      - Used in POST /v1/sources/{source}/verify
      - Used in GET /v1/subscription_items
      - Used in POST /v1/subscription_items
      - Used in DELETE /v1/subscription_items/{item}
      - Used in GET /v1/subscription_items/{item}
      - Used in POST /v1/subscription_items/{item}
      - Used in GET /v1/subscription_items/{subscription_item}/usage_record_summaries
      - Used in POST /v1/subscription_items/{subscription_item}/usage_records
      - Used in GET /v1/subscription_schedules
      - Used in POST /v1/subscription_schedules
      - Used in GET /v1/subscription_schedules/{schedule}
      - Used in POST /v1/subscription_schedules/{schedule}
      - Used in POST /v1/subscription_schedules/{schedule}/cancel
      - Used in POST /v1/subscription_schedules/{schedule}/release
      - Used in GET /v1/subscriptions
      - Used in POST /v1/subscriptions
      - Used in GET /v1/subscriptions/search
      - Used in DELETE /v1/subscriptions/{subscription_exposed_id}
      - Used in GET /v1/subscriptions/{subscription_exposed_id}
      - Used in POST /v1/subscriptions/{subscription_exposed_id}
      - Used in DELETE /v1/subscriptions/{subscription_exposed_id}/discount
      - Used in POST /v1/subscriptions/{subscription}/resume
      - Used in POST /v1/tax/calculations
      - Used in GET /v1/tax/calculations/{calculation}/line_items
      - Used in GET /v1/tax/registrations
      - Used in POST /v1/tax/registrations
      - Used in GET /v1/tax/registrations/{id}
      - Used in POST /v1/tax/registrations/{id}
      - Used in GET /v1/tax/settings
      - Used in POST /v1/tax/settings
      - Used in POST /v1/tax/transactions/create_from_calculation
      - Used in POST /v1/tax/transactions/create_reversal
      - Used in GET /v1/tax/transactions/{transaction}
      - Used in GET /v1/tax/transactions/{transaction}/line_items
      - Used in GET /v1/tax_codes
      - Used in GET /v1/tax_codes/{id}
      - Used in GET /v1/tax_ids
      - Used in POST /v1/tax_ids
      - Used in DELETE /v1/tax_ids/{id}
      - Used in GET /v1/tax_ids/{id}
      - Used in GET /v1/tax_rates
      - Used in POST /v1/tax_rates
      - Used in GET /v1/tax_rates/{tax_rate}
      - Used in POST /v1/tax_rates/{tax_rate}
      - Used in GET /v1/terminal/configurations
      - Used in POST /v1/terminal/configurations
      - Used in DELETE /v1/terminal/configurations/{configuration}
      - Used in GET /v1/terminal/configurations/{configuration}
      - Used in POST /v1/terminal/configurations/{configuration}
      - Used in POST /v1/terminal/connection_tokens
      - Used in GET /v1/terminal/locations
      - Used in POST /v1/terminal/locations
      - Used in DELETE /v1/terminal/locations/{location}
      - Used in GET /v1/terminal/locations/{location}
      - Used in POST /v1/terminal/locations/{location}
      - Used in GET /v1/terminal/readers
      - Used in POST /v1/terminal/readers
      - Used in DELETE /v1/terminal/readers/{reader}
      - Used in GET /v1/terminal/readers/{reader}
      - Used in POST /v1/terminal/readers/{reader}
      - Used in POST /v1/terminal/readers/{reader}/cancel_action
      - Used in POST /v1/terminal/readers/{reader}/process_payment_intent
      - Used in POST /v1/terminal/readers/{reader}/process_setup_intent
      - Used in POST /v1/terminal/readers/{reader}/refund_payment
      - Used in POST /v1/terminal/readers/{reader}/set_reader_display
      - Used in POST /v1/test_helpers/confirmation_tokens
      - Used in POST /v1/test_helpers/customers/{customer}/fund_cash_balance
      - Used in POST /v1/test_helpers/issuing/authorizations
      - Used in POST /v1/test_helpers/issuing/authorizations/{authorization}/capture
      - Used in POST /v1/test_helpers/issuing/authorizations/{authorization}/expire
      - Used in POST /v1/test_helpers/issuing/authorizations/{authorization}/increment
      - Used in POST /v1/test_helpers/issuing/authorizations/{authorization}/reverse
      - Used in POST /v1/test_helpers/issuing/cards/{card}/shipping/deliver
      - Used in POST /v1/test_helpers/issuing/cards/{card}/shipping/fail
      - Used in POST /v1/test_helpers/issuing/cards/{card}/shipping/return
      - Used in POST /v1/test_helpers/issuing/cards/{card}/shipping/ship
      - Used in POST /v1/test_helpers/issuing/personalization_designs/{personalization_design}/activate
      - Used in POST /v1/test_helpers/issuing/personalization_designs/{personalization_design}/deactivate
      - Used in POST /v1/test_helpers/issuing/personalization_designs/{personalization_design}/reject
      - Used in POST /v1/test_helpers/issuing/transactions/create_force_capture
      - Used in POST /v1/test_helpers/issuing/transactions/create_unlinked_refund
      - Used in POST /v1/test_helpers/issuing/transactions/{transaction}/refund
      - Used in POST /v1/test_helpers/refunds/{refund}/expire
      - Used in POST /v1/test_helpers/terminal/readers/{reader}/present_payment_method
      - Used in GET /v1/test_helpers/test_clocks
      - Used in POST /v1/test_helpers/test_clocks
      - Used in DELETE /v1/test_helpers/test_clocks/{test_clock}
      - Used in GET /v1/test_helpers/test_clocks/{test_clock}
      - Used in POST /v1/test_helpers/test_clocks/{test_clock}/advance
      - Used in POST /v1/test_helpers/treasury/inbound_transfers/{id}/fail
      - Used in POST /v1/test_helpers/treasury/inbound_transfers/{id}/return
      - Used in POST /v1/test_helpers/treasury/inbound_transfers/{id}/succeed
      - Used in POST /v1/test_helpers/treasury/outbound_payments/{id}
      - Used in POST /v1/test_helpers/treasury/outbound_payments/{id}/fail
      - Used in POST /v1/test_helpers/treasury/outbound_payments/{id}/post
      - Used in POST /v1/test_helpers/treasury/outbound_payments/{id}/return
      - Used in POST /v1/test_helpers/treasury/outbound_transfers/{outbound_transfer}
      - Used in POST /v1/test_helpers/treasury/outbound_transfers/{outbound_transfer}/fail
      - Used in POST /v1/test_helpers/treasury/outbound_transfers/{outbound_transfer}/post
      - Used in POST /v1/test_helpers/treasury/outbound_transfers/{outbound_transfer}/return
      - Used in POST /v1/test_helpers/treasury/received_credits
      - Used in POST /v1/test_helpers/treasury/received_debits
      - Used in POST /v1/tokens
      - Used in GET /v1/tokens/{token}
      - Used in GET /v1/topups
      - Used in POST /v1/topups
      - Used in GET /v1/topups/{topup}
      - Used in POST /v1/topups/{topup}
      - Used in POST /v1/topups/{topup}/cancel
      - Used in GET /v1/transfers
      - Used in POST /v1/transfers
      - Used in GET /v1/transfers/{id}/reversals
      - Used in POST /v1/transfers/{id}/reversals
      - Used in GET /v1/transfers/{transfer}
      - Used in POST /v1/transfers/{transfer}
      - Used in GET /v1/transfers/{transfer}/reversals/{id}
      - Used in POST /v1/transfers/{transfer}/reversals/{id}
      - Used in GET /v1/treasury/credit_reversals
      - Used in POST /v1/treasury/credit_reversals
      - Used in GET /v1/treasury/credit_reversals/{credit_reversal}
      - Used in GET /v1/treasury/debit_reversals
      - Used in POST /v1/treasury/debit_reversals
      - Used in GET /v1/treasury/debit_reversals/{debit_reversal}
      - Used in GET /v1/treasury/financial_accounts
      - Used in POST /v1/treasury/financial_accounts
      - Used in GET /v1/treasury/financial_accounts/{financial_account}
      - Used in POST /v1/treasury/financial_accounts/{financial_account}
      - Used in GET /v1/treasury/financial_accounts/{financial_account}/features
      - Used in POST /v1/treasury/financial_accounts/{financial_account}/features
      - Used in GET /v1/treasury/inbound_transfers
      - Used in POST /v1/treasury/inbound_transfers
      - Used in GET /v1/treasury/inbound_transfers/{id}
      - Used in POST /v1/treasury/inbound_transfers/{inbound_transfer}/cancel
      - Used in GET /v1/treasury/outbound_payments
      - Used in POST /v1/treasury/outbound_payments
      - Used in GET /v1/treasury/outbound_payments/{id}
      - Used in POST /v1/treasury/outbound_payments/{id}/cancel
      - Used in GET /v1/treasury/outbound_transfers
      - Used in POST /v1/treasury/outbound_transfers
      - Used in GET /v1/treasury/outbound_transfers/{outbound_transfer}
      - Used in POST /v1/treasury/outbound_transfers/{outbound_transfer}/cancel
      - Used in GET /v1/treasury/received_credits
      - Used in GET /v1/treasury/received_credits/{id}
      - Used in GET /v1/treasury/received_debits
      - Used in GET /v1/treasury/received_debits/{id}
      - Used in GET /v1/treasury/transaction_entries
      - Used in GET /v1/treasury/transaction_entries/{id}
      - Used in GET /v1/treasury/transactions
      - Used in GET /v1/treasury/transactions/{id}
      - Used in GET /v1/webhook_endpoints
      - Used in POST /v1/webhook_endpoints
      - Used in DELETE /v1/webhook_endpoints/{webhook_endpoint}
      - Used in GET /v1/webhook_endpoints/{webhook_endpoint}
      - Used in POST /v1/webhook_endpoints/{webhook_endpoint}
      - Changes:\
        ~~destinations on \`Account\` objects for accounts where
        [controller.requirement_collection](/api/accounts/object\#account_object-controller-requirement_collection)~~\
        **destinations on \`Account\` objects for connected accounts.**\
        ~~is \`application\`, which includes [Custom accounts](/connect/custom-accounts).~~\
        They can be bank accounts or debit cards as well, and are documented in the links above.
    
        Related guide: [Bank debits and transfers](/payments/bank-debits-transfers)

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - Changes
    - Changed documentation of operation POST /v1/climate/orders/{order}/cancel
      - Changes:\
        ~~<p>Cancels a Climate order. You can cancel an order within 30 days of creation. Stripe refunds the~~\
        **<p>Cancels a Climate order. You can cancel an order within 24 hours of creation. Stripe refunds the**\
    
        reservation <code>amount_subtotal</code>, but not the <code>amount_fees</code> for user-triggered cancellations.
        Frontier
        might cancel reservations if suppliers fail to deliver. If Frontier cancels the reservation, Stripe
        provides 90 days advance notice and refunds the <code>amount_total</code>.</p>

Version 2024-04-10 
  - Changes
    - Changed documentation of operation POST /v1/setup_intents/{intent}/cancel
      - Changes:\
        ~~<p>After you cancel it, setup is abandoned and any operations on the SetupIntent fail with an error.</p>~~\
        **<p>After you cancel it, setup is abandoned and any operations on the SetupIntent fail with an error. You can’t
        cancel the SetupIntent for a Checkout Session. <a href="/docs/api/checkout/sessions/expire">Expire the Checkout
        Session</a> instead.</p>**

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - Changes
    - Changed documentation of operation POST /v1/tax/transactions/create_from_calculation
      - Changes:\
        ~~<p>Creates a Tax <code>Transaction</code> from a calculation.</p>~~\
        **<p>Creates a Tax Transaction from a calculation, if that calculation hasn’t expired. Calculations expire after
        90 days.</p>**

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - Changes
    - In operation GET /v1/invoices/upcoming
      - Changed documentation of parameter subscription
        - Changes:\
          ~~The identifier of the subscription for which you'd like to retrieve the upcoming invoice. If not provided,
          but a \`subscription_items\` is provided, you will preview creating a subscription with those items. If
          neither \`subscription\` nor \`subscription_items\` is provided, you will retrieve the next upcoming invoice
          from among the customer's subscriptions.~~\
          **The identifier of the subscription for which you'd like to retrieve the upcoming invoice. If not provided,
          but a \`subscription_details.items\` is provided, you will preview creating a subscription with those items.
          If neither \`subscription\` nor \`subscription_details.items\` is provided, you will retrieve the next
          upcoming invoice from among the customer's subscriptions.**
    - In operation GET /v1/invoices/upcoming/lines
      - Changed documentation of parameter subscription
        - Changes:\
          ~~The identifier of the subscription for which you'd like to retrieve the upcoming invoice. If not provided,
          but a \`subscription_items\` is provided, you will preview creating a subscription with those items. If
          neither \`subscription\` nor \`subscription_items\` is provided, you will retrieve the next upcoming invoice
          from among the customer's subscriptions.~~\
          **The identifier of the subscription for which you'd like to retrieve the upcoming invoice. If not provided,
          but a \`subscription_details.items\` is provided, you will preview creating a subscription with those items.
          If neither \`subscription\` nor \`subscription_details.items\` is provided, you will retrieve the next
          upcoming invoice from among the customer's subscriptions.**

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - No changes

Version 2024-04-10 
  - Changes
    - In operation GET /v1/prices
      - Changed documentation of parameter lookup_keys
        - Changes:\
          ~~Only return the price with these lookup_keys, if any exist.~~\
          **Only return the price with these lookup_keys, if any exist. You can specify up to 10 lookup_keys.**
