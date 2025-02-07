use crate::core::types::Order;

pub fn get_html(order: &Order) -> Result<String, Box<dyn std::error::Error>> {
    let Order {
        order_id,
        customer,
        date,
        items,
        ..
    } = order;

    let mut items_html = String::new();
    let mut total = 0.0;
    for item in items {
        let subtotal = item.article.price * (item.quantity as f64);
        total += subtotal;
        items_html.push_str(&format!(
            r#"<tr>
                <td>{article_id}</td>
                <td>{name}</td>
                <td>{quantity}</td>
                <td>{price:.2} €</td>
                <td>{subtotal:.2} €</td>
            </tr>"#,
            article_id = item.article.article_id,
            name = item.article.name,
            quantity = item.quantity,
            price = item.article.price,
            subtotal = subtotal
        ));
    }

    let html = format!(
        r#"<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <title>Order Confirmation</title>
    <style>
        body {{ font-family: Arial, sans-serif; margin: 40px; }}
        .header {{ text-align: center; font-size: 24px; font-weight: bold; margin-bottom: 20px; }}
        .company-info, .customer-info, .order-details {{ margin-bottom: 20px; }}
        .table {{ width: 100%; border-collapse: collapse; }}
        .table th, .table td {{ border: 1px solid black; padding: 8px; text-align: left; }}
        .footer {{ margin-top: 470px; font-size: 12px; text-align: center; }}
        .info-container {{ display: flex; justify-content: space-between; }}
    </style>
</head>
<body>

    <div class="header">Order Confirmation</div>

    <div class="info-container">
        <div class="company-info">
            Example Company<br>
            Example Street 1, 12345 City<br>
            contact@example.de<br>
        </div>
        <div class="customer-info">
            {customer_name}<br>
            {customer_address}<br>
            {customer_email}
        </div>
    </div>

    <div class="order-details">
        <strong>Order-ID:</strong> {order_id}<br>
        <strong>Date:</strong> {date}
    </div>

    <table class="table">
        <tr>
            <th>Article-ID</th>
            <th>Article</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total Price</th>
        </tr>
        {items_html}
        <tr>
            <td colspan="4" style="text-align: right;"><strong>Total amount</strong></td>
            <td><strong>{total:.2} €</strong></td>
        </tr>
    </table>

    <div class="footer">
        Thank you for your order!<br>
        Please transfer the amount to our account within 14 days.<br>
        Example Company – VAT ID No.: DE123456789 – IBAN: DE12 3456 7890 1234 5678 90
    </div>

</body>
</html>
"#,
        customer_name = format!("{} {}", customer.first_name, customer.last_name),
        customer_address = customer.street,
        customer_email = customer.email,
        order_id = order_id,
        date = date,
        items_html = items_html,
        total = total,
    );

    Ok(html)
}
